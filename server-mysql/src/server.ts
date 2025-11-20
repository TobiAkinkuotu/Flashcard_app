import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { errorHandler, notFound } from './middleware/errorHandler';
import accountRoutes from './routes/accountRoutes';
import authRoutes from './routes/authRoutes';
import { initDB } from './services/db';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*'}));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`MySQL server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to init DB', err);
    process.exit(1);
  });
