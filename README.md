# CP+R Forms

The patient questionnaire site. Patients open it from links in emails and in the mobile app, fill in a questionnaire and submit it to The Hub's `/api/forms` API.

| Route | Form |
|---|---|
| `/had_form/:id` | Hospital Anxiety and Depression (HAD) scale |
| `/exe_form/:id` | Exercise + Confidence |

Any other path shows an error page.

## Prerequisites

- Node.js 22 (see `.nvmrc`) and npm
- A local instance of The Hub server, which serves `/api/forms`

## Development

```bash
npm install
npm run dev
```

## Contributing

Read [AGENTS.md](AGENTS.md) before opening a pull request. Every PR must pass the local gate (`bash scripts/ci-local.sh run`) on its head commit.
