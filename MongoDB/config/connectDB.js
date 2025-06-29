import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_URI}@${process.env.MONGODB_CLUSTER}.mongodb.net/${process.env.MONGODB_NAME}`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB 接続成功');
  } catch (error) {
    console.error('❌ MongoDB 接続エラー:', error);
    process.exit(1); // エラーが発生したらプロセスを終了
  }
};

export default connectDB;
