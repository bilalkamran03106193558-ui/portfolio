# Bilal Kamran — video editing portfolio

A responsive static portfolio for GitHub Pages. No build step or package installation is required.

- `index.html`: homepage, work filters, services, about, and contact.
- `long-videos.html`, `shorts.html`, `raw-edit-shorts.html`, `ai-videos.html`, `motion-graphics.html`: original collection URLs, redesigned with all existing videos.
- `video.html`: responsive YouTube / Google Drive player with an original-source link. Existing `?url=` links remain supported.
- `style.css`: black, off-white, and lime visual system with mobile breakpoints and reduced-motion support.
- `script.js`: menu, gallery filters, copy-email control, image fallbacks, and validated video URLs.
- `assets/`: original profile image and icons.

## Update the work

Edit project cards in `index.html` and the appropriate collection page. Each player link uses `video.html?url=` followed by a URL-encoded YouTube embed or Google Drive preview URL. For the homepage, `data-categories` is a space-separated list of collection slugs. Keep shared videos in every relevant collection.

## Deployment

The repository root is the GitHub Pages source. Commit changes to the configured Pages branch to publish. Videos and thumbnails retain their original hosting and sharing permissions. The Discord link remains the original generic Discord homepage; replace it with a personal profile or invite when available.
