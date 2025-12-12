# Migration Progress: Partner → MyForum

## Donor Project
**Source**: `/home/pumopup5/live-app/git-forum-layout-design-2` (Next.js)
**Target**: `/mnt/git-data/live-app` (Django + Vite)

---

## ✅ Completed Tasks

### Backend (Django)

#### 1. ForumPost Model Enhancements
**File**: `backend/forum/models.py`

Added fields:
- `forks_count: IntegerField` (default=0) - tracks post forks
- `trending_score: FloatField` (default=0.0, db_index=True) - algorithmic trending

Methods:
- `calculate_trending_score()` - formula: `(likes + comments×2 + forks×3) / hours^1.5`
  - Min time: 0.1h (6 min) to prevent division by zero
  - Returns float rounded to 2 decimals

#### 2. Database Migration
**File**: `backend/forum/migrations/0003_forumpost_forks_count_forumpost_trending_score.py`

Status: ✅ Applied successfully

#### 3. Serializer Updates
**File**: `backend/forum/serializers.py`

- Added `forks_count` (read-write)
- Added `trending_score` (read-only)
- Both fields now exposed via API

#### 4. Celery Background Tasks
**File**: `backend/forum/tasks.py`

Tasks:
- `update_trending_scores()` - periodic task (every 15 min) recalculates all posts
- `update_single_post_trending_score(post_id)` - updates one post on activity change

#### 5. Django Signals
**File**: `backend/forum/signals.py`

Auto-triggers trending score updates:
- `post_save` / `post_delete` on `PostVote` (likes/dislikes)
- `post_save` / `post_delete` on `ForumComment`
- 5-second delay to batch changes

**Registered in**: `backend/forum/apps.py` → `ForumConfig.ready()`

#### 6. Celery Beat Configuration
**File**: `backend/config/settings.py`

```python
CELERY_BEAT_SCHEDULE = {
    'update-trending-scores-every-15-minutes': {
        'task': 'forum.tasks.update_trending_scores',
        'schedule': 900.0,  # 15 min
    },
}
```

#### 7. Docker Compose
**File**: `docker-compose.yml`

Added service:
```yaml
celery-beat:
  build: ./backend
  command: celery -A config beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
  volumes:
    - ./backend:/app
  depends_on:
    - redis
  environment:
    - DJANGO_SETTINGS_MODULE=config.settings
```

Status: ✅ Running successfully (logs confirmed)

#### 8. Forum Post ViewSet Enhancements
**File**: `backend/forum/views.py`

Added features:
- `ordering_fields`: `['created_at', 'views', 'trending_score', 'forks_count']`
- `get_queryset()` method for filtering:
  - `language`: filter by programming language
  - `tags`: filter by django-taggit tags (comma-separated)
- Examples:
  - `/api/posts/?ordering=-trending_score` (trending page)
  - `/api/posts/?language=Python&tags=async,django`

**Optimization**: Uses DB indexes on `trending_score` for fast queries (КМ01 ✅)

#### 9. Vote & Fork Actions
**File**: `backend/forum/views.py`
**Status**: ✅ Added

Actions:
- `vote` - Toggle like/unlike post
  - Creates/deletes PostVote record
  - Returns new likes_count
- `fork` - Fork a post (create copy)
  - Creates new post with "(Fork)" suffix
  - Increments original forks_count
  - Returns new post data

#### 10. Comments Filtering
**File**: `backend/forum/views.py`
**Status**: ✅ Added

ForumCommentViewSet enhancements:
- `get_queryset()` - Filter by post_id via `?post={id}` query param
- `perform_create()` - Auto-assign author from request.user

---

### Frontend (React/Vite)

#### 1. PostCard Component
**File**: `frontend/src/components/PostCard.tsx`
**Status**: ✅ Migrated & Enhanced

Features:
- ✅ VS Code-style code tab design (traffic lights, filename, language badge)
- ✅ Syntax highlighting (`react-syntax-highlighter` + `vscDarkPlus` theme)
- ✅ Custom scrollbar styling for code blocks (`.code-scrollbar` in `index.css`)
- ✅ Author avatar + username + timestamp
- ✅ Interaction buttons: Heart (likes), MessageSquare (comments), GitFork (forks)
- ✅ Bookmark + Share actions
- ✅ Tag badges
- ✅ React Router `<Link>` navigation (not Next.js)

