import mongoose from 'mongoose';
const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatreName: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  startsAt: { type: Date, required: true },
  price: { type: Number, required: true, min: 0 },
  totalSeats: { type: Number, default: 60, min: 1, max: 500 }
}, { timestamps: true });
export default mongoose.model('Show', showSchema);
