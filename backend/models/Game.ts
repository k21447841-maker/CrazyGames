import mongoose, { Document, Model } from 'mongoose';

export interface IGame extends Document {
  title: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  category: string;
  tags: string[];
  active: boolean;
  plays: number;
  rating: number;
  ratingCount: number;
  createdAt: Date;
}

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String, required: true },
  embedUrl: { type: String, required: true },
  category: { type: String },
  tags: [String],
  active: { type: Boolean, default: true },
  plays: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Game: Model<IGame> = mongoose.models.Game || mongoose.model<IGame>('Game', gameSchema);
