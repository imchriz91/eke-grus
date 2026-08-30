# Updating the price lists

The "Sortiment" / "Stock" page shows two official price lists as PDFs — a
standard year-round list and a winter materials list. There's no Google
Sheet or any other live data source anymore: the page just links to and
displays these two PDF files directly.

## How to update prices

To publish new pricing, you only need to replace a file — no code changes,
no web developer needed.

1. Create your updated price list PDF (the same way you always have —
   Word, Excel, or whatever you already use to make these).
2. Save it with **exactly** one of these two file names, replacing the
   existing file in this folder:

   - `assets/prislista-standard.pdf` — the standard, year-round price list
   - `assets/prislista-vinter.pdf` — the winter materials price list

   The name must match exactly (same spelling, same file extension `.pdf`)
   so the website keeps pointing at it correctly.
3. That's it. Refresh the page in your browser (Ctrl+F5) to see the new
   file — both the Swedish and English versions of the page link to the
   same two files, so you only ever need to replace each one once.

## A few notes

- If you ever want to rename the files, or add a third price list (for
  example, a separate list for another season), that does require a small
  code change — ask whoever maintains the site to help with that part.
- The PDFs are Swedish-only. The English page says so plainly and links to
  the same Swedish PDF rather than a translated version.
- Keep the file size reasonable (a simple exported/printed PDF, not a
  huge scanned image) so the page stays fast to load.

---

# SEO infrastructure

## The domain assumption

Every SEO file below (`sitemap.xml`, `robots.txt`, the hreflang tags, and
the structured data) assumes this site will end up live at
**`https://www.ekegrus.se/`** — the domain the business already owns and
uses on its price lists. **If the site launches somewhere else, all of
these need updating** (a find-and-replace of `www.ekegrus.se` across the
`.html` files, `sitemap.xml`, and `robots.txt` — ask whoever maintains the
site to do this before launch).

## What's in place

- **Structured data (JSON-LD)**: a `LocalBusiness` schema block on the
  Home and Kontakt/Contact pages (both languages), with the business name,
  address, all three phone numbers, email, opening hours, map coordinates,
  and logo. This is what lets Google show a rich map/hours/phone card in
  search results. It only helps once the page is actually live and
  crawled — it doesn't submit anything anywhere by itself.
- **Hreflang tags**: every page's `<head>` now tells search engines which
  page is the Swedish version and which is the English version of the same
  content, so they're treated as translations rather than duplicate pages.
- **`sitemap.xml`**: lists all 10 real pages (5 Swedish, 5 English). The
  404 pages are deliberately left out since they're marked `noindex`.
- **`robots.txt`**: allows all crawling and points to the sitemap.

## Old site redirects — this needs a decision

The current live site (ekegrus.se) runs on a website-builder platform
called Hemsida24, with only 4 pages at these URLs:

- `/` (home)
- `/produkter-priser-33743068` (products/prices)
- `/galleri-33743073` (gallery)
- `/kontakt-33743092` (contact)

For the site's existing Google ranking to carry over, these old addresses
need to permanently redirect (HTTP 301) to their new equivalents
(`/`, `/sortiment.html`, `/galleri.html`, `/kontakt.html`) once the new
site goes live at the same domain. **Whether that's possible depends
entirely on where the new site is hosted** — this repo has no server of
its own, so redirects have to happen at the hosting layer:

- **Netlify or Cloudflare Pages** (recommended — free, and this is the
  easiest case): the `_redirects` file already sitting in this folder is
  picked up automatically. Nothing more to do once you deploy there.
- **Apache hosting**: the `.htaccess` file already in this folder handles
  it automatically the same way.
- **Nginx, or a host that doesn't read either of those files**: the
  redirect rules need to be added to the server configuration directly —
  the four lines are short, just hand them to whoever manages the server
  (see `_redirects` for the exact old → new paths).
- **A host with no redirect support at all** (e.g. plain GitHub Pages,
  or an S3 bucket with no CDN in front of it): the fallback is a small
  static HTML file at each old path with `<meta http-equiv="refresh">`
  and a matching `rel="canonical"` pointing at the new page. It's weaker
  for SEO than a real 301 but still tells both browsers and Google where
  the content moved. Not built yet — say the word once hosting is
  decided and this can be added.

**Bottom line: tell me (or whoever sets up hosting) which of these
applies, since the redirect only actually works once the new site is
live at ekegrus.se — having the files in this repo doesn't do anything on
its own until then.**

## Not covered here — do this yourself

**Google Business Profile** (the listing that shows the map pin, reviews,
and hours directly in Google search and Maps) is a separate account you
manage directly at [business.google.com](https://business.google.com) —
it isn't something that lives in this website's code, so it isn't
something a code change can set up. If one doesn't already exist for Eke
Grus AB, claim/create it there and fill it in using the same details as
the structured data above (address, phone, hours) so they match.
