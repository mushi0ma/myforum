# Project Guidelines

## Project Overview
**GitForum** - IT-платформа для разработчиков, объединяющая систему управления git-репозиториями с форумом для обмена кодом и знаниями.

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 5.4.0 | Build Tool & Dev Server |
| Tailwind CSS | 4.1.17 | Styling (oklch colors) |
| React Router DOM | 6.28.0 | Client-side Routing |
| Radix UI | Latest | Headless UI Components (shadcn/ui) |
| React Hook Form | 7.68.0 | Form Management |
| Zod | 3.25.76 | Schema Validation |
| Sonner | 2.0.3 | Toast Notifications |
| Lucide React | 0.487.0 | Icons |
| react-syntax-highlighter | 15.5.0 | Code Highlighting |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Django | 5.0.2 | Web Framework |
| Django REST Framework | 3.14.0 | REST API |
| PostgreSQL | 15+ | Primary Database |
| Redis | 5.0.1 | Cache & Message Broker |
| Celery | 5.3.6 | Task Queue |
| Gunicorn | 21.2.0 | WSGI Server |
| django-allauth | 0.63.3 | OAuth (Google, GitHub, GitLab, Discord) |
| SimpleJWT | 5.3.1 | JWT Authentication |
| django-taggit | 5.0.1 | Tagging System |
| GitPython | 3.1.41 | Git Operations |

### Infrastructure
| Component | Technology | Purpose |
|-----------|------------|---------|
| Reverse Proxy | Nginx Alpine | Load Balancing, Static Files |
| Container | Docker Compose | Orchestration |
| Cloud | Google Cloud Platform | Hosting |
| OS | Ubuntu Server 22.04 | Host System |

---

## Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           GOOGLE CLOUD VM                               │
│                         (Ubuntu Server 22.04)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      DOCKER COMPOSE                              │   │
│  │                                                                   │   │
│  │   ┌─────────────┐                                                 │   │
│  │   │   NGINX     │ :80                                             │   │
│  │   │  (Alpine)   │────────────────────────────────────────┐       │   │
│  │   └──────┬──────┘                                        │       │   │
│  │          │                                               │       │   │
│  │          │ /api/*                              /*        │       │   │
│  │          ▼                                     ▼         │       │   │
│  │   ┌─────────────┐                      ┌─────────────┐   │       │   │
│  │   │   DJANGO    │                      │   VITE      │   │       │   │
│  │   │  (Gunicorn) │ :8000                │   (React)   │ :3000    │   │
│  │   └──────┬──────┘                      └─────────────┘   │       │   │
│  │          │                                               │       │   │
│  │          │                                               │       │   │
│  │   ┌──────▼──────┐     ┌─────────────┐                   │       │   │
│  │   │   CELERY    │◄────│    REDIS    │ :6379             │       │   │
│  │   │   Worker    │     │   (Alpine)  │                   │       │   │
│  │   └─────────────┘     └─────────────┘                   │       │   │
│  │          │                                               │       │   │
│  │   ┌──────▼──────┐                                        │       │   │
│  │   │ CELERY BEAT │ (Scheduled Tasks)                      │       │   │
│  │   └─────────────┘                                        │       │   │
│  │                                                           │       │   │
│  └───────────────────────────────────────────────────────────┘       │   │
│                                                                         │
│  ┌───────────────────┐        ┌───────────────────────────┐            │
│  │   /mnt/git-data   │        │     External PostgreSQL   │            │
│  │  (Git Repos Vol)  │        │      (Google Cloud SQL)   │            │
│  └───────────────────┘        └───────────────────────────┘            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Docker Services (6 containers)

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| nginx | nginx:alpine | 80 | Reverse proxy, routes /api/* to Django, /* to Vite |
| frontend | Custom (Node 22) | 3000 | Vite dev server / production build |
| web | Custom (Python 3.10) | 8000 | Django + Gunicorn |
| worker | Custom (Python 3.10) | - | Celery worker for async tasks |
| celery-beat | Custom (Python 3.10) | - | Periodic tasks scheduler |
| redis | redis:alpine | 6379 | Message broker & cache |

### Request Flow
```
User Request → Nginx (:80)
                 │
                 ├── /api/* → Django (:8000) → PostgreSQL
                 │                           → Redis (cache)
                 │                           → Celery (async)
                 │
                 └── /* → Vite (:3000) → Static React SPA
```

---

## Directory Structure

```
live-app/
├── backend/                    # Django Application
│   ├── config/                 # Settings, URLs, WSGI
│   │   ├── settings.py         # Django configuration
│   │   ├── urls.py             # Root URL patterns
│   │   └── celery.py           # Celery config
│   ├── core/                   # Git Platform Module
│   │   ├── models.py           # Users, Repos, Commits, PRs, Issues
│   │   ├── views.py            # Git API views
│   │   └── services/           # Business logic
│   ├── forum/                  # Forum Module
│   │   ├── models.py           # ForumPost, Comment, Vote, Saved
│   │   ├── views.py            # Forum API (ViewSets)
│   │   ├── serializers.py      # DRF serializers
│   │   ├── signals.py          # Post-save signals
│   │   └── tasks.py            # Celery tasks (trending)
│   ├── templates/              # OAuth callback templates
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/         # UI Components
│   │   │   ├── ui/             # shadcn/ui primitives
│   │   │   ├── layout/         # Navbar, Sidebar, MainLayout
│   │   │   └── settings/       # Settings form components
│   │   ├── pages/              # Route pages
│   │   │   ├── Main.tsx        # Feed page
│   │   │   ├── PostDetail.tsx  # Single post with comments
│   │   │   ├── Trending.tsx    # Trending posts
│   │   │   ├── Explore.tsx     # Search & filter
│   │   │   ├── Bookmarks.tsx   # Saved posts
│   │   │   ├── Settings.tsx    # User settings
│   │   │   └── Profile.tsx     # User profile
│   │   ├── services/           # API clients
│   │   │   └── api.ts          # Forum API service
│   │   ├── lib/                # Utilities (cn, utils)
│   │   └── index.css           # Tailwind + CSS variables
│   ├── package.json            # NPM dependencies
│   └── vite.config.ts          # Vite configuration
│
├── nginx/
│   └── nginx.conf              # Nginx routing config
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md         # Tech stack overview
│   ├── API_SPECS.md            # API endpoints
│   └── MIGRATION_PROGRESS.md   # Partner migration status
│
└── docker-compose.yml          # Container orchestration
```

---

## Core Rules

### Environment
- **OS**: Ubuntu Server 22.04 (Dockerized)
- **Node.js**: v22 (frontend)
- **Python**: 3.10 (backend)

### Documentation
- Architecture & Stack → `docs/ARCHITECTURE.md`
- API & Database → `docs/API_SPECS.md`
- Migration Status → `docs/MIGRATION_PROGRESS.md`

### Tools (MCP)
- Use `context7` for external docs (React, Django, Tailwind)
- Use `repomix` sparingly (focus on specific files)
- Use `postgres` MCP for database queries and migrations
- Use `docker` MCP for container management

---

## Coding Standards

### Backend (Django)
- **Views**: Use `ModelViewSet` for CRUD, `APIView` for custom actions
- **Serializers**: Always use `ModelSerializer` with explicit `Meta`
- **Naming**: `snake_case` for functions/vars, `PascalCase` for classes
- **Services**: Business logic in `core/services/`, not in views
- **Tasks**: Async operations via Celery tasks

### Frontend (React/Vite)
- **Components**: Functional components + Hooks, PascalCase naming
- **Styling**: **Tailwind CSS 4 only**, no custom CSS (except `index.css`)
  - Use `cn()` helper for class merging
  - Colors via CSS variables (oklch) in `index.css`
- **State**: `useState` for local, `react-router` for URL state, No Redux
- **Imports**: Absolute imports (`@/components/...`)
- **Forms**: React Hook Form + Zod for validation
- **Notifications**: Sonner for toasts

---

## Database Schema (Key Tables)

### Core Module (Git Platform)
```
users           → username, email, password_hash, avatar_url, bio
repositories    → owner_id, name, description, fs_path, stars_count
commits         → repo_id, author_id, hash, message, branch
pull_requests   → repo_id, author_id, source_branch, target_branch, status
issues          → repo_id, author_id, title, body, is_closed
organizations   → owner_id, name, description
```

### Forum Module
```
forum_forumpost     → author_id, title, description, code_snippet, language,
                      trending_score, views, forks_count, is_solved
forum_forumcomment  → post_id, author_id, content, parent_id (replies)
forum_postvote      → user_id, post_id, vote_type (like/dislike)
forum_savedforumpost → user_id, post_id (bookmarks)
taggit_tag          → name, slug (via django-taggit)
```

---

## API Endpoints (Forum)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forum/posts/` | List posts (with filters) |
| GET | `/api/forum/posts/{id}/` | Get single post |
| POST | `/api/forum/posts/` | Create post |
| POST | `/api/forum/posts/{id}/vote/` | Like/unlike post |
| POST | `/api/forum/posts/{id}/fork/` | Fork post |
| GET | `/api/forum/comments/?post={id}` | Get comments |
| POST | `/api/forum/comments/` | Create comment |

### Query Parameters
- `ordering=-trending_score` — trending posts
- `language=Python` — filter by language
- `tags=react,hooks` — filter by tags
- `search=keyword` — full-text search

---

## Migration Context (Partner → MyForum)

Porting features from Next.js "Partner" project to Django/Vite:
- **DO NOT** copy `next/image` or `next/link` → use `<img>` and `react-router-dom`
- **DO NOT** copy Server Components → convert to API calls
- **KEEP** visual style (Tailwind classes) exact

### Migration Status: ✅ Complete
All major components migrated:
- Navbar, Sidebar, MobileSidebar
- PostCard, TrendingCard, BookmarkCard
- Explore, Trending, Bookmarks, PostDetail pages
- Settings components (Profile, Appearance, Notifications, Account)
- Forum API service with full integration
