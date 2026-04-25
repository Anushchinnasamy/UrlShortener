# URL Shortener Frontend

Modern React frontend for the Spring Boot URL Shortener backend.

## Tech

- React (Vite)
- Tailwind CSS
- Framer Motion
- Axios
- React Router

## Setup

From `frontend/`:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

### Optional environment overrides

- `VITE_API_BASE_URL` - Explicit backend base URL for frontend requests.
  - Leave unset in local Vite dev to use proxy (`/auth`, `/api`).
  - Set it when serving frontend without Vite proxy (example: `http://localhost:8080`).
- `VITE_PROXY_TARGET` - Backend URL used by Vite dev server proxy.
  - Default: `http://localhost:8080`.

## Backend API

This frontend calls your backend at **`http://localhost:8080`**:

- `POST /auth/register` → `{ message }`
- `POST /auth/login` → `{ token }` (stored in `localStorage`)
- `POST /api/shorten` (JWT) → `{ shortUrl }`
- `GET /api/analytics/{shortCode}` (JWT) → `{ shortCode, longUrl, clickCount }`

## Notes

- The backend does not expose a “list my links” endpoint, so the dashboard stores your shortened links **locally** in `localStorage` and then hydrates click counts via analytics.

