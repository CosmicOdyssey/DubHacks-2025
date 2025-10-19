import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import router from './routes';
import { config } from './config';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = express();
app.use(cors());
import { rawBodySaver } from './middleware/rawBody';
app.use(express.json({ limit: '1mb', verify: rawBodySaver }));
app.use(pinoHttp({ logger }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'dee-api', ts: new Date().toISOString() });
});

app.use('/', router);

const port = Number(config.port || 4000);
app.listen(port, () => {
  logger.info({ port }, 'dee-api listening');
});


