# AI-MAINTENANCE-PLATFORM-

Phase 1.1 mobile-first field technician prototype for maintenance work orders.
A simple mobile-first maintenance workflow app for tracking active work orders.

## Features

- Dark mode, glove-friendly UI designed for Samsung Galaxy-sized phones.
- LocalStorage persistence: saved work orders remain after refresh/browser restart.
- Full Phase 1.1 work order fields including status, priority, category, descriptions, tech notes, timestamps, and labor hours.
- Status options: New, In Progress, Scheduled, On Hold, Parts Ordered, Reassigned, Canceled, Completed.
- Priority options: Scheduled, Urgent, Resident, Turn.
- Property autofill for Property Number `466`:
  - River Roads Manor
  - 2380 Grand River Road, Jennings, MO
- Start Work button to record actual start datetime.
- Complete Work button to record finish datetime, set status to Completed, and calculate total labor hours.
- Mobile-friendly saved order list with open/edit/save/delete actions.

## Run locally

- Home screen shows active work orders.
- Create work orders with:
  - issue title
  - apartment number
  - priority (low, medium, emergency)
  - notes
  - photo upload button
- Add quick notes to any active work order.
- Mark work orders complete.
- Includes fake sample maintenance data for testing.

## Run locally

This app is static HTML/CSS/JS, so you can run it with any local web server.

### Option 1: Python

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser.

## Files

- `index.html` – form and list UI.
- `styles.css` – dark mobile styling.
- `app.js` – localStorage, property autofill, and work-order time tracking logic.
Then open:

- `http://localhost:8080`

### Option 2: VS Code Live Server

- Open the project in VS Code.
- Start **Live Server** on `index.html`.

## Files

- `index.html` – app layout and form.
- `styles.css` – dark mode and mobile-friendly styling.
- `app.js` – work order logic and sample data.
