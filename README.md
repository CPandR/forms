# CP+R Forms (archived)

The HADS and Exercise + Confidence patient forms now live in The Clubhouse (`CPandR/the-clubhouse`):

| Form | URL |
|---|---|
| Hospital Anxiety and Depression (HAD) scale | `https://athletes.cpandr.co.uk/had_form/:id` |
| Exercise + Confidence | `https://athletes.cpandr.co.uk/exe_form/:id` |

This repository is archived. Make changes to the forms in The Clubhouse.

## Netlify redirect

The old site, `cpandrforms.netlify.app`, is still linked from sent emails and the mobile app. `deploy/netlify-redirect/_redirects` permanently redirects every old URL, path included, to `https://athletes.cpandr.co.uk`.

To deploy it, unlink this repo from the Netlify site, then either drag and drop the `deploy/netlify-redirect` folder onto the site's Deploys page or run:

```bash
npx netlify-cli deploy --prod --dir deploy/netlify-redirect --site <site-id>
```
