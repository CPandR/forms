import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT) || 5055;

createApp({ distDir }).listen(port, () => {
  console.info(`Serving ${distDir} on port ${port}`);
});
