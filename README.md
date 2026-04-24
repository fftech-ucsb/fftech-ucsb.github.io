## UCSB Fftech Research Lab Website

Static website for the Foundations of Financial Technology (Fftech) Research Lab at UC Santa Barbara. Deployed via GitHub Pages.

### Running Locally

The site uses `fetch()` to load JSON data, which requires an HTTP server (it won't work by opening HTML files directly). Run:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

### How to Update Content

All dynamic content lives in JSON files under `data/`. Edit these files to update the site — no HTML changes needed.

**Add a person** — edit `data/people.json`. Add a new object to the appropriate section's `members` array:

```json
{
  "name": "Full Name",
  "role": "PhD Student",
  "photo": "images/Headshots/filename.jpg",
  "bio": "Bio text. You can include <a href='https://...'>links</a> in the bio.",
  "email": "email@ucsb.edu",
  "website": "",
  "links": {}
}
```

If adding a headshot photo, place it in `images/Headshots/`. If no photo is provided, initials will be shown automatically. The `links` field can hold named URLs (e.g. `{"Ava Labs": "https://..."}`), which render as icons below the bio.

**Add an event** — edit `data/events.json`. Add a new object to the `events` array (newest first):

```json
{
  "id": "event-id",
  "title": "Event Title",
  "date": "2025-01-01",
  "displayDate": "January 1, 2025",
  "image": "images/EventFolder/cover.jpg",
  "description": "Event description.",
  "links": { "Website": "https://...", "YouTube": "https://..." },
  "photos": ["images/EventFolder/photo1.jpg", "images/EventFolder/photo2.jpg"]
}
```

Place event images in a new folder under `images/`. If `photos` has 2+ images, they display as a carousel with prev/next controls. For best results, resize photos to 1200px wide.

**Add a sponsor** — edit `data/sponsors.json`. Place the logo in `images/Sponsor-logos/`.

**Add a project** — edit `data/projects.json`. Add to either the `research` or `capstone` array.

### Pages

| Page | File | Content Source |
|------|------|---------------|
| Home | `index.html` | Hardcoded hero + news |
| People | `people.html` | `data/people.json` |
| Research | `research.html` | Hardcoded |
| Projects | `projects.html` | `data/projects.json` |
| Events | `events.html` | `data/events.json` |
| Sponsors | `sponsors.html` | `data/sponsors.json` |

### File Structure

```
index.html, people.html, research.html, etc.   — Page templates
data/                                           — JSON content files
js/site.js                                      — Shared nav, footer, and data rendering
css/site.css                                    — Custom styles (Bootstrap 5 via CDN)
images/                                         — All images
  Headshots/                                    — People photos
  Sponsor-logos/                                — Sponsor logos
  FBC25/, Mini-summit2/, Workshop-Nov2024/       — Event photos
thumbs/                                         — Logo thumbnail
```
