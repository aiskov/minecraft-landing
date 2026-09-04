# minecraft.aiskov.com — landing page

Static site. No build step, no dependencies, no framework. Upload the folder and you're done.

```
index.html      markup + all copy
styles.css      all styling (design tokens in :root)
app.js          tabs, copy buttons, scroll reveal, voxel background scene
favicon.svg
robots.txt
sitemap.xml
```

## Deploy

Any static host — Nginx, Caddy, Cloudflare Pages, Netlify, GitHub Pages, S3. Serve `index.html` at the domain root; no server-side code and no redirects needed.

Nginx example:

```nginx
server {
    server_name minecraft.aiskov.com;
    root /var/www/minecraft.aiskov.com;
    index index.html;
    location / { try_files $uri $uri/ =404; }
    location ~* \.(css|js|svg)$ { expires 7d; add_header Cache-Control "public"; }
}
```

Local check: `python3 -m http.server 8080` inside the folder, then open <http://localhost:8080>.

## Things to fill in

1. **Modpack link** — in `index.html`, search for `data-modpack-link` and replace `href="#"` with the CurseForge URL. Also replace the pack name in the "TO FILL IN" box (`.placeholder-box`) and delete the dashed styling by removing `class="cf-link"`'s dashed border if you want it solid.
2. **Server addresses** — plain text in `index.html`. Each copy button carries its own value in `data-copy="…"`; keep the button value and the visible `<code>` in sync.
3. **OG image** — add `og-image.png` (1200×630) and a `<meta property="og:image" content="og-image.png" />` tag if you want link previews.

## Background scene

Configured with attributes on `<canvas id="scene">` in `index.html`:

| attribute | values | effect |
|---|---|---|
| `data-motion` | `cinematic`, `calm`, `off` | how much the island moves and rotates on scroll |
| `data-detail` | `4`–`12` | island size / block count (lower = faster on weak devices) |
| `data-palette` | `overworld`, `dusk`, `nether` | block colours |

The scene is plain Canvas 2D, pauses when the tab is hidden, and renders one static frame for visitors with "reduce motion" enabled.

## Fonts

Loaded from Google Fonts (Silkscreen, Space Grotesk, IBM Plex Mono). To self-host, download the woff2 files, drop them in `fonts/`, add `@font-face` blocks at the top of `styles.css`, and delete the two `fonts.googleapis.com` `<link>` tags.
