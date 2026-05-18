#!/usr/bin/env python3
"""
Byron Work Log (v1)
A simple Termux-friendly command-line app for logging daily maintenance work.
"""

from __future__ import annotations

import csv
import datetime as dt
import os
import sys
from pathlib import Path

# Shared storage path in Termux after running: termux-setup-storage
LOG_DIR = Path.home() / "storage" / "shared" / "ByronWorkLogs"
MASTER_CSV = LOG_DIR / "worklog_master.csv"

CSV_FIELDS = [
    "date",
    "start_time",
    "end_time",
    "unit_or_location",
    "work_order_number",
    "issue_reported",
    "findings",
    "work_performed",
    "parts_materials_used",
    "follow_up_needed",
    "photos_taken",
    "notes_for_yardi",
]


def safe_input(prompt: str) -> str:
    """Read input safely and return a stripped string (or empty on Ctrl+D/Ctrl+C)."""
    try:
        return input(prompt).strip()
    except (EOFError, KeyboardInterrupt):
        print("\nInput cancelled. Returning to menu.")
        return ""


def ensure_log_folder() -> bool:
    """Create the log folder if needed."""
    try:
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        return True
    except OSError as err:
        print(f"Error: Could not create log folder at {LOG_DIR}: {err}")
        return False


def today_date_str() -> str:
    return dt.date.today().isoformat()


def today_log_path() -> Path:
    return LOG_DIR / f"{today_date_str()}_worklog.txt"


def normalize_yes_no(value: str) -> str:
    """Normalize yes/no input. Blank is allowed."""
    if not value:
        return ""
    v = value.lower()
    if v in {"y", "yes"}:
        return "yes"
    if v in {"n", "no"}:
        return "no"
    return value  # keep original if user typed something custom


def add_new_entry() -> None:
    """Prompt user step by step and save one log entry to text + CSV."""
    if not ensure_log_folder():
        return

    now = dt.datetime.now()
    date_str = now.date().isoformat()
    start_default = now.strftime("%H:%M")

    print("\n--- Add New Work Log Entry ---")
    print("Press Enter to keep defaults or leave optional fields blank.\n")

    start_time = safe_input(f"Start time [{start_default}]: ") or start_default
    end_time = safe_input("End time (HH:MM, optional): ")
    unit_or_location = safe_input("Unit or location: ")
    work_order_number = safe_input("Work order number (optional): ")
    issue_reported = safe_input("Issue reported: ")
    findings = safe_input("Findings: ")
    work_performed = safe_input("Work performed: ")
    parts_materials_used = safe_input("Parts/materials used: ")
    follow_up_needed = safe_input("Follow-up needed: ")
    photos_taken = normalize_yes_no(safe_input("Photos taken? (yes/no, optional): "))
    notes_for_yardi = safe_input("Notes for Yardi: ")

    entry = {
        "date": date_str,
        "start_time": start_time,
        "end_time": end_time,
        "unit_or_location": unit_or_location,
        "work_order_number": work_order_number,
        "issue_reported": issue_reported,
        "findings": findings,
        "work_performed": work_performed,
        "parts_materials_used": parts_materials_used,
        "follow_up_needed": follow_up_needed,
        "photos_taken": photos_taken,
        "notes_for_yardi": notes_for_yardi,
    }

    # Human-readable text log
    text_block = (
        "\n" + "=" * 60 + "\n"
        f"Date: {entry['date']}\n"
        f"Start Time: {entry['start_time']}\n"
        f"End Time: {entry['end_time']}\n"
        f"Unit/Location: {entry['unit_or_location']}\n"
        f"Work Order #: {entry['work_order_number']}\n"
        f"Issue Reported: {entry['issue_reported']}\n"
        f"Findings: {entry['findings']}\n"
        f"Work Performed: {entry['work_performed']}\n"
        f"Parts/Materials Used: {entry['parts_materials_used']}\n"
        f"Follow-up Needed: {entry['follow_up_needed']}\n"
        f"Photos Taken: {entry['photos_taken']}\n"
        f"Notes for Yardi: {entry['notes_for_yardi']}\n"
        + "=" * 60
        + "\n"
    )

    try:
        with today_log_path().open("a", encoding="utf-8") as txt_file:
            txt_file.write(text_block)
    except OSError as err:
        print(f"Error writing text log file: {err}")
        return

    # Master CSV log
    try:
        csv_exists = MASTER_CSV.exists()
        with MASTER_CSV.open("a", newline="", encoding="utf-8") as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=CSV_FIELDS)
            if not csv_exists:
                writer.writeheader()
            writer.writerow(entry)
    except OSError as err:
        print(f"Error writing CSV file: {err}")
        return

    print("\nSaved entry successfully.")
    print(f"Daily log: {today_log_path()}")
    print(f"Master CSV: {MASTER_CSV}\n")


def view_today_log() -> None:
    """Show today's text log in the terminal."""
    if not ensure_log_folder():
        return

    path = today_log_path()
    if not path.exists():
        print("\nNo entries found for today yet.\n")
        return

    try:
        content = path.read_text(encoding="utf-8")
    except OSError as err:
        print(f"Error reading today's log: {err}")
        return

    print("\n--- Today's Log ---")
    print(content)


def export_today_summary() -> None:
    """Create a clean summary file for today's entries."""
    if not ensure_log_folder():
        return

    src = today_log_path()
    summary = LOG_DIR / f"{today_date_str()}_summary.txt"

    if not src.exists():
        print("\nNo daily log exists yet; add an entry first.\n")
        return

    timestamp = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        body = src.read_text(encoding="utf-8")
        summary_text = (
            f"Byron Work Log - Daily Summary\n"
            f"Generated: {timestamp}\n"
            f"Date: {today_date_str()}\n"
            + "-" * 60
            + "\n"
            + body
        )
        summary.write_text(summary_text, encoding="utf-8")
    except OSError as err:
        print(f"Error exporting summary: {err}")
        return

    print(f"\nSummary exported: {summary}\n")


def show_menu() -> None:
    print("Byron Work Log")
    print("-" * 30)
    print("1. Add new work log entry")
    print("2. View today's log")
    print("3. Export today's summary")
    print("4. Exit")


def main() -> int:
    """Main app loop."""
    if not ensure_log_folder():
        return 1

    while True:
        show_menu()
        choice = safe_input("\nChoose an option (1-4): ")

        if choice == "1":
            add_new_entry()
        elif choice == "2":
            view_today_log()
        elif choice == "3":
            export_today_summary()
        elif choice == "4":
            print("Goodbye.")
            return 0
        else:
            print("\nInvalid choice. Please enter 1, 2, 3, or 4.\n")


if __name__ == "__main__":
    sys.exit(main())
