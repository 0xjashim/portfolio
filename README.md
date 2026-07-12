# Jashim Uddin Bhuiyan — Offensive Security Portfolio

Multi-page portfolio site for Jashim Uddin Bhuiyan (0xjashim), Principal Officer & Senior Security Analyst at Pubali Bank PLC.

## Structure

```
portfolio/
├── index.html              Home — hero, stats, quick links
├── about.html               Operator profile + skill radar + Hall of Fame
├── experience.html          Work history + full technical skills
├── certifications.html      38+ verified certification badges
├── projects.html            GitHub projects & disclosures
├── resume.html              Print-style CV summary
├── contact.html             Contact links
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/
│   │   ├── style.css        Core design system (colors, nav, layout)
│   │   ├── responsive.css   Component styles + media queries
│   │   └── animation.css    Keyframes & motion
│   ├── js/
│   │   ├── app.js           Nav toggle, stat counters, radar chart, cert grid renderer
│   │   └── badges-data.js   Certification badge images (base64) + Credly links
│   └── img/
│       ├── profile.jpg      Profile photo
│       └── logo.svg         Site mark
```

## Deploying

Upload the entire `portfolio/` folder contents to the root of your GitHub Pages repo (`0xjashim.github.io/portfolio/` project site). No build step required — plain HTML/CSS/JS.

## Notes

- All pages share the same nav/footer for consistency; the active page is highlighted automatically via a class on the nav link.
- Certification badges render dynamically from `assets/js/badges-data.js` + `app.js` on `certifications.html`.
- To add a real Open Graph preview image, drop a 1200×630px `og-image.png` at the site root — the meta tags on every page already reference it.
