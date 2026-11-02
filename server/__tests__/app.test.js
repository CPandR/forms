import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

let distDir;
let app;

beforeAll(() => {
  distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forms-dist-'));
  fs.mkdirSync(path.join(distDir, 'assets'));
  fs.mkdirSync(path.join(distDir, 'fonts'));
  fs.writeFileSync(path.join(distDir, 'index.html'), '<!doctype html><div id="root"></div>');
  fs.writeFileSync(path.join(distDir, 'assets', 'index-abc123.js'), 'console.log(1);');
  fs.writeFileSync(path.join(distDir, 'fonts', 'Nunito-Regular.woff'), 'font');
  app = createApp({ distDir });
});

afterAll(() => {
  fs.rmSync(distDir, { recursive: true, force: true });
});

describe('static server', () => {
  it('reports health without caching', async () => {
    const res = await request(app).get('/healthz');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(res.headers['cache-control']).toBe('no-store');
  });

  it('reports health over plain HTTP so the router check never redirects', async () => {
    const res = await request(app).get('/healthz').set('X-Forwarded-Proto', 'http');

    expect(res.status).toBe(200);
  });

  it('redirects plain HTTP behind the Heroku router to HTTPS', async () => {
    const res = await request(app)
      .get('/had_form/507f1f77bcf86cd799439011?ref=email')
      .set('Host', 'forms.example.com')
      .set('X-Forwarded-Proto', 'http');

    expect(res.status).toBe(301);
    expect(res.headers.location).toBe('https://forms.example.com/had_form/507f1f77bcf86cd799439011?ref=email');
  });

  it('serves hashed assets as immutable', async () => {
    const res = await request(app).get('/assets/index-abc123.js').set('X-Forwarded-Proto', 'https');

    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toBe('public, max-age=31536000, immutable');
  });

  it('serves other public files with a short cache', async () => {
    const res = await request(app).get('/fonts/Nunito-Regular.woff').set('X-Forwarded-Proto', 'https');

    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toBe('public, max-age=3600');
  });

  it.each(['/', '/had_form/abc', '/exe_form/abc', '/somewhere/else', '/index.html'])(
    'serves index.html for %s without caching',
    async (url) => {
      const res = await request(app).get(url).set('X-Forwarded-Proto', 'https');

      expect(res.status).toBe(200);
      expect(res.text).toContain('<div id="root">');
      expect(res.headers['cache-control']).toBe('no-cache');
    },
  );

  it('sets security headers', async () => {
    const res = await request(app).get('/').set('X-Forwarded-Proto', 'https');

    expect(res.headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it.each(['/assets/missing-123.js', '/missing.png'])('returns 404 for a missing file at %s', async (url) => {
    const res = await request(app).get(url).set('X-Forwarded-Proto', 'https');

    expect(res.status).toBe(404);
    expect(res.text).not.toContain('<div id="root">');
  });
});
