import mongoose from 'mongoose';

// Flexible connection setup
// If a real DB URI is provided, it connects.
// If missing, we track connection state to mock routes seamlessly.
export let isDbConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("⚠️ MONGODB_URI not found. Running with in-memory array fallback mock (for AI Studio Preview).");
    return;
  }
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Timeout faster on bad connections
    });
    isDbConnected = true;
    console.log('✅ MongoDB Connected Successfully');
  } catch (error: any) {
    console.warn('⚠️ Could not connect to MongoDB. Using in-memory fallback instead.');
    if (error.message && error.message.includes('bad auth')) {
       console.warn('ℹ️ Hint: The MONGODB_URI provided has incorrect authentication credentials. Please update it in the Secrets menu.');
    } else {
       console.warn(`ℹ️ Hint: Check your MONGODB_URI value in the secrets panel. Details: ${error.message}`);
    }
  }
};
