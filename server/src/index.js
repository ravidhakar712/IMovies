import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import showRoutes from './routes/shows.js';
import bookingRoutes from './routes/bookings.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'imovies-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ message: 'Please check the submitted fields.' });
  if (err.code === 11000) return res.status(409).json({ message: 'That seat has already been booked.' });
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Unexpected server error.' });
});

const port = Number(process.env.PORT || 5000);
try {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error('Set MONGODB_URI and JWT_SECRET in server/.env before starting.');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
  app.listen(port, () => console.log(`IMovies API listening on http://localhost:${port}`));
} catch (error) {
  console.error('Startup failed:', error.message);
  process.exit(1);
}
