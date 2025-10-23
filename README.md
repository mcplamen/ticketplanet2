# ticket-planet

Ticket Planet - backend scaffold for ticket SaaS (Express + Prisma + SQLite)

## Quick start (local)

1. Install dependencies
```bash
npm install
```

2. Copy `.env.example` -> `.env` and update values.
You can paste your `service-account.json` content into `SERVICE_ACCOUNT_JSON` env var.

3. Initialize Prisma and SQLite DB
```bash
npx prisma migrate dev --name init
```

4. Start server
```bash
npm run dev
```

## Endpoints
- POST /auth/register
- POST /auth/login
- POST /upload/logo (multipart/form-data, file field: `logo`, Authorization: Bearer <token>)
- POST /events (Authorization)
- GET /events
- POST /generate-ticket (Authorization Bearer <token> OR header `x-api-key`)

Uploads are stored in `uploads/`.
