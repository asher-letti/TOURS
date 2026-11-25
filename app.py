import re
from datetime import date as date_cls

from flask import Flask, flash, redirect, render_template, request, url_for

import db

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


if __name__ == "__main__":
    app.run(debug=True)
