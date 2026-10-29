import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in server/.env');
await mongoose.connect(process.env.MONGODB_URI);
const samples = [
  { title: 'Midnight Run', genre: 'Thriller', language: 'English', durationMinutes: 128, rating: 'U/A', description: 'A tense night-time journey where every choice changes the story.' },
  { title: 'The Last Orbit', genre: 'Sci-Fi', language: 'English', durationMinutes: 116, rating: 'U/A', description: 'A crew races against time at the edge of the known universe.' },
  { title: 'Monsoon Letters', genre: 'Drama', language: 'Hindi', durationMinutes: 134, rating: 'U', description: 'A heartfelt story about home, memory, and second chances.' }
];
for (const movie of samples) {
  const existing = await Movie.findOne({ title: movie.title });
  if (!existing) await Movie.create(movie);
}
console.log('Sample movies added (existing titles were kept).');
await mongoose.disconnect();
