import mongoose from 'mongoose';

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDb;
