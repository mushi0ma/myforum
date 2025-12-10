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

---

### Frontend (React/Vite)

#### 1. PostCard Component
**File**: `frontend/src/components/PostCard.tsx`

Features:
- ✅ VS Code-style code tab design (traffic lights, filename, language badge)
- ✅ Syntax highlighting (`react-syntax-highlighter` + `vscDarkPlus` theme)
- ✅ Author avatar + username + timestamp
- ✅ Interaction buttons: Heart (likes), MessageSquare (comments), GitFork (forks)
- ✅ Bookmark + Share actions
- ✅ Tag badges
- ✅ React Router `<Link>` navigation (not Next.js)

Props interface: `PostCardProps` (id, filename, language, author, timestamp, code, likes, comments, forks, tags)

#### 2. Widgets Component
**File**: `frontend/src/components/Widgets.tsx`

Features:
- ✅ Sticky sidebar (visible only on `xl:` breakpoint)
- ✅ "Trending Repos" section (TrendingUp icon, repo name, author, stars)
- ✅ "Top Contributors" section (Avatar, name, username, post count)
- ✅ React Router `<Link>` (not Next.js Link)
- ✅ Lucide React icons

Data: Currently hardcoded (TODO: connect to API)

---

## 📋 Available Components in Donor (Not Yet Migrated)

```
/home/pumopup5/live-app/git-forum-layout-design-2/components/
├── bookmark-card.tsx          # Saved post card UI
├── bookmarks-empty.tsx        # Empty state for bookmarks page
├── code-samples.tsx           # Code snippet gallery/carousel
├── explore-card.tsx           # Post card variant for explore page
├── explore-filters.tsx        # Filter controls (language, sort, tags)
├── navbar.tsx                 # Top navigation bar
├── settings-account.tsx       # Settings: account management
├── settings-appearance.tsx    # Settings: theme/display preferences
├── settings-notifications.tsx # Settings: notification preferences
├── settings-profile.tsx       # Settings: user profile edit
├── sidebar.tsx                # Left sidebar navigation
├── tag-card.tsx               # Tag overview card
├── theme-provider.tsx         # Dark mode provider
└── trending-card.tsx          # Trending post card variant
```

---

## 🎯 Next Steps (Recommended Priority)

### High Priority
1. **Navbar** - Critical for app navigation
2. **Sidebar** - Core layout component
3. **Explore Filters** - Essential for feed functionality
4. **Trending Card** - Uses new `trending_score` field from backend

### Medium Priority
5. **Theme Provider** - Dark mode support (already have `next-themes` installed)
6. **Explore Card** - Alternative post card design
7. **Tag Card** - Tag browsing feature

### Low Priority
8. **Bookmark Card** + **Bookmarks Empty** - Nice-to-have feature
9. **Settings Components** (4 files) - Can be migrated together
10. **Code Samples** - Gallery view for code snippets

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

None currently reported. Docker services running successfully:
- ✅ nginx
- ✅ frontend (Vite dev server)
- ✅ web (Django)
- ✅ worker (Celery)
- ✅ celery-beat (Periodic tasks)
- ✅ redis

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

Modified files:
```
M .gitignore
M backend/config/settings.py
M backend/forum/apps.py
M backend/forum/models.py
M backend/forum/serializers.py
M backend/requirements.txt
M docker-compose.yml
M frontend/package.json
M frontend/src/components/PostCard.tsx
M frontend/src/components/Widgets.tsx
```

New files (unstaged):
```
?? backend/celerybeat-schedule
?? backend/forum/migrations/0003_forumpost_forks_count_forumpost_trending_score.py
?? backend/forum/signals.py
?? backend/forum/tasks.py
?? docs/
```

**Recommendation**: Commit these changes before continuing migration.
