# Byron Work Log (v1)

A simple, **Termux-friendly** Python command-line app for apartment maintenance technicians to log daily work orders.

This tool stores logs in Android shared storage so entries are easy to review later and manually enter into Yardi.

## Features

- Runs locally with Python: `python worklog.py`
- No external dependencies
- Saves daily logs in:
  - `~/storage/shared/ByronWorkLogs/`
- Auto-creates the folder if it doesn't exist
- Creates daily text logs named:
  - `YYYY-MM-DD_worklog.txt`
- Appends every entry to:
  - `worklog_master.csv`
- Simple menu:
  1. Add new work log entry
  2. View today's log
  3. Export today's summary
  4. Exit

## Termux Setup

1. Install Python in Termux:

   ```bash
   pkg update
   pkg install python
   ```

2. Allow Termux storage access (required for shared storage path):

   ```bash
   termux-setup-storage
   ```

3. Place this project folder anywhere in Termux, then run:

   ```bash
   python worklog.py
   ```

## Usage

From the menu:

- Choose `1` to add a new work log entry.
- Answer prompts one question at a time.
- Press Enter to leave optional fields blank.
- Choose `2` to view today's log file in the terminal.
- Choose `3` to export today's summary file.
- Choose `4` to exit.

## Files Created

Inside `~/storage/shared/ByronWorkLogs/`:

- `YYYY-MM-DD_worklog.txt` (daily text entries)
- `worklog_master.csv` (all entries in one CSV)
- `YYYY-MM-DD_summary.txt` (exported summary for the day)

## Notes

- This is intentionally **Version 1**: simple and reliable.
- No cloud sync, AI features, database, Yardi integration, login, or voice tools included.
