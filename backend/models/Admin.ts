import mongoose, { Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password?: string;
  role: string;
}

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

export const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);
