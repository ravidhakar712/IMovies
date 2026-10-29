import { Router } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.post('/', requireAuth, async (req, res) => {
  const { showId, seats } = req.body;
  if (!mongoose.isValidObjectId(showId) || !Array.isArray(seats) || seats.length < 1 || seats.length > 10) {
    return res.status(400).json({ message: 'Choose a show and between 1 and 10 seats.' });
  }
  const cleanSeats = [...new Set(seats.map(s => String(s).trim().toUpperCase()))];
  if (cleanSeats.length !== seats.length || cleanSeats.some(s => !/^[A-Z]\d{1,2}$/.test(s))) {
    return res.status(400).json({ message: 'Seat selection is invalid or contains duplicates.' });
  }
  const show = await Show.findById(showId);
  if (!show || show.startsAt <= new Date()) return res.status(404).json({ message: 'Upcoming show not found.' });
  const maxRow = Math.ceil(show.totalSeats / 10);
  for (const seat of cleanSeats) {
    const row = seat.charCodeAt(0) - 64;
    const col = Number(seat.slice(1));
    if (row < 1 || row > maxRow || col < 1 || col > 10) return res.status(400).json({ message: `Seat ${seat} is outside this theatre layout.` });
  }
  const existing = await Booking.find({ show: showId, status: 'confirmed', seats: { $in: cleanSeats } }).select('seats');
  const taken = new Set(existing.flatMap(b => b.seats));
  const unavailable = cleanSeats.filter(s => taken.has(s));
  if (unavailable.length) return res.status(409).json({ message: `Already booked: ${unavailable.join(', ')}` });
  const booking = await Booking.create({
    user: req.user._id, show: showId, seats: cleanSeats,
    totalAmount: cleanSeats.length * show.price, status: 'confirmed'
  });
  res.status(201).json({ booking });
});
router.get('/my', requireAuth, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate({ path: 'show', populate: { path: 'movie', select: 'title posterUrl' } })
    .sort({ createdAt: -1 }).limit(100);
  res.json({ bookings });
});
export default router;
