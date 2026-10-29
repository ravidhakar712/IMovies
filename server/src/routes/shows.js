import { Router } from 'express';
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.movieId) filter.movie = req.query.movieId;
  filter.startsAt = { $gte: new Date() };
  const shows = await Show.find(filter).populate('movie', 'title posterUrl').sort({ startsAt: 1 }).limit(100);
  res.json({ shows });
});
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { movieId, theatreName, city, startsAt, price, totalSeats } = req.body;
  if (!movieId || !theatreName || !city || !startsAt || !Number.isFinite(Number(price))) {
    return res.status(400).json({ message: 'Movie, theatre, city, start time, and price are required.' });
  }
  if (!(await Movie.exists({ _id: movieId }))) return res.status(400).json({ message: 'Select an existing movie.' });
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime()) || date <= new Date()) return res.status(400).json({ message: 'Show time must be in the future.' });
  const show = await Show.create({ movie: movieId, theatreName, city, startsAt: date, price: Number(price), totalSeats: Number(totalSeats) || 60 });
  res.status(201).json({ show });
});
export default router;
