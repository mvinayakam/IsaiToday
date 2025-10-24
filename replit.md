# IsaiToday - Social Music Discovery Platform

## Overview

IsaiToday is a full-stack social discovery platform for sharing and exploring songs from around the world, with a strong Indian music presence. Users receive a daily song recommendation, can create playlists, react to songs, and discover trending music through a feed-based interface. The platform features YouTube integration for song playback and metadata, with a sophisticated dark-mode design inspired by Spotify and Notion aesthetics.

**Status:** ✅ Fully functional with authenticated user flows, database integration, and end-to-end tested

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (October 24, 2025)

### Latest Update: YouTube Playback & Enhanced Song Posting
- **YouTube Player**: Click any song thumbnail or play button to watch/listen in a modal player with autoplay
- **Interactive Thumbnails**: Hover effects with image zoom and overlay darkening for better UX
- **Album Field**: Users can add album names with autocomplete suggestions from existing albums
- **Language Field**: Users can specify song language with autocomplete suggestions
- **Multi-Artist Support**: Users can add multiple artists to a song using chip-based multi-select UI
- **Tags System**: Users must add at least one tag to categorize songs (required field)
- **Auto-creation**: Album, language, artist, and tag entries are automatically created if they don't exist
- **Database Schema**: Added `albums`, `languages`, `artists` tables with `songArtists` and `songTags` junction tables
- **Autocomplete APIs**: `/api/albums/search`, `/api/languages/search`, `/api/artists/search` endpoints
- **Validation**: Added proper validation and duplicate-handling for all linking operations
- **End-to-End Tested**: All features tested with Playwright and architect-approved

### Previous Updates
- Implemented complete backend API with PostgreSQL database and Drizzle ORM
- Integrated Replit Auth for Google and email login
- Connected all frontend pages to backend APIs
- Implemented Song of the Day feature with random assignment
- Built social reactions system (likes) with aggregated counts
- Created feed and discover pages with trending songs
- Added user profile with liked songs display
- Seeded database with classic Indian music (R D Burman, Kishore Kumar, A R Rahman, Ilaiyaraja)
- Fixed CSS import ordering to resolve Vite warnings
- Completed end-to-end testing of all major user flows

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript using Vite as the build tool
- Client-side routing via Wouter (lightweight alternative to React Router)
- React Query (@tanstack/react-query) for server state management and data fetching

**UI Component System**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library built on top of Radix
- Tailwind CSS for styling with custom design tokens
- Design system follows Spotify × Notion aesthetic with dark mode, glassmorphism effects, and gradient accents

**State Management**
- React Query handles all server state (songs, playlists, reactions, user data)
- Local component state for UI interactions
- Custom hooks for authentication (`use-auth`) and responsive design (`use-mobile`)

**Key Pages**
- Home: Song of the Day feature with friend activity feed and trending songs
- Discover: Grid-based exploration with tag filtering
- Profile: User stats, liked songs, and playlist management
- Auth: Login/registration (currently OAuth-based via Replit)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- ESM (ES Modules) throughout the codebase
- Session-based authentication using Passport.js with OpenID Connect

**API Design**
- RESTful endpoints under `/api/*`
- Key routes:
  - `/api/auth/user` - Current user session
  - `/api/song-of-day` - Daily song recommendation
  - `/api/feed` - Friend activity feed
  - `/api/discover` - Trending songs
  - `/api/songs` - Song CRUD operations with album/language support
  - `/api/songs/:songId/artists` - Link artists to songs
  - `/api/songs/:songId/tags` - Link tags to songs
  - `/api/playlists` - Playlist management
  - `/api/reactions` - Like/reaction tracking
  - `/api/albums/search` - Autocomplete for album names
  - `/api/languages/search` - Autocomplete for languages
  - `/api/artists/search` - Autocomplete for artist names
  - `/api/artists` - Create or retrieve artists
  - `/api/tags` - Tag management

**Authentication & Sessions**
- Replit Auth using OpenID Connect (OIDC) for user authentication
- Passport.js strategy for session management
- PostgreSQL-backed session store (connect-pg-simple)
- 7-day session TTL with secure, httpOnly cookies

**Data Access Layer**
- Storage abstraction pattern in `server/storage.ts`
- All database operations go through the storage interface
- Supports operations for users, songs, reactions, playlists, tags, and song-of-the-day

### Data Storage

**Database**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and schema management
- WebSocket connection pooling for serverless compatibility

**Schema Design**
- `users` - User profiles with OAuth data (id, email, firstName, lastName, profileImageUrl)
- `songs` - Song metadata (id, youtubeId, title, artist, album, language, thumbnail, addedBy, createdAt)
- `albums` - Album names for autocomplete and organization
- `languages` - Language names for autocomplete and filtering
- `artists` - Artist names for multi-artist support
- `songArtists` - Many-to-many join table linking songs to multiple artists
- `songStories` - User stories/descriptions for songs (many-to-many user-song relationship)
- `reactions` - User likes/reactions to songs (type field for future reaction types)
- `playlists` - User-created playlists
- `playlistSongs` - Many-to-many join table with ordering
- `tags` - Hashtags for categorizing songs
- `songTags` - Many-to-many song-tag relationship
- `songOfTheDay` - Tracks daily song assignments per user
- `sessions` - Session storage for authentication

**Database Migrations**
- Drizzle Kit for schema migrations
- Migration files stored in `/migrations`
- Push-based workflow (`db:push`) for schema synchronization

### External Dependencies

**YouTube Integration**
- YouTube video ID extraction from URLs (supports multiple URL formats)
- Embedded YouTube player via iframe
- Thumbnail URLs using YouTube's image API (`img.youtube.com`)
- Note: Full YouTube Data API v3 integration planned but currently using basic URL patterns for MVP

**Authentication Provider**
- Replit Auth (OpenID Connect)
- Configured via environment variables (ISSUER_URL, REPL_ID, SESSION_SECRET)
- Supports Replit-hosted deployments with automatic domain configuration

**Development Tools**
- Replit-specific plugins for hot module replacement and error overlays
- Vite dev server with middleware mode for Express integration
- Development banner and Cartographer for Replit environment

**Session Storage**
- PostgreSQL for persistent session storage
- Auto-creation of session tables via connect-pg-simple

**Database Seeding**
- Initial seed data focused on Indian music (R D Burman, Kishore Kumar, A R Rahman, Ilaiyaraja)
- Pre-populated tags and song metadata for demo purposes
- Seed function creates tags, songs, and sample stories