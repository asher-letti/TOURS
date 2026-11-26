import re
from datetime import date as date_cls
from datetime import datetime, timedelta, timezone
from pathlib import Path

from flask import (
    Flask,
    flash,
    jsonify,
    redirect,
    render_template,
    request,
    send_from_directory,
    url_for,
)

import db
from at_client import SMSError, send_bulk_sms

app = Flask(__name__)
app.secret_key = "dev-only-change-me"
db.init_db()

# International format: '+' followed by country code and number, 8-15 digits total.
PHONE_RE = re.compile(r"^\+[1-9]\d{7,14}$")


@app.template_filter("friendly_date")
def friendly_date(value):
    """'2026-03-16' -> '16 March 2026'."""
    d = date_cls.fromisoformat(value)
    return f"{d.day} {d.strftime('%B %Y')}"


@app.template_filter("display_name")
def display_name(value):
    """'ann  OTIENO' -> 'Ann Otieno' (display only; stored value is unchanged)."""
    return " ".join(value.split()).title()


@app.template_filter("display_phone")
def display_phone(value):
    """'+254711111111' -> '+254 711 111 111'. Other formats are returned as-is."""
    m = re.fullmatch(r"\+254(\d{3})(\d{3})(\d{3})", value or "")
    if m:
        return f"+254 {m.group(1)} {m.group(2)} {m.group(3)}"
    return value


