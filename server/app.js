import express from 'express';
import path from 'node:path';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const createApp = ({ distDir }) => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', true);

  app.get('/healthz', (_req, res) => {
    res.set('Cache-Control', 'no-store').json({ status: 'ok' });
  });

  app.use((req, res, next) => {
    if (req.get('x-forwarded-proto') === 'http') {
      return res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
    }
    return next();
  });

  app.use((_req, res, next) => {
    res.set({
      'Strict-Transport-Security': `max-age=${ONE_YEAR_SECONDS}; includeSubDomains`,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
    });
    next();
  });

  app.use(
    '/assets',
    express.static(path.join(distDir, 'assets'), {
      immutable: true,
      maxAge: ONE_YEAR_SECONDS * 1000,
    })
  );

  app.use(
    express.static(distDir, {
      index: false,
      setHeaders: (res, filePath) =>
        res.set('Cache-Control', filePath.endsWith('.html') ? 'no-cache' : 'public, max-age=3600'),
    })
  );

  app.get('/{*splat}', (req, res, next) => {
    if (path.extname(req.path)) return next();
    res.set('Cache-Control', 'no-cache');
    return res.sendFile('index.html', { root: distDir });
  });

  app.use((_req, res) => {
    res.status(404).send('Not found');
  });

  return app;
};
