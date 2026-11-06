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

## Form submissions

Every Invest, Contact and Request a call submission is saved as a row in a Google Sheet owned by the Labbz Google account, and an email goes to that account for each one. The page posts to a Google Apps Script web app (`forms/labbz-forms.gs`); its URL is set in `index.html` as `window.LABBZ_FORMS`.

If the URL is empty or the post fails, the forms fall back to opening the visitor's email app with the message pre-filled (to info@labbz.io, or invest@labbz.io for investing).

### Setting it up (once, about 5 minutes)

1. Create a new Google Sheet, for example "labbz.io form submissions".
2. In the sheet: **Extensions → Apps Script**. Delete what's there, paste the whole of `forms/labbz-forms.gs`, and save.
3. Optional: put more addresses to notify in `ALSO_NOTIFY`, for example `'info@labbz.io'`.
4. Choose **testSetup** in the function menu and press **Run**. Approve the permissions (Google warns the app is unverified because it's your own script: **Advanced → Go to … (unsafe)**). A test row appears in a new "Enquiries" tab and a test email arrives.
5. **Deploy → New deployment → Select type: Web app.** Execute as: **Me**. Who has access: **Anyone**. Deploy and copy the **Web app URL** (it ends in `/exec`).
6. Send that URL to Claude, or paste it into `index.html` as `window.LABBZ_FORMS = '<url>';` and push.

If you edit the script later: **Deploy → Manage deployments → Edit → Version: New version**, so the same URL keeps working.

Tabs: **Investors** (name, email, mobile, cheque size) and **Enquiries** (topic, name, email, mobile, organisation, product, message). Google's free limits (about 100 notification emails a day) are far above what the site needs.

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
