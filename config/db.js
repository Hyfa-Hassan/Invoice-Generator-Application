import mongoose from 'mongoose';

const connectDB = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);  // Exit process with failure
    }
};

export default connectDB;
