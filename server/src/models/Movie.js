import mongoose from 'mongoose';
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  description: { type: String, default: '', maxlength: 2000 },
  genre: { type: String, default: 'Drama' },
  language: { type: String, default: 'Hindi' },
  durationMinutes: { type: Number, min: 1, default: 120 },
  rating: { type: String, default: 'U/A' },
  posterUrl: { type: String, default: '' },
  releaseDate: { type: Date }
}, { timestamps: true });
movieSchema.index({ title: 'text', genre: 1, language: 1 });
export default mongoose.model('Movie', movieSchema);