Props interface: `PostCardProps` (id, filename, language, author, timestamp, code, likes, comments, forks, tags)

**Improvements over donor**:
- Advanced syntax highlighting with Prism (donor uses plain `<pre>`)
- Custom scrollbar styling matching VS Code theme

#### 2. Widgets Component
**File**: `frontend/src/components/Widgets.tsx`
**Status**: ✅ Migrated & Enhanced

Features:
- ✅ Sticky sidebar (visible only on `xl:` breakpoint - `hidden xl:block`)
- ✅ "Trending Repos" section (TrendingUp icon, repo name, author, stars)
- ✅ "Top Contributors" section (Avatar, name, username, post count)
- ✅ React Router `<Link>` (not Next.js Link)
- ✅ Lucide React icons
- ✅ TypeScript interfaces: `TrendingRepo`, `TopContributor`

Data: Currently uses mock data (TODO: connect to API)

**Improvements over donor**:
- React Router `<Link>` instead of plain `<a>` tags (better SPA navigation)
- Exported TypeScript interfaces for type safety

#### 3. Navbar Component
**File**: `frontend/src/components/layout/Navbar.tsx`
**Status**: ✅ Migrated & Enhanced

Features:
- ✅ Mobile menu trigger button (hamburger icon for < lg screens)
- ✅ Logo with GitForum branding
- ✅ Search bar (hidden on mobile)
- ✅ Notification bell button
- ✅ "New Post" action button
- ✅ **User Menu Dropdown** with profile options:
  - Profile link
  - Bookmarks link
  - Settings link
  - Sign Out button
- ✅ Responsive design (adapts to mobile/tablet/desktop)

**Improvements over donor**:
- Added User Menu DropdownMenu (donor only had simple avatar link)
- Mobile menu trigger for adaptive navigation
- Better UX with dropdown menu instead of direct link

#### 4. Sidebar Component (Desktop)
**File**: `frontend/src/components/layout/AppSidebar.tsx`
**Status**: ✅ Migrated & Enhanced

Features:
- ✅ Fixed sidebar (visible on >= lg screens)
- ✅ GitForum branding in header
- ✅ Navigation menu with active state highlighting
- ✅ Icons from lucide-react
- ✅ React Router Link with useLocation
- ✅ Footer with user profile and Sign Out
- ✅ **Prepared for Forum/Git split** (comments added for future tabs)

Navigation items:
- Home, Explore, Trending, Bookmarks (Forum section)
- AI Tools, Profile, Settings (Utility section)

**Future enhancements**:
- Split into Forum and Git navigation tabs
- Add Git-specific items (Repositories, Commits, Pull Requests, Issues)

#### 5. MobileSidebar Component
**File**: `frontend/src/components/layout/MobileSidebar.tsx`
**Status**: ✅ Newly Created

Features:
- ✅ Sheet/Drawer component for mobile (< lg screens)
- ✅ Slide-in from left animation
- ✅ Full navigation menu matching desktop sidebar
- ✅ Active link highlighting
- ✅ User profile display
- ✅ Sign Out button
- ✅ Auto-close on navigation
- ✅ Overlay backdrop

**Addresses ПМ02 criteria**:
- ✅ **Адаптивность** - Mobile-first responsive navigation

#### 6. MainLayout Component
**File**: `frontend/src/components/layout/MainLayout.tsx`
**Status**: ✅ Updated

Features:
- ✅ SidebarProvider wrapper
- ✅ Desktop sidebar (AppSidebar) - hidden on mobile
- ✅ Mobile sidebar (MobileSidebar) - Sheet/Drawer for < lg
- ✅ Navbar with mobile menu trigger
- ✅ Main content area (center column)
- ✅ Widgets sidebar (right column, hidden on mobile)
- ✅ Responsive grid layout
- ✅ useState hook for mobile menu state

Layout structure:
```
[Desktop Sidebar] [Navbar] [Content] [Widgets]
     (fixed)      (sticky)  (scroll)  (sticky)
```

Mobile structure:
```
[Hamburger Menu] [Navbar]
        ↓
[Mobile Sheet Sidebar]
```

