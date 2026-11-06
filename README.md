# labbz.io

The Labbz website: one self-contained page (`index.html`), bilingual (English and Arabic), light and dark, served by GitHub Pages at **labbz.io**.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site: pages are hash routes (`#ventures`, `#invest`, `#contact`, `#privacy` …). Images, logos and the investor teaser PDF are embedded. |
| `CNAME` | Tells GitHub Pages to serve the site at `labbz.io`. |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | From the Labbz brand pack (small-size master). |
| `og.png` | The preview image shown when the link is shared. |
| `.nojekyll` | Serves the files as they are. |

## Forms

On labbz.io the forms have no database behind them:

- **Contact and Request a call:** opens the visitor's email app with the message pre-filled, to info@labbz.io (or invest@labbz.io for investing).
- **Invest:** the teaser downloads straight away, then the visitor sends their details to invest@labbz.io by email.

A form backend hosted in Saudi Arabia can replace the email step later.

## Turning on GitHub Pages (once)

1. Repository **Settings → Pages**.
2. **Source:** Deploy from a branch. **Branch:** `main`, folder `/ (root)`. Save.
3. **Custom domain:** `labbz.io` (the `CNAME` file sets it). Tick **Enforce HTTPS** once the certificate is issued.

## DNS for labbz.io (at the domain registrar)

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | labbzio.github.io |

Remove any other A, AAAA or CNAME records on `@` and `www` first. DNS can take up to a day to spread.

## Updating the site

The source of truth is the Labbz Website artifact on claude.ai. Ask Claude to publish the latest version here; it rebuilds `index.html` and pushes to `main`, and Pages redeploys in a minute or two.
