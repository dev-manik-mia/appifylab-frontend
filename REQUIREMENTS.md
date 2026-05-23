# Frontend Requirements - AppifyLab Feed Application

## Overview
Next.js 16 frontend for a social feed application with authentication, feed browsing, and social interactions.

## Tech Stack
- Next.js 16.2.6 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

## Pages & Routes

### 1. Login Page (`/login`)
- Email + password form
- Redirect to feed on success
- Link to register page

### 2. Register Page (`/register`)
- First name, last name, email, password form
- Redirect to feed on success
- Link to login page

### 3. Feed Page (`/feed`) - Protected
- Shows posts newest first
- Create post form (text + optional image)
- Public/private visibility toggle
- Post actions: like, comment

### 4. Post Detail Page (`/feed/{postId}`) - Protected
- Single post with full comment thread
- Comments with nested replies (1 level)
- Like/unlike for post and each comment/reply
- Show who liked (list of likers)

---

## Features

### 1. Authentication Flow
- JWT/Sanctum token stored in localStorage/cookies
- Axios/fetch interceptor for Bearer token
- Protected routes redirect to login
- Auto-redirect if already authenticated

### 2. Feed
- Infinite scroll or paginated list
- Post card with: author avatar, name, content, image, timestamp, visibility badge
- Like button with count
- Comment button → expand comments
- Private posts show indicator

### 3. Post Creation
- Text area for content
- Image upload (preview before submit)
- Public/Private toggle
- Submit button
- Optimistic UI update

### 4. Comments & Replies
- Expandable comment section on each post
- Comment input at bottom
- Reply button on each comment → inline reply form
- Each comment/reply has like button

### 5. Likes
- Heart/thumbs-up toggle button
- Animate on like
- Show count
- Click to see who liked (modal/popover)

---

## Component Architecture

```txt
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Redirect to /feed or /login
├── globals.css                   # Global styles
├── login/
│   └── page.tsx                  # Login page
├── register/
│   └── page.tsx                  # Register page
└── feed/
    ├── page.tsx                  # Feed page (post list)
    └── [postId]/
        └── page.tsx              # Post detail page

components/
├── AuthGuard.tsx                 # Protected route wrapper
├── Navbar.tsx                    # Top navigation
├── PostCard.tsx                  # Post display card
├── PostForm.tsx                  # Create post form
├── LikeButton.tsx                # Like/unlike toggle
├── CommentSection.tsx             # Comment list + form
├── CommentItem.tsx               # Single comment/reply
├── LikersList.tsx                # Who liked modal
└── VisibilityBadge.tsx           # Public/private badge

lib/
├── api.ts                        # Axios/fetch instance with auth
├── auth.ts                       # Auth helpers (login, register, logout)
└── types.ts                      # TypeScript interfaces
```

---

## API Integration

All API calls go to `http://appifylab-backend.test/api` (Laravel Herd URL).
Endpoints mirror backend routes:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get user |
| GET | `/posts` | List feed |
| POST | `/posts` | Create post |
| GET | `/posts/{id}` | Show post |
| PUT | `/posts/{id}` | Update post |
| DELETE | `/posts/{id}` | Delete post |
| GET | `/posts/{id}/comments` | List comments |
| POST | `/posts/{id}/comments` | Create comment |
| POST | `/comments/{id}/replies` | Reply to comment |
| PUT | `/comments/{id}` | Update comment |
| DELETE | `/comments/{id}` | Delete comment |
| POST | `/likes/toggle` | Toggle like |
| GET | `/posts/{id}/likes` | Post likers |
| GET | `/comments/{id}/likes` | Comment likers |
