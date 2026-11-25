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
