import mongoose from 'mongoose';

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTER}.mongodb.net/${process.env.MONGODB_NAME}`;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        console.log('✅ MongoDB 接続成功'); // 接続成功時
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB 接続エラー:', error); // 接続失敗時
        process.exit(1); // エラーが発生したらプロセス終了
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}