#### 7. Trending Page
**File**: `frontend/src/pages/Trending.tsx`
**Status**: ✅ Migrated & Enhanced

Features:
- ✅ API integration with `forumApi.getTrendingPosts()`
- ✅ Real-time filtering (search, language, time, sort)
- ✅ TrendingCard component for post display
- ✅ Time filters (Today, This Week, This Month)
- ✅ Sort options (Growth Rate, Most Stars, Most Comments)
- ✅ Language filters (All, JavaScript, Python, TypeScript, etc.)
- ✅ "How Trending Works" info panel with formula
- ✅ Loading and error states
- ✅ Empty state handling

**Backend Integration**:
- Fetches posts sorted by `trending_score` DESC
- Uses DB index for optimized queries (КМ01 ✅)

#### 8. Explore Page
**File**: `frontend/src/pages/Explore.tsx`
**Status**: ✅ Migrated & Enhanced

Features:
- ✅ API integration with `forumApi.getExplorePosts()`
- ✅ ExploreFilters component integration
- ✅ PostCard component for grid display
- ✅ Advanced filtering (search, language, tags, categories)
- ✅ Quick stats dashboard (Trending Today, This Week, Total)
- ✅ URL parameter support (e.g., `?tag=react`)
- ✅ Responsive grid layout (1/2/3 columns)
- ✅ Real-time filtering and sorting

**Backend Integration**:
- Supports query params: `language`, `tags`, `ordering`
- Uses django-taggit for tag filtering
- DB indexes on `trending_score` for performance

#### 9. TrendingCard Component
**File**: `frontend/src/components/TrendingCard.tsx`
**Status**: ✅ Newly Created

Features:
- ✅ Rank badge (1st gold, 2nd silver, 3rd bronze)
- ✅ HOT indicator for top 3 posts
- ✅ Language color coding
- ✅ Growth percentage display
- ✅ Author avatar and username
- ✅ Stats (likes, comments, forks, views)
- ✅ Tags display (limited to 3)
- ✅ Trending score display
- ✅ Time ago calculation
- ✅ React Router Link integration

#### 10. ExploreFilters Component
**File**: `frontend/src/components/ExploreFilters.tsx`
**Status**: ✅ Newly Created

Features:
- ✅ Search bar with icon
- ✅ Language pills with icons
- ✅ Active tags display with remove functionality
- ✅ Expandable filters panel (toggle button)
- ✅ Popular tags selection
- ✅ Categories selection
- ✅ Time period filters
- ✅ Sort options
- ✅ "Clear all" functionality

#### 11. Forum API Service
**File**: `frontend/src/services/api.ts`
**Status**: ✅ Newly Created & Enhanced

Methods:
- `getTrendingPosts()` - fetch posts by trending_score
- `getExplorePosts(params)` - fetch with filters
- `getPostById(id)` - fetch single post
- `createPost(data)` - create new post
- `getComments(postId)` - fetch comments for a post
- `createComment(postId, content)` - create new comment
- `votePost(postId)` - like/unlike a post
- `forkPost(postId)` - fork a post

Interfaces:
- `ForumPost` - complete post type definition
- `ForumComment` - comment type definition
- `ExploreParams` - filter parameters type

#### 12. PostDetail Page
**File**: `frontend/src/pages/PostDetail.tsx`
**Status**: ✅ Newly Created

Features:
- ✅ Full API integration (post + comments)
- ✅ Loading skeleton (PostDetailSkeleton component)
- ✅ Error state with "Go to Feed" button
- ✅ Back button navigation
- ✅ Post article with VS Code-style code block
- ✅ Syntax highlighting (react-syntax-highlighter)
- ✅ Like button with toggle state
- ✅ Fork button (creates copy and navigates)
- ✅ Comments section:
  - Comment form (Textarea + Submit button)
  - Loading state during submission
  - Real-time list update without page reload
  - Empty state message

**Backend Integration**:
- Uses `/api/forum/posts/{id}/` for post data
- Uses `/api/forum/comments/?post={id}` for comments
- POST to `/api/forum/posts/{id}/vote/` for likes
- POST to `/api/forum/posts/{id}/fork/` for forks

#### 13. Settings Components (4 files)
**Files**: `frontend/src/components/settings/`
**Status**: ✅ Migrated & Enhanced

