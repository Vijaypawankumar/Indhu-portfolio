# Indhu — Law Student Portfolio

A static website. No server, no database, no login, no monthly cost.
Everything you edit lives in one file: **`content.js`**.

## What is in this folder

| File or folder | What it is |
|---|---|
| `index.html` | The page itself. You only edit it once (step 5 below). |
| `content.js` | **Your profile, experience and all blog posts.** This is the file you edit. |
| `assets/` | Your images (hero, portrait, four cover photos, social card). |
| `css/styles.css`, `js/app.js` | Design and behaviour. Leave alone. |
| `robots.txt`, `sitemap.xml`, `404.html`, `.nojekyll` | Hosting and search-engine files. |

---

## Publish it free on GitHub Pages (about 10 minutes, all in the browser)

1. **Create a GitHub account** at github.com (free) if you do not have one.
2. Click **+ → New repository**. Name it, for example, `portfolio`. Choose **Public**. Click **Create repository**.
3. On the empty repository page click **uploading an existing file**. Drag in **everything inside this `site` folder** (including the `assets`, `css` and `js` folders and the files `index.html`, `content.js`, `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll`). Click **Commit changes**.
   - If a folder will not upload, upload its files one folder at a time with **Add file → Upload files**.
4. Go to **Settings → Pages**. Under **Build and deployment**, set **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)**, then **Save**.
   After about a minute your site is live at `https://YOUR-USERNAME.github.io/portfolio/`.
5. **Tell the site its own address** (one-time, makes link previews and Google work):
   open `index.html`, `robots.txt` and `sitemap.xml` on GitHub, click the pencil icon, and replace every `https://YOUR-USERNAME.github.io/YOUR-REPO/` with your real address. Also put the same address in `content.js` as `url: "..."`. Commit each change.

### Other free hosts (same files, no GitHub needed)
- **Netlify Drop:** go to app.netlify.com/drop and drag the whole folder in. You get a free `*.netlify.app` address instantly.
- **Cloudflare Pages:** create a free project and upload the folder (or connect the GitHub repository).
- **Vercel / GitLab Pages:** also free and work with this folder unchanged.

A custom domain (like `indhu.in`) costs money. The free `*.github.io`, `*.netlify.app` or `*.pages.dev` address is enough for a portfolio.

---

## Day-to-day: publishing a new blog post

1. On GitHub open `content.js` and click the **pencil icon**.
2. Find the line `window.POSTS = [`. Copy one whole post block, from `{` down to its closing `},` and paste it directly under that line.
3. Change the text: `slug` (letters and hyphens only, unique), `title`, `date`, `excerpt`, `categories`, `body`, `references`.
4. Click **Commit changes**. The site updates in about a minute.

**Formatting inside `body`:** blank line = new paragraph · `## Heading` · `### Subheading` · `**bold**` · `*italic*` · `- list item` · `1. numbered item` · `> quotation` · `[link text](https://example.com)`.

**Types:** `type: "blog"`, `"article"` (add `subtype: "Case comment"`, `"Opinion"` or `"Explainer"`) or `"research"`.
For research papers also set `rstatus` to `"unpublished"`, `"working"`, `"preprint"`, `"submitted"` or `"published"`. Use `"published"` only if it truly is. Add `journal`, `doi` (just `10.xxxx/xxxx`), `pdf: "assets/my-paper.pdf"` (upload the PDF into `assets`) and `coauthors` when you have them.

**Hide or remove:** set `status: "draft"` to hide a post, or delete its block. Remove the line `sample: true` from the starter post (or delete the whole post) before you share the site.

**Cover images:** use one of the four supplied photos (`assets/cover-books-and-glasses.webp`, `cover-courthouse.webp`, `cover-lady-justice.webp`, `cover-documents-and-pen.webp`) or upload your own image into `assets` and reference it. Always fill in `coverAlt` (a short description for screen readers).

**Profile, experience, projects:** all in the `window.SITE` block at the top of `content.js`.

---

## Contact form (optional, free)

- The Contact section and menu link stay hidden until you add an `email` or `links` in `content.js`.
- With only an email, the form opens the visitor's email app with the message ready.
- For a form that really sends mail with spam filtering, create a free form at formspree.io, copy its address (looks like `https://formspree.io/f/xxxxxxx`) into `formEndpoint` in `content.js`. If you do, add a sentence about it to `privacy`.

---

## Before you share the site: checklist

- [ ] Delete or replace the **sample blog post** and check every legal reference in it against the primary source.
- [ ] Confirm the experience and project lines in `content.js` are accurate. Add dates or roles if you wish. Delete anything you do not want public.
- [ ] Add your `email` and/or LinkedIn in `links`.
- [ ] Replace the placeholder address in `index.html`, `robots.txt`, `sitemap.xml` (step 5).
- [ ] Read the Privacy and Disclaimer text in `content.js` and edit it so it is true for your site.

## Good to know

- Page links look like `https://your-address/#p-your-post-slug`. This keeps hosting free and simple.
- Google can read the page, but per-post search previews are limited because the site is one page. If search traffic matters later, a generated-pages version (for example with Astro or Eleventy) can be added without changing your content.
- Images and fonts: the site loads Google Fonts (Playfair Display and DM Sans). No analytics or tracking is included.
