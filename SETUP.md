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
