import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import memoRoutes from './routes/memoRoutes.js';
import customFolderRoutes from './routes/customFolderRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import inquirieRoutes from './routes/inquirieRoutes.js'
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS設定（全てのオリジンを許可）
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// MongoDB へ接続
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/memos', memoRoutes);
app.use('/api/customFolders', customFolderRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/inquiries', inquirieRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ サーバー起動: http://localhost:${PORT}`)
);
