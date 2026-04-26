# Options Trading Analytics API

A RESTful API for managing and analyzing stock and options trading activity.

## Tech Stack

- **Node.js** + **Express**
- **PostgreSQL** + **Prisma ORM**
- **JWT** authentication (bcryptjs for password hashing)
- **Swagger UI** at `/api/docs`

## Resources

| Resource | Authorization |
|---|---|
| Trades | Owner only |
| Strategies | Owner only |
| MarketSnapshots | Read: any auth user; Write/Delete: Admin only |

## Setup (Local)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** — copy `.env.example` to `.env` and fill in your database URL and JWT secret:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   JWT_SECRET="your-secret-key"
   ```

3. **Run Prisma migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the database**
   ```bash
   npx prisma db seed
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development with hot reload:
   npm run dev
   ```

6. **Open Swagger UI** at `http://localhost:3000/api/docs`

## Seed Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin123! |
| User | trader@example.com | Trader123! |

## Deployment (Render)

1. Push this repo to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) pointing to the repo.
3. Add the following environment variables in the Render dashboard:
   - `DATABASE_URL` — your PostgreSQL connection string (use Render's built-in Postgres or an external provider)
   - `JWT_SECRET` — a long random string
4. Render will run the `buildCommand` from `render.yaml` automatically, which migrates and seeds the database.
