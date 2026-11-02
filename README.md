# CP+R Forms

The patient questionnaire site. Patients open it from links in emails and in the mobile app, fill in a questionnaire and submit it to The Hub's `/api/forms` API.

| Route | Form |
|---|---|
| `/had_form/:id` | Hospital Anxiety and Depression (HAD) scale |
| `/exe_form/:id` | Exercise + Confidence |

Any other path shows an error page. Emailed links and the mobile app depend on these two paths, so never change them.

Built with React 19, TypeScript, Vite, react-router 7 and Tailwind 4, and served on Heroku by a small Express server.

## Prerequisites

- Node.js 22 (see `.nvmrc`) and npm
- A local instance of The Hub server, which serves `/api/forms` on port 5001

## Development

```bash
cp .env.example .env
npm install
npm run dev
```

The dev server runs on http://localhost:5173. Open a form with an athlete ID from your local Hub, for example http://localhost:5173/had_form/<athlete-id>.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of The Hub's forms API, for example `http://localhost:5001/api/forms`. Vite bakes it in at build time. |

## Checks

```bash
npm run check
```

This runs lint, type-check, the tests and the build. `npm test` runs the tests once and `npm run test:watch` watches.

## Deployment (Heroku)

Heroku installs dependencies, runs `heroku-postbuild` (`npm run build`), then starts `web: npm start` from the `Procfile`. `server/index.js` serves `dist/` on `PORT` with:

- `GET /healthz` for health checks
- a redirect from HTTP to HTTPS behind the Heroku router
- `Cache-Control: public, max-age=31536000, immutable` for hashed `/assets/*`, and `no-cache` for `index.html`
- HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and `X-Frame-Options: DENY`
- `index.html` for any other path without a file extension, so deep links work, and 404 for missing files

Set `VITE_API_URL` as a config var on the Heroku app before the first build, because it is read at build time.

To try the production build locally:

```bash
npm run build && PORT=5055 npm start
```

## Netlify redirect (cutover only)

The site used to be hosted on Netlify at `cpandrforms.netlify.app`, and links to it are still in sent emails and other apps. `deploy/netlify-redirect/_redirects` is a one-line Netlify site that permanently redirects every old URL, path included, to the Heroku host.

At cutover, replace `FORMS_HOST_PLACEHOLDER` with the new host and deploy that folder to the existing Netlify site by hand, for example with `netlify deploy --prod --dir deploy/netlify-redirect`. It is not part of the build or CI.

## Contributing

Read [AGENTS.md](AGENTS.md) before opening a pull request. Every PR must pass the local gate (`bash scripts/ci-local.sh run`) on its head commit.
