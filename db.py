import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "tour_groups.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id INTEGER NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
    phone TEXT NOT NULL,
    status TEXT,
    status_code INTEGER,
    message_id TEXT,
    cost TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
"""


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    with get_connection() as conn:
        conn.executescript(SCHEMA)
    conn.close()


def create_group(name, date):
    with get_connection() as conn:
        cur = conn.execute(
            "INSERT INTO groups (name, date) VALUES (?, ?)", (name, date)
        )
        group_id = cur.lastrowid
    conn.close()
    return group_id


def add_member(group_id, name, phone):
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO members (group_id, name, phone) VALUES (?, ?, ?)",
            (group_id, name, phone),
        )
    conn.close()


def get_groups():
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, name, date FROM groups ORDER BY date, id"
        ).fetchall()
    conn.close()
    return rows


def get_group(group_id):
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, name, date FROM groups WHERE id = ?", (group_id,)
        ).fetchone()
    conn.close()
    return row


def get_group_members(group_id):
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, name, phone FROM members WHERE group_id = ? ORDER BY id",
            (group_id,),
        ).fetchall()
    conn.close()
    return rows


def save_alert(group_id, message, deliveries):
    """Save an alert and one delivery row per recipient.

    deliveries: list of (member_id, result) where result is a dict with keys
    phone, status, status_code, message_id, cost.
    """
    with get_connection() as conn:
        cur = conn.execute(
            "INSERT INTO alerts (group_id, message) VALUES (?, ?)",
            (group_id, message),
        )
        alert_id = cur.lastrowid
        conn.executemany(
            "INSERT INTO deliveries "
            "(alert_id, member_id, phone, status, status_code, message_id, cost) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                (
                    alert_id,
                    member_id,
                    r["phone"],
                    r["status"],
                    r["status_code"],
                    r["message_id"],
                    r["cost"],
                )
                for member_id, r in deliveries
            ],
        )
    conn.close()
    return alert_id


def get_dashboard(group_id):
    """Each member of the group with their most recent delivery (if any)."""
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT m.id, m.name, m.phone,
                   d.status, d.status_code, d.message_id, d.cost, d.created_at
            FROM members m
            LEFT JOIN deliveries d ON d.id = (
                SELECT d2.id FROM deliveries d2
                WHERE d2.member_id = m.id
                ORDER BY d2.id DESC LIMIT 1
            )
            WHERE m.group_id = ?
            ORDER BY m.id
            """,
            (group_id,),
        ).fetchall()
    conn.close()
    return rows


def get_members_by_group():
    """Return {group_id: [member rows]} for all groups."""
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, group_id, name, phone FROM members ORDER BY id"
        ).fetchall()
    conn.close()
    result = {}
    for row in rows:
        result.setdefault(row["group_id"], []).append(row)
    return result
