# API Specifications & Schema

## Django Applications

### 1. Core App (Git Platform)
**Models** (managed=False):
- `Users`, `Repositories`, `Commits`, `Issues`, `PullRequests`
**Endpoints**:
- `/api/repos/` (RepositoryViewSet)
- `/api/commits/` (CommitViewSet)
- `/api/tools/generate-commit/` (AI Tool)

### 2. Forum App (Q&A)
**Models** (Managed by Django):
- `ForumPost`: title, code_snippet, language, views, tags (TaggableManager)
- `ForumComment`: Nested comments
- `PostVote`: Like/Dislike logic
**Endpoints**:
- `/api/forum/posts/`: CRUD + Search + Filter
- `/api/forum/comments/`: Threaded comments

## Integrations
- **n8n**: Used for AI workflows via `x-auth-token`.
- **OAuth**: Google, GitHub, GitLab, Discord via `dj-rest-auth`.
