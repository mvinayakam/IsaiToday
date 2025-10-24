# IsaiToday™ Design Guidelines

## Design Approach: Reference-Based (Spotify × Notion Aesthetic)

**Primary References:**
- **Spotify**: Music-first interface, bold album artwork, elegant dark mode, fluid animations
- **Notion**: Clean hierarchy, subtle backgrounds, organized content blocks, purposeful whitespace
- **Supporting**: Apple Music (refined interactions), SoundCloud (social feed patterns)

**Core Principles:**
1. Music-centric: Let song artwork and content breathe
2. Social immersion: Seamless discovery and sharing flows
3. Elegant darkness: Sophisticated dark mode without harshness
4. Fluid interactions: Smooth, purposeful micro-animations (very minimal)

---

## Typography System

**Font Stack:**
- Primary: Inter via Google Fonts CDN
- Fallback: system-ui, -apple-system, sans-serif

**Hierarchy:**
- Hero/Large Titles: `text-4xl lg:text-5xl font-bold tracking-tight`
- Page Headings: `text-3xl font-semibold`
- Section Titles: `text-2xl font-semibold`
- Card Titles: `text-lg font-semibold`
- Body Text: `text-base font-normal`
- Captions/Meta: `text-sm font-medium`
- Small Labels: `text-xs font-medium uppercase tracking-wider`

**Character:** Clean, modern, highly legible with medium-to-bold weights for emphasis

---

## Layout System

**Spacing Primitives:**
Use Tailwind units: `2, 4, 6, 8, 12, 16, 20, 24` for consistent rhythm
- Component padding: `p-4 md:p-6 lg:p-8`
- Section spacing: `py-12 lg:py-20`
- Card gaps: `gap-4 md:gap-6`
- Element margins: `mb-4, mt-8, mx-auto`

