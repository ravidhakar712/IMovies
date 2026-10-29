import { Router } from 'express';
import Movie from '../models/Movie.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.get('/', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const filter = q ? { $or: [
    { title: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
    { genre: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
    { language: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
  ] } : {};
  const movies = await Movie.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json({ movies });
});
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found.' });
  res.json({ movie });
});
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, genre, language, durationMinutes, rating, posterUrl } = req.body;
  if (!String(title || '').trim()) return res.status(400).json({ message: 'Movie title is required.' });
  const movie = await Movie.create({ title, description, genre, language, durationMinutes, rating, posterUrl });
  res.status(201).json({ movie });
});
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found.' });
  res.json({ message: 'Movie deleted.' });
});
export default router;
