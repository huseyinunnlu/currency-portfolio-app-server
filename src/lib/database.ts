import mongoose from 'mongoose';
import 'dotenv/config';

// Initialize connection
export async function connectToDatabase() {
    await mongoose.connect(process.env.MONGODB_URI || '');
}

// Listen for connection errors after initial connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

export default mongoose;
