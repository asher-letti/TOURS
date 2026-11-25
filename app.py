import re
from datetime import date as date_cls

from flask import Flask, flash, redirect, render_template, request, url_for

import db
from at_client import SMSError, send_bulk_sms

app = Flask(__name__)
app.secret_key = "dev-only-change-me"
db.init_db()

# International format: '+' followed by country code and number, 8-15 digits total.
PHONE_RE = re.compile(r"^\+[1-9]\d{7,14}$")


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
            flash(f"Alert not sent: {exc}", "error")
            return render_template(
                "send_alert.html", groups=groups, group_id=group_id_raw, message=message
            ), 502

        # Map each result back to its member by phone number.
        member_by_phone = {m["phone"]: m["id"] for m in members}
        deliveries = [(member_by_phone.get(r["phone"]), r) for r in results]
        db.save_alert(group_id, message, deliveries)

        accepted = sum(1 for r in results if r["status"] == "Success")
        flash(
            f"Alert sent to {len(results)} recipient(s); {accepted} accepted by the gateway.",
            "success",
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


if __name__ == "__main__":
    app.run(debug=True)
