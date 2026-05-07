import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { aiRouter } from './routes/ai';

const app = express();
const PORT = process.env['PORT'] ?? 3001;

const allowedOrigins = process.env['CLIENT_ORIGIN']
  ? process.env['CLIENT_ORIGIN'].split(',').map((o) => o.trim())
  : [];

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '5kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', aiRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`TaroCarta server running on port ${PORT}`);
});

export default app;
