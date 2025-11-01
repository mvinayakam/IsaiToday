# IsaiToday™ - Social Music Discovery Platform

## Overview
IsaiToday is a full-stack social discovery platform for sharing and exploring songs globally, with a focus on Indian music. It offers daily song recommendations, playlist creation, song reactions, and a trending music feed. The platform integrates with YouTube for playback and metadata, featuring a dark-mode design inspired by Spotify and Notion. Its core purpose is to connect users through shared musical experiences, offering a unique blend of social interaction and music discovery.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework & Build System**: React with TypeScript, Vite, and Wouter for client-side routing.
- **UI Component System**: Radix UI primitives, shadcn/ui, and Tailwind CSS, adhering to a Spotify × Notion dark-mode aesthetic with glassmorphism and gradient accents.
- **State Management**: React Query for server state, local component state for UI, and custom hooks for authentication and responsiveness.
- **Key Pages**: Home (Song of the Day, feed, trending), Discover (grid with tag filtering), My Posts, My Likes, User Profile, and Auth.

### Backend Architecture
- **Server Framework**: Express.js with TypeScript on Node.js (ESM).
- **API Design**: RESTful endpoints (`/api/*`) for authentication, songs, feeds, reactions, playlists, user profiles, and autocomplete search.
- **Authentication & Sessions**: Replit Auth (OpenID Connect) via Passport.js for session management, with PostgreSQL-backed session store.
- **Data Access Layer**: Abstracted storage layer (`server/storage.ts`) for all database operations.

### Data Storage
- **Database**: PostgreSQL via Neon serverless driver, using Drizzle ORM for type-safe queries and schema management.
- **Schema Design**: Tables for `users`, `songs`, `albums`, `languages`, `artists`, `songArtists`, `songStories`, `reactions`, `playlists`, `playlistSongs`, `tags`, `songTags`, `songOfTheDay`, and `sessions`.
- **Database Migrations**: Drizzle Kit for schema migrations.

## External Dependencies

- **YouTube Integration**: Extracts video IDs from URLs, embeds YouTube player via iframe, and uses YouTube's image API for thumbnails. Automatic metadata fetching from YouTube Data API is implemented for song submission.
- **Authentication Provider**: Replit Auth (OpenID Connect) for user authentication.
- **Session Storage**: PostgreSQL for persistent session data.
- **Development Tools**: Replit-specific plugins, Vite dev server, Cartographer.