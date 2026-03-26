# CourtSync — Futsal Court Booking Platform

A full-stack futsal court booking system built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## Prerequisites

Make sure these are installed on your machine:

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **Git** | any | `git --version` |

You also need a **MongoDB database** — either:
- **MongoDB Atlas** (cloud, free tier) → [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Local MongoDB** → [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

---

## Quick Start (5 steps)

### 1. Clone / Extract the project

```bash
# If cloned from git:
git clone <repo-url>
cd courtsync

# Or if you received a zip, just extract and cd into it:
cd courtsync
```

### 2. Set up the Backend

```bash
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Now **edit `backend/.env`** and set your MongoDB connection string:

```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/courtsync
NODE_ENV=development
JWT_SECRET=pick_any_random_secret_string_here
JWT_EXPIRES_IN=7d
```

> **If using local MongoDB**, keep the default: `MONGODB_URI=mongodb://localhost:27017/courtsync`
>
> **If using MongoDB Atlas**, go to your Atlas dashboard → Connect → Drivers → copy the connection string and replace `<username>`, `<password>`, and `<cluster>`. Also make sure your **current IP is whitelisted** in Atlas → Network Access.

### 3. Seed the Database (sample data)

```bash
# Still inside backend/
npm run seed:users     # Creates 3 users (admin + 2 regular)
npm run seed:courts    # Creates 2-3 sample courts
```

**Seeded accounts:**

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@courtsync.np` | `admin123` |
| User | `aarav@courtsync.np` | `user123` |
| User | `sita@courtsync.np` | `user123` |

### 4. Start the Backend

```bash
# Still inside backend/
npm run dev
```

You should see:
```
✓ Connected to MongoDB: ...
✓ WebSocket server initialized
✓ Server running on http://localhost:5000
```

**Leave this terminal running** and open a new terminal.

### 5. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

You should see:
```
VITE v6.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

**Open [http://localhost:3000](http://localhost:3000)** in your browser. Done!

---

## How It Works

- The **frontend** (Vite on port 3000) proxies all `/api/*` requests to the **backend** (Express on port 5000)
- No CORS issues to worry about — the Vite proxy handles it
- Auth uses JWT tokens stored in `localStorage`

---

## Project Structure

```
courtsync/
├── backend/                # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/         # DB, auth, payment config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas (User, Court, Booking, etc.)
│   │   ├── routes/         # Express route definitions
│   │   ├── services/       # Business logic
│   │   ├── validations/    # Zod schemas for request validation
│   │   ├── seeders/        # Database seed scripts
│   │   ├── socket/         # Socket.io setup
│   │   ├── types/          # TypeScript interfaces & enums
│   │   ├── utils/          # Helpers (API response, date, encryption)
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── .env.example        # Environment template
│   └── package.json
│
├── frontend/               # React + Vite + Tailwind CSS
│   ├── components/         # Shared UI components
│   ├── pages/              # Page components (Dashboard, Booking, Admin, etc.)
│   ├── services/           # API client (api.ts)
│   ├── App.tsx             # Root component with auth & routing
│   ├── types.ts            # Frontend TypeScript types
│   ├── vite.config.ts      # Vite config with API proxy
│   └── package.json
│
└── README.md               # ← You are here
```

---

## Available Scripts

### Backend (`cd backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run seed:users` | Seed sample users |
| `npm run seed:courts` | Seed sample courts |
| `npm run seed:all` | Seed everything |
| `npm test` | Run Jest tests |

### Frontend (`cd frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 3000) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED` on frontend | Make sure the backend is running on port 5000 |
| `MongoDB connection error` | Check your `MONGODB_URI` in `.env`. If using Atlas, whitelist your IP |
| `EADDRINUSE: port 5000` | Another process is using port 5000. Kill it: `npx kill-port 5000` |
| Login fails | Run `npm run seed:users` in backend to create the default accounts |
| Empty courts page | Run `npm run seed:courts` in backend to create sample courts |
| `Cannot find module` errors | Run `npm install` in both `backend/` and `frontend/` |

---

## Tech Stack

**Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, React Router v7

**Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Zod, Socket.io, bcrypt
