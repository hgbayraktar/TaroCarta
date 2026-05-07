import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { aiRouter } from './routes/ai';

const app = express();
const PORT = process.env['PORT'] ?? 3001;

app.use(cors({ origin: process.env['CLIENT_ORIGIN'] ?? '*' }));
app.use(express.json({ limit: '10kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', aiRouter);

app.listen(PORT, () => {
  console.log(`TaroCarta server running on port ${PORT}`);
});

export default app;
