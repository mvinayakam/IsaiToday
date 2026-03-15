# IsaiToday™ — CLAUDE.md

Social music discovery platform focused on Indian music. Users share songs daily, create playlists, react to songs, follow others, comment with @mentions, and receive notifications.

## Commands

```bash
npm run dev        # Start dev server (Next.js) on port 3000
npm run build      # Build Next.js production bundle
npm run start      # Serve production build
npm run check      # TypeScript type checking
npm run db:push    # Apply schema changes to MySQL (Drizzle Kit)
```

No test suite exists yet.

## Architecture

**Next.js 14 App Router** — single root directory, ESM throughout.

```
app/              Next.js App Router pages and API routes
  api/            REST API route handlers (replaces Express routes)
  layout.tsx      Root layout: Providers, Navbar, BottomNav
  page.tsx        / → Home
  discover/       /discover
  profile/        /profile
  my-posts/       /my-posts
  my-likes/       /my-likes
  auth/           /auth (login + register)
  user/[userId]/  /user/:id
components/       React components ("use client" where needed)
  ui/             shadcn/ui primitives (Radix-based, ~40 files)
  pages/          Page-level components (used by app/ route stubs)
hooks/            use-auth, use-mobile, use-toast
lib/
  db.ts           mysql2 + Drizzle ORM connection pool
  auth.ts         NextAuth v4 config (Google + Credentials providers)
  storage.ts      Data access abstraction — all DB calls go here
  queryClient.ts  TanStack Query setup
  utils.ts        cn() and other utilities
server/
  youtube.ts      YouTube metadata extraction (googleapis)
  seed.ts         Dev database seeding
shared/
  schema.ts       MySQL Drizzle schema + Zod types (single source of truth)
```

### Backend (API Routes in `app/api/`)

All Express routes are converted to Next.js Route Handlers. Auth guard helpers in `lib/auth.ts`:
- `requireUser()` → checks session, returns `{ userId, role, error }`
- `requireAdmin()` → checks `role === 'admin'`, returns `{ userId, error }`

**All database operations go through `lib/storage.ts`** — never query the DB directly from route handlers (exception: complex join queries use `db` directly).

### Frontend (`components/` + `components/pages/`)

| Dir | Purpose |
|-----|---------|
| `components/pages/` | Page-level components (imported by `app/*/page.tsx` stubs) |
| `components/` | Reusable UI components (all `"use client"`) |
| `components/ui/` | shadcn/ui primitives |
| `hooks/` | `use-auth`, `use-mobile`, `use-toast` |
| `lib/` | `queryClient.ts`, `utils.ts` |

**Routing**: Next.js App Router (`app/*/page.tsx`). Navigation with `next/link` and `useRouter` from `next/navigation`.

### Shared (`shared/schema.ts`)

Drizzle ORM MySQL table definitions + drizzle-zod validation schemas. Single source of truth for DB types used everywhere.

## Tech Stack

- **Frontend**: React 18, TypeScript, Next.js 14 (App Router), TanStack Query v5, Tailwind CSS, Radix UI / shadcn/ui, Framer Motion
- **Backend**: Next.js Route Handlers, TypeScript, Drizzle ORM, MySQL (mysql2), NextAuth v4
- **Forms**: React Hook Form + Zod
- **Auth**: NextAuth v4 — Google OAuth + email/password (CredentialsProvider) — JWT sessions
- **YouTube**: YouTube Data API v3 for metadata

## Environment Variables

```env
DATABASE_URL=mysql://root:password@localhost:3306/isaitoday
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...              # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# YouTube (optional)
YOUTUBE_API_KEY=...
```

## Database Schema

Key tables (all use UUID PKs + timestamps):

- `users` — profiles (`passwordHash` nullable for Google OAuth users; `role` = `'user'` | `'admin'`)
- `songs` — YouTube-backed tracks (`youtubeId`, `title`, `artist`, `thumbnail`, `addedBy`)
- `reactions` — likes (songId + userId + type)
- `playlists` / `playlistSongs` — user playlists with ordered songs
- `comments` / `userMentions` — comments with @mention tracking
- `notifications` — mention/reaction notifications with read status
- `songOfTheDay` — daily featured song per user
- `tags` / `songTags` — many-to-many tagging
- `albums`, `languages`, `artists`, `songArtists` — music metadata

## API Conventions

- All endpoints: `/api/*`
- Auth: NextAuth session cookie (automatic via `getServerSession`)
- Frontend uses `apiRequest()` helper for mutations (POST/PUT/DELETE/PATCH)
- Frontend uses React Query for all GET requests

Key route groups: `/api/songs`, `/api/songs/:id/reactions`, `/api/songs/:id/comments`, `/api/playlists`, `/api/notifications`, `/api/users`, `/api/feed`, `/api/discover`, `/api/youtube/metadata`, `/api/auth/register`

## Roles

| Role | Stored | Access |
|------|--------|--------|
| Guest | No session | Browse only |
| User | `role='user'` | React, comment, post songs, playlists |
| Admin | `role='admin'` | All + delete any song/comment + /api/seed |

Admin role must be set manually in the DB.

## Code Conventions

- **TypeScript strict mode** — no `any` without justification
- **Path aliases**: `@/*` → root dir, `@shared/*` → `shared/`
- **All DB access** through `lib/storage.ts` (or direct `db` for complex joins)
- **Zod schemas** from `drizzle-zod` for API validation
- Forms use React Hook Form + `@hookform/resolvers/zod`
- All components use `"use client"` directive
- MySQL note: no `.returning()` — generate IDs in app with `randomUUID()`, insert, then re-select

## Design System

Spotify × Notion dark aesthetic. Key rules:

- **Dark mode only** — `dark` class on `<html>`
- **Glassmorphism**: `backdrop-blur-md bg-white/5 border border-white/10`
- **Cards**: `rounded-xl` or `rounded-2xl` with glassmorphism background
- **Hover**: `hover:scale-105 transition-all duration-200` (sparingly)
- **Typography**: Inter font; titles `text-4xl font-bold tracking-tight`, cards `text-lg font-semibold`
- **Container**: `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`
- **Song grid**: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6`
- **Feed**: `flex overflow-x-auto gap-4 snap-x snap-mandatory`
- Mobile-first; key breakpoints: `md:` 768px, `lg:` 1024px

See `design_guidelines.md` for the full component spec.

## Key Features to Know

- **Song of the Day**: Random featured song shown as hero on homepage (per user, per day)
- **@Mentions**: Autocomplete user search in comment input; stored in `userMentions`; trigger notifications
- **Notifications**: Bell icon with unread count, auto-refresh every 30s, mark-as-read
- **YouTube**: iframe embeds with `?controls=1&modestbranding=1`; thumbnails from YouTube image CDN
- **Feed**: Shows friends' recently liked songs; Discover shows globally popular songs
