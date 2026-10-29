# IMovies — Full-Stack Movie Ticket Booking

A runnable MERN-style starter for an online cinema booking application. It includes a React frontend, Express REST API, MongoDB models, JWT authentication, movie/show management endpoints, and seat booking with server-side duplicate-booking protection.

## Stack
- Frontend: React, Vite, React Router, Axios, Bootstrap
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs
- Database: MongoDB
- Optional API testing: Postman

## Requirements
- Node.js 18+ recommended (Node.js 16 may not support every current dependency)
- npm
- MongoDB local instance or MongoDB Atlas connection string

## Run locally

### 1. Configure the backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Edit `server/.env` and set `MONGODB_URI` and a long random `JWT_SECRET`. API defaults to `http://localhost:5000`.

### 2. Configure and run the frontend
Open a second terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open the URL printed by Vite (normally `http://localhost:5173`).

### 3. Create an admin account
Register a normal account in the app. To promote an account, connect to MongoDB and set its `role` field to `admin`. Do not expose an admin-promotion endpoint publicly.

## Included
- Register/login with hashed passwords and JWT
- Movie list, search, details and showtime display
- Admin-only movie and show creation/deletion APIs
- Seat booking API with a MongoDB unique index to prevent duplicate seat bookings for a show
- User booking history
- Responsive React interface
- Health endpoint and centralized API error handling

## Important scope notes
This is a functional starter, not a production-certified ticketing platform. Payment processing, email/SMS notifications, cancellation/refund workflows, theatre geolocation, rate limiting, audit logs, and full automated tests are not integrated. Payment is intentionally not simulated as a real charge. Seat inventory should be validated under concurrency before public production use. Add real payment provider integration only with server-side verification and webhook handling.

## API overview
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (JWT)
- `GET /api/movies`
- `GET /api/movies/:id`
- `POST /api/movies` (admin)
- `DELETE /api/movies/:id` (admin)
- `GET /api/shows?movieId=<id>`
- `POST /api/shows` (admin)
- `POST /api/bookings` (JWT)
- `GET /api/bookings/my` (JWT)

## Git commands
After reviewing the code and configuring environment variables:
```bash
git init
git add .
git commit -m "Build IMovies full-stack booking starter"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```
Replace the remote URL with the actual repository. Never commit `.env` files.
