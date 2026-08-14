# Verdant & Co. — Admin Dashboard

A standalone admin dashboard for managing the Verdant & Co. public website: bookings, services, and business settings, behind a login page.

## Getting started

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

### Demo login

```
Email:    admin@verdantandco.africa
Password: verdant2026
```

## Build for production

```bash
npm run build
npm run preview   # optional, serves the production build locally
```

## What's included

- **Login page** (`src/pages/Login.jsx`) — gates the whole dashboard
- **Overview** (`src/pages/Overview.jsx`) — revenue, booking counts, a revenue-by-service chart, and recent activity
- **Bookings** (`src/pages/Bookings.jsx`) — searchable, filterable table of every booking, with a detail view and status updates (Paid / Pending / Cancelled)
- **Services** (`src/pages/Services.jsx`) — add, edit, and delete the services shown on the public site, including price and image
- **Settings** (`src/pages/Settings.jsx`) — business contact details, Paystack public key, and a data reset

## Important: this is a demo data layer

This dashboard is fully interactive, but it isn't wired to a real backend. Two things to know:

1. **Auth is mocked.** `src/context/AuthContext.jsx` checks a hardcoded email/password and stores a flag in `localStorage`. That's fine for a demo, but before this is exposed to the internet, replace it with real server-side authentication (a backend that issues a session token or sets an httpOnly cookie — don't just check credentials in the browser).

2. **Data is mocked.** `src/lib/storage.js` seeds and persists bookings, services, and settings entirely in `localStorage`, scoped to your browser. It's a stand-in for a real database. To reflect actual bookings made on the public Verdant & Co. website, you'll need:
   - A backend/database that the public site writes a booking to when someone submits the form
   - A Paystack **webhook** (not just the frontend callback) that confirms payment server-side and updates that booking's status — this prevents someone from faking a "successful" payment client-side
   - This dashboard's pages updated to fetch from that backend's API instead of `src/lib/storage.js`

## Project structure

```
src/
  main.jsx
  App.jsx                  # routes
  index.css
  context/
    AuthContext.jsx         # mock auth
  components/
    ProtectedRoute.jsx
    Sidebar.jsx
    StatCard.jsx
    StatusBadge.jsx
    Modal.jsx
  pages/
    Login.jsx
    Overview.jsx
    Bookings.jsx
    Services.jsx
    Settings.jsx
  lib/
    storage.js               # mock data layer (localStorage)
```
