# Il Fiore

A simple static site for an artist's painting portfolio: home, shop, about, and contact pages. No build step — plain HTML/CSS/JS.

## Structure

- `index.html` — homepage
- `shop.html` — full collection grid with filters + inquiry lightbox
- `about.html` — bio / artist statement
- `contact.html` — contact form + details
- `css/style.css` — all styles (colors/fonts defined at the top as CSS variables)
- `js/main.js` — mobile nav, lightbox, filters, form handling

## Adding your paintings

The 9 paintings currently on the site are low-resolution crops (360×480px) taken from a Facebook preview image, used as realistic-looking interim content. Swap them out for full-resolution originals when you have them — the current ones will look soft, especially in the full-bleed homepage hero.

Each work card uses a `<picture>` element serving WebP with a JPEG fallback:

```html
<div class="placeholder-art">
  <picture>
    <source srcset="assets/works/your-painting.webp" type="image/webp">
    <img src="assets/works/your-painting.jpg" alt="Description of the painting" loading="lazy">
  </picture>
</div>
```

To add a new real painting:

1. Save the full-resolution image as `assets/works/your-painting.jpg`.
2. Generate a WebP copy alongside it (smaller file size, same quality) — e.g. with Pillow:
   ```python
   from PIL import Image
   im = Image.open("assets/works/your-painting.jpg")
   im.save("assets/works/your-painting.webp", "WEBP", quality=80, method=6)
   ```
   Also re-save the JPEG with `quality=80, optimize=True, progressive=True` if it came straight from a camera/phone — originals are often several MB and don't need to be.
3. Update the `<picture>` markup, `data-title`, `data-sub`, and `data-desc` attributes on the parent `.work-card`.
4. If it's one of the homepage hero slides, update the `data-bg` (or `style="background-image"` for the first slide) in `index.html` to point at the new `.webp` file.

## Personalizing

- Replace bracketed placeholder text in `about.html` and `contact.html` with your own bio, statement, and details.
- Replace `hello@ilfiore.example` with your real email everywhere it appears.
- Replace the Instagram `#` links with your real profile URL.
- The contact and newsletter forms are client-side only right now (they just show a "thank you" message). To actually receive submissions, wire the `<form>` up to a service like Formspree or Netlify Forms, or your own backend.

## Deploying with GitHub Pages

1. Push this repo to GitHub (already set up).
2. On GitHub, go to **Settings → Pages**.
3. Under "Build and deployment", set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save — your site will be live at `https://<username>.github.io/il-fiore/` within a minute or two.
