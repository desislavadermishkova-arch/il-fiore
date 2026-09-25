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

Each painting is currently a colored placeholder (`<div class="placeholder-art hue-N">`). To swap in a real image:

1. Add your image files somewhere like `assets/works/your-painting.jpg`.
2. Replace the placeholder div's contents with an `<img>` tag, e.g.:
   ```html
   <div class="placeholder-art">
     <img src="assets/works/your-painting.jpg" alt="Untitled No. 1, oil on canvas">
   </div>
   ```
3. Update the `data-title`, `data-sub`, and `data-desc` attributes on the parent `.work-card` so the lightbox shows the right info.

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
