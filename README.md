# AI-MAINTENANCE-PLATFORM-

A simple mobile-first maintenance workflow app for tracking active work orders.

## Features

- Dark mode, glove-friendly UI designed for Samsung Galaxy-sized phones.
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

Then open:

- `http://localhost:8080`

### Option 2: VS Code Live Server

- Open the project in VS Code.
- Start **Live Server** on `index.html`.

## Files

- `index.html` – app layout and form.
- `styles.css` – dark mode and mobile-friendly styling.
- `app.js` – work order logic and sample data.
