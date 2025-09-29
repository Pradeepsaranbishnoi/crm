## CRM Pro – Real-Time Collaborative CRM

Modern, collaborative CRM with real-time updates for sales teams.

### Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Express (TypeScript), Prisma ORM, PostgreSQL
- **Realtime**: Socket.IO
- **DevOps**: Docker (frontend, backend, db)

### Features
- Authentication (JWT) with seeded demo users
- Lead management: create, assign, update, delete
- Activity timeline: notes, calls, emails
- Dashboard with charts and KPIs
- Real-time updates and collaborative notes
- RBAC (admin / manager / sales_rep)

---

## Quick Start (Docker)
```bash
docker compose up --build
```
Apps:
- Frontend: http://localhost:3000
- Backend:  http://localhost:4000/health

Demo accounts (password for all = `password`):
- admin@crm.com (Admin)
- manager@crm.com (Manager)
- sales@crm.com (Sales Rep)

Tip: On `/login`, click the “Use” button next to any demo account to autofill credentials.

---

## Local Development
Backend:
```bash
cd backend
npm install
copy .env.example .env # or create your .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
Frontend:
```bash
npm install
set NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api # Powershell: setx ... or export on *nix
npm run dev
```

---

## Project Structure
- `app/` – Next.js app routes and pages
- `components/` – UI and feature components
- `lib/` – API clients, services, types, utils, websocket client
- `backend/` – Express server (routes, middleware), Prisma schema and seed
- `docker-compose.yml` – FE/BE/DB services

---

## Security & Validation
- JWT auth (`Authorization: Bearer <token>`) and RBAC middleware
- Zod validation on backend inputs

---

## Scripts
- `docker compose up --build` – start full stack
- `cd backend && npx prisma migrate dev --name init` – apply schema locally
- `cd backend && npm run dev` – start API locally

---

## Screenshots
Add screenshots of Dashboard, Leads, and Collaboration here.


## CRM Pro – Real-Time Collaborative CRM

A modern, collaborative CRM platform with real-time updates for sales teams.

### Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Express (TypeScript), Prisma ORM, PostgreSQL
- **Realtime**: Socket.IO
- **DevOps**: Docker (frontend, backend, db)

### Features
- Authentication (JWT) with seeded demo users
- Lead management: create, assign, update, delete
- Activity timeline: notes, calls, emails
- Dashboard with charts and KPIs
- Real-time updates and collaborative notes
- RBAC (admin / manager / sales_rep)

---

## Quick Start (Docker)
```bash
docker compose up --build
```
Apps:
- Frontend: http://localhost:3000
- Backend:  http://localhost:4000/health

Demo accounts (password for all = `password`):
- admin@crm.com (Admin)
- manager@crm.com (Manager)
- sales@crm.com (Sales Rep)

Tip: On `/login`, click the “Use” button next to any demo account to autofill credentials.

---

## Local Development
Backend:
```bash
cd backend
npm install
copy .env.example .env # or create your .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
Frontend:
```bash
npm install
set NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api # Powershell: setx ... or export on *nix
npm run dev
```

---

## Project Structure
- `app/` – Next.js app routes and pages
- `components/` – UI and feature components
- `lib/` – API clients, services, types, utils, websocket client
- `backend/` – Express server (routes, middleware), Prisma schema and seed
- `docker-compose.yml` – FE/BE/DB services

---

## Security & Validation
- JWT auth (`Authorization: Bearer <token>`) and RBAC middleware
- Zod validation on backend inputs

---

## Scripts
- `docker compose up --build` – start full stack
- `cd backend && npx prisma migrate dev --name init` – apply schema locally
- `cd backend && npm run dev` – start API locally