Components:
- `SettingsProfile.tsx` - Profile editing with avatar upload
  - Uses react-hook-form + zod for validation
  - Sonner toast notifications
  - Form fields: displayName, username, email, bio, website, github, twitter
- `SettingsAppearance.tsx` - Theme & code editor settings
  - Light/Dark/System theme toggle
  - Code theme selection (GitHub Dark, Dracula, etc.)
  - Code font selection (JetBrains Mono, Fira Code, etc.)
  - Font size slider with live preview
  - Line numbers & word wrap toggles
  - localStorage persistence
- `SettingsNotifications.tsx` - Email & Push notification preferences
  - Enable/Disable all buttons
  - Individual toggles for likes, comments, followers, mentions
  - Weekly digest option
- `SettingsAccount.tsx` - Security & account management
  - Password change with strength indicator
  - Password requirements checklist
  - Two-factor authentication (placeholder)
  - Export data functionality
  - Delete account (danger zone with confirmation dialog)

**Improvements over donor**:
- Uses react-hook-form + zod for form validation
- Uses sonner for toast notifications (consistent with project)
- Better TypeScript types

#### 14. Settings Page
**File**: `frontend/src/pages/Settings.tsx`
**Status**: ✅ Migrated

Features:
- ✅ Tab-based navigation (Profile, Appearance, Notifications, Account)
- ✅ Responsive layout (horizontal tabs on mobile, vertical on desktop)
- ✅ Active tab highlighting with primary color
- ✅ Lucide icons for each tab

#### 15. Bookmarks Components
**Files**: `frontend/src/components/BookmarkCard.tsx`, `BookmarksEmpty.tsx`
**Status**: ✅ Newly Created

BookmarkCard features:
- ✅ Language color indicator
- ✅ Title with hover effect
- ✅ Description with line-clamp
- ✅ Tags display (max 4)
- ✅ Author avatar + name
- ✅ Stats (stars, forks, views)
- ✅ "Saved X ago" timestamp
- ✅ Remove button with confirmation
- ✅ React Router Link integration

BookmarksEmpty features:
- ✅ Empty state illustration (Bookmark + Search icons)
- ✅ Helpful message
- ✅ "Explore Snippets" CTA button

#### 16. Bookmarks Page
**File**: `frontend/src/pages/Bookmarks.tsx`
**Status**: ✅ Newly Created

Features:
- ✅ Header with bookmark count
- ✅ Search bar with icon
- ✅ Language filter dropdown
- ✅ Sort options (Date Added, Most Stars, Title A-Z)
- ✅ Grid/List view toggle
- ✅ Responsive grid layout (1/2 columns)
- ✅ Empty state when no bookmarks
- ✅ "No results" state for filtered search
- ✅ Remove bookmark functionality

**Note**: Currently uses mock data. TODO: Connect to API when bookmark endpoints are ready.

---

## 📋 Available Components in Donor (Remaining)

```
/home/pumopup5/live-app/git-forum-layout-design-2/components/
├── code-samples.tsx           # Code snippet gallery/carousel
├── explore-card.tsx           # Post card variant for explore page
├── tag-card.tsx               # Tag overview card
└── theme-provider.tsx         # Dark mode provider (optional - we have manual dark class toggle)
```

**All major components have been migrated!**

---

## 🎯 Migration Status Summary

### ✅ Completed (High Priority)
1. ~~**Navbar**~~ ✅ - User Menu dropdown + mobile trigger
2. ~~**Sidebar**~~ ✅ - Desktop + mobile adaptive versions
3. ~~**Explore Filters**~~ ✅ - All filter options
4. ~~**Trending Card**~~ ✅ - Uses `trending_score` with full stats
5. ~~**Trending Page**~~ ✅ - Full API integration
6. ~~**Explore Page**~~ ✅ - Advanced filtering and grid display
7. ~~**PostDetail Page**~~ ✅ - Full post view with comments
8. ~~**Settings Page**~~ ✅ - 4 tab components with forms
9. ~~**Bookmarks Page**~~ ✅ - Grid/list view with filters