**Grid System:**
- Container max-width: `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`
- Song grids: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6`
- Feed sections: Horizontal scroll containers with `flex space-x-4 overflow-x-auto snap-x`

**Responsive Breakpoints:**
- Mobile-first approach
- Key breakpoints: `md:` (768px), `lg:` (1024px), `xl:` (1280px)

---

## Core Components

### 1. Navigation Bar
- **Structure:** Fixed top, full-width with max-width container
- **Layout:** Logo (left) | Search (center expand) | Profile + Auth (right)
- **Treatment:** Glassmorphism effect with backdrop blur: `backdrop-blur-xl bg-opacity-80`
- **Height:** `h-16 md:h-20`
- **Borders:** Subtle bottom border with low opacity

### 2. Song Cards (Primary Component)
- **Container:** Rounded corners `rounded-xl`, glassmorphism background
- **Structure:**
  - YouTube thumbnail (16:9 aspect ratio, `rounded-t-xl`)
  - Content area with `p-4`:
    - Song title (truncate with `line-clamp-2`)
    - Artist name (smaller, muted text)
  - Reaction bar (icons with counts, flex layout)
- **Hover State:** Subtle lift `hover:scale-105 transition-transform duration-200`
- **Size:** Flexible width with min `min-w-[240px] max-w-[320px]`

### 3. Feed Carousel Section
- **Container:** Full-width section with `py-8 md:py-12`
- **Header:** Section title + "See All" link aligned with `flex justify-between items-center mb-6`
- **Scroll Area:** 
  - Horizontal scrollable: `flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory`
  - Hide scrollbar but keep functionality
  - Snap points on cards: `snap-start`
- **Cards:** Song cards in horizontal layout with consistent sizing

### 4. Song of the Day Hero
- **Layout:** Prominent centered card, `max-w-4xl mx-auto py-12 md:py-20`
- **Card Design:**
  - Large glassmorphism container `p-8 md:p-12 rounded-2xl`
  - YouTube embed (16:9, `rounded-xl overflow-hidden`)
  - Metadata below: Title (large), Artist, Tags (pill badges)
  - Action buttons: Like, Add to Playlist, Share (horizontal layout)
- **Treatment:** Gradient border accent, elevated shadow

### 5. Discover Grid
- **Layout:** Standard responsive grid `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6`
- **Cards:** Same song card component as carousel
- **Filters:** Top bar with tag chips for filtering `flex flex-wrap gap-2 mb-6`

### 6. Playlist Editor
- **Structure:** Modal or dedicated page with two-column layout on desktop
- **Left Column:** Playlist details (title input, cover, metadata)
- **Right Column:** Song list with drag-to-reorder, remove buttons
- **Treatment:** Larger glassmorphism container with clear sections

### 7. Tag System
- **Pills/Badges:** `px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm`
- **Interactive:** Clickable tags with hover state
- **Grouping:** Flex wrap layout with small gaps `flex flex-wrap gap-2`

### 8. Reaction Bar
- **Layout:** Horizontal flex `flex items-center gap-4`
- **Elements:** Icon + count pairs (Heart, Play, Share)
- **Icons:** Use Heroicons via CDN (outline style, 20px)
- **Treatment:** Semi-transparent background, subtle hover highlights

### 9. User Profile Section
- **Layout:** Card-based with avatar (circular, large), username, bio
- **Stats Row:** Followers, Following, Songs Liked (flex layout)
- **Action:** Edit Profile or Follow button (depends on context)

### 10. Authentication Forms
- **Container:** Centered modal or page, `max-w-md mx-auto`
- **Design:** Minimal glassmorphism card with `p-8 rounded-2xl`
- **Inputs:** Full-width with subtle borders, focus states with glow
- **Buttons:** Primary CTA button (full-width), secondary OAuth buttons (icon + text)
- **Spacing:** Generous vertical spacing between fields `space-y-6`

---

## Visual Treatment

### Glassmorphism Pattern
- Background: Semi-transparent with blur `backdrop-blur-md bg-white/5`
- Borders: Subtle light borders `border border-white/10`
- Shadows: Soft elevation `shadow-xl shadow-black/20`
- Applied to: Cards, modals, navigation, sidebars

### Gradient Accents
- Use as subtle overlays, borders, or button backgrounds
- Direction: Usually diagonal `bg-gradient-to-br`
- Restraint: Only on key CTAs and emphasis areas

### Rounded Corners
- Cards/Containers: `rounded-xl` or `rounded-2xl`
- Buttons: `rounded-full` for pills, `rounded-lg` for rectangles
- Images/Thumbnails: Match parent container rounding

### Transitions (Minimal)
- Hover states: `transition-all duration-200`
- Scale effects: `hover:scale-105` sparingly
- No complex scroll animations or parallax
- Smooth opacity changes on interactions

---

## Page Layouts

### Homepage (Logged In)
1. **Song of the Day** - Hero section with featured track
2. **Your Feed** - Horizontal carousel of friends' activity
3. **Trending Now** - Horizontal carousel of global trending
4. **Recommended Tags** - Tag cloud or horizontal scroll
5. **Recent Playlists** - Grid of user's playlists

### Discover Page
1. **Filter Bar** - Tags and sorting options
2. **Song Grid** - Responsive grid of all songs
3. **Pagination** - Load more or infinite scroll

### Profile Page
1. **User Header** - Avatar, stats, actions
2. **Playlists Tab** - Grid of user playlists
3. **Liked Songs Tab** - Grid of liked songs

---

## Assets & Icons

**Icons:** Heroicons via CDN (outline style for navigation, solid for active states)
- Common icons: Heart, Play, Share, Plus, Search, User, Music Note, Grid, List

**YouTube Embeds:**
- Use iframe API with `?controls=1&modestbranding=1`
- Extract video ID from URL, construct embed URL
- Responsive iframe wrapper with aspect-ratio-16/9

**Placeholder States:**
- Empty playlists: Icon + text (centered)
- Loading: Skeleton screens matching card layout
- No results: Friendly message with suggestions

---

## Mobile Optimization

- Stack horizontal carousels vertically on mobile
- Larger touch targets (min 44px height for buttons)
- Bottom navigation bar for key actions on mobile
- Simplified navigation menu (hamburger)
- Single column layouts for forms and content
- Maintain glassmorphism but reduce blur intensity for performance

---

## Images

**Hero Section:** IsaiToday does NOT use a traditional hero image. Instead, it features the "Song of the Day" with YouTube embed as the hero element.

**Profile Avatars:** Circular user avatars (96px - 128px) for profiles, smaller (32px - 40px) for navbar

**Song Thumbnails:** YouTube video thumbnails automatically fetched via YouTube API, displayed in 16:9 aspect ratio throughout the app

---

This design system creates a sophisticated, music-first experience that balances Spotify's boldness with Notion's organizational clarity, all wrapped in an elegant dark aesthetic perfect for IsaiToday's social music discovery platform.