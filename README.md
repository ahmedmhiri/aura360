# AURA360LAB

A bilingual (EN/FR) portfolio website for an architecture & visualization studio — architecture, 3D visualization and interior design. Built with **Next.js 14 (App Router, JavaScript)**, **Tailwind CSS**, **Framer Motion** and **Prisma + PostgreSQL**, with a built‑in admin dashboard so the studio owner can manage projects without touching code.

> **Design language:** an "architectural drawing" system — warm paper neutrals, near‑black ink, a single restrained blueprint‑blue accent, mono coordinate/annotation labels and hairline registration ticks. Type is Archivo (display) + Inter (body) + JetBrains Mono (annotations).

---

## Quick start (no database needed)

The site runs immediately on built‑in **sample data** so you can preview it before configuring anything.

```bash
npm install
cp .env.example .env     # optional for preview; see notes below
npm run dev
```

Open <http://localhost:3000> — you'll be redirected to `/en` (or `/fr` based on your browser). Six sample projects, all pages, animations and the language switcher work out of the box. Editing in the admin is disabled until a database is connected.

---

## Full setup (with database + editable content)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment** — copy `.env.example` to `.env` and set:

   | Variable | Purpose |
   | --- | --- |
   | `DATABASE_URL` | PostgreSQL connection string. If empty, the site falls back to sample data. |
   | `ADMIN_PASSWORD` | Password for the `/admin` dashboard. **Change this.** Defaults to `admin123` if unset. |
   | `ADMIN_SESSION_SECRET` | Long random string used to sign the admin session cookie. |
   | `NEXT_PUBLIC_SITE_URL` | Public URL, used for SEO metadata, Open Graph and the sitemap. |

3. **Create the database schema and seed it**

   ```bash
   npx prisma generate        # generate the Prisma client
   npm run db:migrate         # create tables (prisma migrate dev)
   npm run db:seed            # load the 3 categories + 6 sample projects
   ```

4. **Run it**

   ```bash
   npm run dev
   ```

Now the public site and the admin dashboard both read from your database.

### Useful scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` then production build |
| `npm run start` | Run the production build |
| `npm run db:migrate` | Create/apply migrations (`prisma migrate dev`) |
| `npm run db:push` | Push schema without a migration (handy for prototyping) |
| `npm run db:seed` | Seed categories + sample projects |
| `npm run db:studio` | Open Prisma Studio to inspect data |

---

## The admin dashboard

Visit `/en/admin` (or `/fr/admin`). You'll be sent to a sign‑in screen; enter `ADMIN_PASSWORD`. Once in you can:

- See all projects, toggle which appear on the home page ("featured"), and delete them.
- Create and edit projects with **bilingual fields** (title, type, services, description), category, location, year, a cover image and a gallery.
- Upload images directly, or paste an existing image URL.

> The admin lives under the locale segment (`/[locale]/admin`) for routing reasons but uses English labels throughout.

---

## How it works

### Internationalization

A custom, dependency‑free i18n layer:

- All public routes live under the `app/[locale]/` dynamic segment.
- `middleware.js` redirects `/` → `/en` or `/fr` (preference order: `NEXT_LOCALE` cookie → `Accept‑Language` header → default `en`).
- UI copy lives in `i18n/dictionaries/en.json` and `fr.json` (kept key‑for‑key in sync) and is loaded server‑side via `getDictionary(locale)`.
- Per‑project content is stored bilingually in the database as `{ en, fr }` and resolved with the `pick(value, locale)` helper.

### Data layer & graceful fallback

- `lib/prisma.js` only instantiates Prisma when `DATABASE_URL` is set, inside a `try/catch`. If the client isn't generated or the DB is unreachable, it stays `null`.
- `lib/projects.js` checks `isDbEnabled`; on any error it logs a warning and falls back to `lib/sample-data.js`. This is why the site always renders, with or without a database.

### Rendering

- Server Components for all data fetching and SEO metadata; Client Components only where interactivity is needed (navbar, hero slideshow, portfolio filter/search, gallery lightbox, contact form, admin forms).
- `app/[locale]/template.js` adds a subtle page‑enter transition on navigation.
- Every animation respects `prefers-reduced-motion`.

### SEO

- Per‑page `generateMetadata` with titles, descriptions, canonical URLs, `hreflang` alternates and Open Graph.
- `app/sitemap.js` and `app/robots.js` are generated automatically (admin and API routes are disallowed).

---

## Project structure

```
app/
  [locale]/
    layout.js              # fonts, metadata, navbar + footer shell
    template.js            # page transition wrapper
    page.js                # home
    not-found.js           # localized 404
    portfolio/
      page.js              # listing (filter + search)
      [slug]/page.js       # project detail (+ gallery, related, next)
    about/page.js
    contact/page.js
    admin/                 # password-gated dashboard
      layout.js
      page.js              # project list
      login/page.js
      projects/new/page.js
      projects/[id]/edit/page.js
  api/
    auth/route.js          # login / logout
    contact/route.js       # contact form handler
    projects/route.js      # list + create
    projects/[id]/route.js # read + update + delete
    categories/route.js    # list + create
    categories/[id]/route.js
    upload/route.js        # image upload
  globals.css
  sitemap.js
  robots.js
components/                # UI + admin/* components
i18n/                      # config, dictionary loader, en/fr JSON
lib/                       # prisma, projects data layer, sample data, site config, auth
prisma/                    # schema.prisma, seed.js
middleware.js              # locale routing + admin gate
```

---

## Customizing content

- **Studio details & socials** (email, phone, WhatsApp, Instagram, LinkedIn, stats, team): edit `lib/site.js`.
- **Sample/seed projects** (used as fallback and by `db:seed`): edit `lib/sample-data.js`.
- **All UI text**: edit `i18n/dictionaries/en.json` and `fr.json` (keep the keys identical in both).
- **Colors, fonts, spacing**: `tailwind.config.js` and `app/globals.css`.

The placeholder images use [picsum.photos](https://picsum.photos). Replace cover/gallery images with your real renders via the admin, or by editing the sample data.

---

## Production notes & honest scope

This is a strong, runnable foundation. A few pieces are intentionally simple and should be hardened before a real launch:

- **Admin authentication is demo‑grade.** It's a single shared password that sets a signed (HMAC) session cookie — there are no user accounts. For production, replace `lib/auth.js` + the `/api/auth` route with [Auth.js / NextAuth](https://authjs.dev), real user records and proper session management.
- **Image uploads write to `public/uploads/`.** This works locally and on a persistent server, but **not** on ephemeral/serverless filesystems (e.g. Vercel), where files don't persist or share across instances. Swap `/api/upload` for object storage (S3, Cloudinary, UploadThing, etc.). `next.config.js` currently allows any HTTPS image host so pasted URLs render — tighten `images.remotePatterns` to your own domains for production.
- **The contact form does not send email.** `/api/contact` validates the payload and logs it server‑side. Wire it to Resend, Nodemailer/SMTP or a CRM webhook.
- **Next.js 14 vs 15.** This project targets Next 14, where route `params`/`searchParams` are plain objects. If you upgrade to Next 15, those become Promises — you'll need to `await` them in pages, layouts and route handlers.

---

## Tech stack

- [Next.js 14](https://nextjs.org) (App Router, JavaScript)
- [React 18](https://react.dev)
- [Tailwind CSS 3](https://tailwindcss.com)
- [Framer Motion 11](https://www.framer.com/motion/)
- [Prisma 5](https://www.prisma.io) + PostgreSQL
- [lucide-react](https://lucide.dev) icons