### 🔮 Optional (Low Priority)
- **Code Samples** - Gallery view for code snippets (nice-to-have)
- **Explore Card** - Alternative post card design (PostCard already works)
- **Tag Card** - Tag browsing feature (can add later)
- **Theme Provider** - We already have manual dark class toggle in SettingsAppearance

---

## 🔍 Migration Checklist (Per Component)

When porting components from donor:
- [ ] Replace `import Image from 'next/image'` → `<img>`
- [ ] Replace `import Link from 'next/link'` → `import { Link } from 'react-router-dom'`
- [ ] Convert Server Components to API calls (`useEffect` + `fetch`)
- [ ] Keep Tailwind CSS 4 classes identical
- [ ] Use lucide-react icons (same as donor)
- [ ] Verify absolute imports work (`@/components/...`)
- [ ] Test responsive breakpoints (sm, md, lg, xl)

---

## 🐛 Known Issues

### ✅ Fixed: API Endpoint 404 Error (2025-12-12)
**Problem**: Frontend was using `/api/posts/` but Django expects `/api/forum/posts/`.
**Solution**: Updated `frontend/src/services/api.ts` to use correct endpoint.

### Note: First Load Performance
After changes, the site loads correctly. If you experience slow loads:
1. Check that API endpoints respond: `curl http://localhost/api/forum/posts/`
2. Verify Vite HMR is working (WebSocket connection in browser console)
3. Font files should load from `/fonts/` directory

---

## ✅ Docker Services Status
- ✅ nginx (port 80)
- ✅ frontend (Vite dev server, port 3000)
- ✅ web (Django/Gunicorn, port 8000)
- ✅ worker (Celery)
- ✅ celery-beat (Periodic tasks)
- ✅ redis

---

## 🔧 MCP Servers Configuration

### Configured MCP Servers
1. **context7** - External documentation lookup (React, Django, Tailwind)
2. **postgres** - Database operations via PostgreSQL MCP
3. **docker** - Container management (added 2025-12-12)

### Docker MCP Setup
Location: `/mnt/git-data/mcp-servers/src/docker`
Repository: [QuantGeekDev/docker-mcp](https://github.com/QuantGeekDev/docker-mcp)

Available tools:
- `list-containers` - List all Docker containers
- `create-container` - Create standalone container
- `deploy-compose` - Deploy Docker Compose stack
- `get-logs` - Retrieve container logs

Configuration in `~/.claude.json`:
```json
"docker": {
  "type": "stdio",
  "command": "/home/pumopup5/.local/bin/uv",
  "args": [
    "--directory",
    "/mnt/git-data/mcp-servers/src/docker",
    "run",
    "docker-mcp"
  ]
}
```

---

## 📊 Database Schema Changes

```sql
-- Applied migration 0003
ALTER TABLE forum_forumpost
  ADD COLUMN forks_count INTEGER DEFAULT 0,
  ADD COLUMN trending_score DOUBLE PRECISION DEFAULT 0.0;

CREATE INDEX idx_trending_score ON forum_forumpost (trending_score);
```

---

## 🔄 Git Status (Current Branch: main)

### Backend Changes
```
M backend/forum/views.py (vote/fork actions, comments filtering)
M backend/forum/serializers.py (added author_username, counts)
```

### Frontend Changes
```
M frontend/src/App.tsx (added /post/:id, /bookmarks, /feed routes)
M frontend/src/services/api.ts (added getComments, createComment, votePost, forkPost)
```

### New Frontend Files
```
?? frontend/src/pages/PostDetail.tsx (post detail with comments)
?? frontend/src/pages/Bookmarks.tsx (bookmarks page with filters)
?? frontend/src/components/BookmarkCard.tsx (bookmark card component)
?? frontend/src/components/BookmarksEmpty.tsx (empty state)
?? frontend/src/components/settings/ (4 settings components - already existed, enhanced)
```

### Previously Added (from earlier migration)
```
?? frontend/src/components/layout/MobileSidebar.tsx
?? frontend/src/components/TrendingCard.tsx
?? frontend/src/components/ExploreFilters.tsx
?? frontend/src/pages/Trending.tsx
?? frontend/src/pages/Explore.tsx
?? frontend/src/services/api.ts
?? backend/forum/signals.py
?? backend/forum/tasks.py
```

**Status**: All major donor components have been migrated!
