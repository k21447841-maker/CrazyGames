import mongoose, { Document, Model } from 'mongoose';

export interface IAdSettings extends Document {
  adsEnabled: boolean;
  bannerEnabled: boolean;
  interstitialEnabled: boolean;
  videoEnabled: boolean;
  adsterraPublisherId: string;
  updatedAt: Date;
}

const adSettingsSchema = new mongoose.Schema({
  adsEnabled: { type: Boolean, default: false },
  bannerEnabled: { type: Boolean, default: true },
  interstitialEnabled: { type: Boolean, default: false },
  videoEnabled: { type: Boolean, default: false },
  adsterraPublisherId: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

export const AdSettings: Model<IAdSettings> = mongoose.models.AdSettings || mongoose.model<IAdSettings>('AdSettings', adSettingsSchema);