@app.template_filter("friendly_timestamp")
def friendly_timestamp(value):
    """Stored UTC timestamp -> 'Today at 9:19 AM', 'Yesterday at ...', or '16 March 2026 at ...'."""
    if not value:
        return "-"
    utc = datetime.strptime(value, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
    local = utc.astimezone()
    time_part = local.strftime("%I:%M %p").lstrip("0")
    today = datetime.now().astimezone().date()
    if local.date() == today:
        return f"Today at {time_part}"
    if local.date() == today - timedelta(days=1):
        return f"Yesterday at {time_part}"
    return f"{friendly_date(local.date().isoformat())} at {time_part}"


@app.route("/")
def index():
    return redirect(url_for("groups_list"))


@app.route("/groups/new", methods=["GET", "POST"])
def create_group():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        date_str = request.form.get("date", "").strip()

        error = None
        if not name:
            error = "Group name is required."
        else:
            try:
                date_cls.fromisoformat(date_str)
            except ValueError:
                error = "A valid date is required."

        if error:
            flash(error, "error")
            return render_template("create_group.html", name=name, date=date_str), 400

        db.create_group(name, date_str)
        flash(f"Group '{name}' created.", "success")
        return redirect(url_for("groups_list"))

    return render_template("create_group.html", name="", date="")


@app.route("/groups/<int:group_id>/members", methods=["GET", "POST"])
def add_members(group_id):
    group = db.get_group(group_id)
    if group is None:
        return "Group not found.", 404

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        phone = request.form.get("phone", "").strip().replace(" ", "")

        error = None
        if not name:
            error = "Member name is required."
        elif not PHONE_RE.match(phone):
            error = "Phone must be in international format, e.g. +2547XXXXXXXX."

        if error:
            flash(error, "error")
            return render_template(
                "add_members.html", group=group, name=name, phone=phone
            ), 400

        db.add_member(group_id, name, phone)
        flash(f"Added {name}.", "success")
        return redirect(url_for("add_members", group_id=group_id))

    return render_template("add_members.html", group=group, name="", phone="")


@app.route("/groups")
def groups_list():
    groups = db.get_groups()
    members = db.get_members_by_group()
    return render_template("groups.html", groups=groups, members=members)


@app.route("/alerts/new", methods=["GET", "POST"])
def send_alert():
    groups = db.get_groups()

    if request.method == "POST":
        group_id_raw = request.form.get("group_id", "").strip()
        message = request.form.get("message", "").strip()
        selected = None

        error = None
        try:
            group_id = int(group_id_raw)
            selected = db.get_group(group_id)
        except ValueError:
            group_id = None
        if selected is None:
            error = "Choose a valid group."
        elif not message:
            error = "Type a message to send."

        members = db.get_group_members(group_id) if selected else []
        if not error and not members:
            error = "This group has no members to send to."

        if error:
            flash(error, "error")
            return render_template(
                "send_alert.html", groups=groups, group_id=group_id_raw, message=message
            ), 400

        phones = [m["phone"] for m in members]
        try:
            results = send_bulk_sms(phones, message)
        except SMSError as exc:
            # Nothing was recorded because the request did not complete.
            flash("The alert couldn't be sent. Please try again in a moment.", "error")
            return render_template(
                "send_alert.html", groups=groups, group_id=group_id_raw, message=message
            ), 502

        # Map each result back to its member by phone number.
        member_by_phone = {m["phone"]: m["id"] for m in members}
        deliveries = [(member_by_phone.get(r["phone"]), r) for r in results]
        db.save_alert(group_id, message, deliveries)

        accepted = sum(1 for r in results if r["status"] == "Success")
        total = len(results)
        if accepted == total:
            noun = "person" if accepted == 1 else "people"
            flash(f"Message sent to {accepted} {noun}.", "success")
        else:
            flash(
                f"Sent to {accepted} of {total} people.",
                "success" if accepted else "error",
            )
        return redirect(url_for("group_dashboard", group_id=group_id))

    selected_id = request.args.get("group_id", "")
    return render_template(
        "send_alert.html", groups=groups, group_id=selected_id, message=""
    )


@app.route("/groups/<int:group_id>/dashboard")
def group_dashboard(group_id):
    group = db.get_group(group_id)
    if group is None:
        return "Group not found.", 404
    rows = db.get_dashboard(group_id)
    return render_template("dashboard.html", group=group, rows=rows)


# ---------------------------------------------------------------------------
# JSON API used by the React frontend. The Jinja pages above are unchanged.
# Every response is JSON; errors look like {"error": "message"}.
# ---------------------------------------------------------------------------


def _api_error(message, status):
    return jsonify({"error": message}), status


def _group_json(group):
    return {
        "id": group["id"],
        "name": group["name"],
        "display_name": display_name(group["name"]),
        "date": group["date"],
        "display_date": friendly_date(group["date"]),
    }


def _member_json(member):
    return {
        "id": member["id"],
        "name": member["name"],
        "display_name": display_name(member["name"]),
        "phone": member["phone"],
        "display_phone": display_phone(member["phone"]),
    }


def _delivery_state(status):
    """Map the raw gateway status to what the UI shows."""
    if status == "Success":
        return "sent", None
    if status == "InvalidPhoneNumber":
        return "failed", "Check phone number"
    if status:
        return "failed", "Try again."
    return "not_sent", None


def _alert_banner(accepted, total):
    if accepted == total:
        noun = "person" if accepted == 1 else "people"
        return f"Message sent to {accepted} {noun}."
    return f"Sent to {accepted} of {total} people."


@app.route("/api/groups", methods=["GET"])
def api_groups():
    members = db.get_members_by_group()
    groups = []
    for g in db.get_groups():
        item = _group_json(g)
        item["member_count"] = len(members.get(g["id"], []))
        groups.append(item)
    return jsonify({"groups": groups})


@app.route("/api/groups", methods=["POST"])
def api_create_group():
    body = request.get_json(silent=True) or {}
    name = str(body.get("name", "")).strip()
    date_str = str(body.get("date", "")).strip()

    if not name:
        return _api_error("Group name is required.", 400)
    try:
        date_cls.fromisoformat(date_str)
    except ValueError:
        return _api_error("A valid date is required.", 400)

    group_id = db.create_group(name, date_str)
    return jsonify({"group": _group_json(db.get_group(group_id))}), 201


@app.route("/api/groups/<int:group_id>", methods=["GET"])
def api_group(group_id):
    group = db.get_group(group_id)
    if group is None:
        return _api_error("Group not found.", 404)
    return jsonify(
        {
            "group": _group_json(group),
            "members": [_member_json(m) for m in db.get_group_members(group_id)],
        }
    )


@app.route("/api/groups/<int:group_id>/members", methods=["POST"])
def api_add_member(group_id):
    if db.get_group(group_id) is None:
        return _api_error("Group not found.", 404)

    body = request.get_json(silent=True) or {}
    name = str(body.get("name", "")).strip()
    phone = str(body.get("phone", "")).strip().replace(" ", "")

    if not name:
        return _api_error("Member name is required.", 400)
    if not PHONE_RE.match(phone):
        return _api_error(
            "Phone must be in international format, e.g. +2547XXXXXXXX.", 400
        )

    db.add_member(group_id, name, phone)
    members = db.get_group_members(group_id)
    return jsonify({"member": _member_json(members[-1])}), 201


@app.route("/api/alerts", methods=["POST"])
def api_send_alert():
    body = request.get_json(silent=True) or {}
    message = str(body.get("message", "")).strip()

    group_id_raw = body.get("group_id")
    try:
        group_id = int(str(group_id_raw).strip())
    except ValueError:
        return _api_error("Choose a valid group.", 400)

    if db.get_group(group_id) is None:
        return _api_error("Choose a valid group.", 400)
    if not message:
        return _api_error("Type a message to send.", 400)

    members = db.get_group_members(group_id)
    if not members:
        return _api_error("This group has no members to send to.", 400)

    phones = [m["phone"] for m in members]
    try:
        results = send_bulk_sms(phones, message)
    except SMSError:
        # Nothing was recorded because the request did not complete.
        return _api_error(
            "The alert couldn't be sent. Please try again in a moment.", 502
        )

    member_by_phone = {m["phone"]: m["id"] for m in members}
    deliveries = [(member_by_phone.get(r["phone"]), r) for r in results]
    alert_id = db.save_alert(group_id, message, deliveries)

    accepted = sum(1 for r in results if r["status"] == "Success")
    total = len(results)
    return (
        jsonify(
            {
                "alert_id": alert_id,
                "sent": accepted,
                "total": total,
                "ok": accepted > 0,
                "message": _alert_banner(accepted, total),
            }
        ),
        201,
    )


@app.route("/api/groups/<int:group_id>/dashboard", methods=["GET"])
def api_dashboard(group_id):
    group = db.get_group(group_id)
    if group is None:
        return _api_error("Group not found.", 404)

    rows = []
    for r in db.get_dashboard(group_id):
        state, reason = _delivery_state(r["status"])
        rows.append(
            {
                "id": r["id"],
                "display_name": display_name(r["name"]),
                "display_phone": display_phone(r["phone"]),
                "state": state,
                "reason": reason,
                "last_sent": friendly_timestamp(r["created_at"])
                if r["created_at"]
                else None,
                "created_at_utc": r["created_at"],
                "details": {
                    "gateway_status": r["status"],
                    "message_id": r["message_id"],
                    "cost": r["cost"],
                },
            }
        )

    summary = {
        "total": len(rows),
        "sent": sum(1 for r in rows if r["state"] == "sent"),
        "attention": sum(1 for r in rows if r["state"] == "failed"),
    }
    return jsonify({"group": _group_json(group), "summary": summary, "rows": rows})


# ---------------------------------------------------------------------------
# React frontend. `npm run build` in frontend/ creates frontend/dist, which is
# served here under /app/. Unknown /app/... paths return index.html so the
# React router can handle them (deep links and page refreshes).
# ---------------------------------------------------------------------------

FRONTEND_DIST = Path(__file__).parent / "frontend" / "dist"


@app.route("/app", defaults={"path": ""})
@app.route("/app/", defaults={"path": ""})
@app.route("/app/<path:path>")
def frontend(path):
    if not (FRONTEND_DIST / "index.html").exists():
        return (
            "The frontend has not been built yet. "
            "Run 'npm install' and 'npm run build' in the frontend folder, "
            "or use 'npm run dev' while developing.",
            503,
        )
    target = (FRONTEND_DIST / path).resolve()
    # Serve real files (assets, favicon); never anything outside dist.
    if path and target.is_file() and FRONTEND_DIST.resolve() in target.parents:
        return send_from_directory(FRONTEND_DIST, path)
    return send_from_directory(FRONTEND_DIST, "index.html")


@app.errorhandler(404)
def not_found(err):
    # JSON for API paths, the normal page for everything else.
    if request.path.startswith("/api/"):
        return _api_error("Not found.", 404)
    return err


if __name__ == "__main__":
    app.run(debug=True)
