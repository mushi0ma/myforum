# Project Architecture

## Tech Stack Overview

### Backend (Django)
- **Framework**: Django 5.0.2
- **Database**: PostgreSQL (psycopg2-binary)
- **API**: Django REST Framework 3.14.0
- **Authentication**:
  - Django Allauth (Google, GitHub, GitLab, Discord OAuth)
  - dj-rest-auth + JWT (Simple JWT)
- **Task Queue**: Celery 5.3.6 + Redis 5.0.1
- **Utils**: GitPython, Pillow, django-taggit
- **Deployment**: Gunicorn, WhiteNoise, Docker

### Frontend (React + TypeScript)
- **Framework**: React 19.2.0 + TypeScript 5.9.3
- **Build Tool**: Vite 5.4.0
- **Routing**: React Router DOM 6.28.0
- **UI Components**: Radix UI (shadcn/ui), Tailwind CSS 4.1.17
- **Forms**: React Hook Form 7.55.0 + Zod
- **AI**: React Syntax Highlighter, Markdown
- **Themes**: next-themes (dark mode support)

## Infrastructure
- **NGINX**: Reverse proxy (port 80) -> Django (8000) / React (3000)
- **Docker Compose**: 5 services (nginx, frontend, web, worker, redis)
- **Redis**: Broker for Celery & Session storage

## Directory Structure
```
/
├── backend/
│   ├── config/          # Settings, URLs, WSGI/ASGI
│   ├── core/            # Git platform core (Repos, Commits, Users)
│   ├── forum/           # Q&A Forum (Posts, Comments, Voting)
│   └── templates/       # OAuth templates
├── frontend/
│   ├── src/
│   │   ├── components/  # UI Kit (radix), Layouts, AI features
│   │   ├── pages/       # Routes (Main, Profile, Feed)
│   │   ├── services/    # API clients (Axios)
│   │   └── hooks/       # Custom hooks
```
