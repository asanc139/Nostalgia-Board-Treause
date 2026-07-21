# Nostalgia Treasure Board

A Pinterest-style board where users curate their childhood nostalgia by decade, category, and specific interest — and each board automatically surfaces **real eBay listings and YouTube clips** matched to what they loved growing up. Turns memory browsing into a shopping and discovery experience.

## Live Demo

- Frontend: https://nostalgia-board-treasure-client.onrender.com
- Backend: https://nostalgia-board-treasure.onrender.com

---

## Tech Stack

### Backend

| Technology                    | Role                                                                        |
| ----------------------------- | --------------------------------------------------------------------------- |
| **Node.js + Express**         | REST API server                                                             |
| **Sequelize (ORM)**           | Models, associations, and queries against Postgres                          |
| **PostgreSQL (via Supabase)** | Production database                                                         |
| **Beekeeper Studio**          | GUI client for inspecting/querying the Postgres database during development |
| **bcrypt**                    | Password hashing                                                            |
| **jsonwebtoken (JWT)**        | Stateless auth — issued on login/signup, verified on protected routes       |
| **cors**                      | Restricts which frontend origins can call the API                           |
| **helmet**                    | Sets security-related HTTP headers                                          |
| **express-rate-limit**        | Basic abuse/request-rate protection                                         |
| **dotenv**                    | Loads environment variables (API keys, DB connection string, JWT secret)    |
| **nodemon**                   | Auto-restarts the dev server on file changes                                |

### Frontend

| Technology                    | Role                                                                    |
| ----------------------------- | ----------------------------------------------------------------------- |
| **React 19**                  | UI library                                                              |
| **Vite**                      | Dev server + build tool                                                 |
| **React Router (v7)**         | Client-side routing (`/`, `/signup`, `/feed`, `/profile`)               |
| **Tailwind CSS v4 + daisyUI** | Styling and prebuilt component classes (cards, badges, inputs, buttons) |
| **lucide-react**              | Icon set used across the feed and profile UI                            |
| **react-icons**               | Additional icons (e.g., Google "G" logo on the login button)            |
| **Font Awesome**              | Supplementary icon set                                                  |
| **ESLint**                    | Code linting                                                            |

### External APIs

| API                                             | Purpose                                                         |
| ----------------------------------------------- | --------------------------------------------------------------- |
| **YouTube Data API v3**                         | Searches for videos matching a user's saved interests           |
| **eBay Browse API (OAuth2 client-credentials)** | Searches public eBay listings matching a user's saved interests |

### Hoisting

| Service      | Role                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| **Render**   | Hosts both the Express API (Web Service) and the React app (Static Site) |
| **Supabase** | Managed Postgres database instance                                       |

---

## Core Idea

A user signs up, tells the app what decade they grew up in and what they were into (TV Shows, video games, comics, collectibles, specific franchises like "Pokemon or DuckTales"), and lands on a personalized feed. That feed isn't static content — it's live-fetched YouTube clips and eBay listings, searched in real time based on the user's stated interests. Users can save anything they find to a private collection, revisit it later, and keep refining their interests over time by adding or removing tags from their profile.

## MVP Features

### 1. User Account - Email/Password Auth

Users create an account with and email and password. On Signup:

- The password is hashed with **bycrypt** before touching the database - THE PLAINTEXT PASSWORD IS NEVER STORED!
- A new row is created in the **`Users`** table via a **sequelize model**, which maps directly to a real table in the **Supabase-hosted Postgres database**.
- That same row and every related row - interests tags, saved-items is directly visible and queryable in the **Beekepper Studio GUI**, since Beekepper connects striaght to the same Postgres instance Sequlize writes to.
  On login, the submitted password is compared against the stored hash with `bycrypt.compare()`. If it matches, the server issues a signed **JWT** containing the user's ID, which the frontend stores in `localStorage` and attaches to everysubsequent API request as an `Authorization: Bearer <token>` header. A `requireAuth` Express middleware verifies that token on every protected route, so the server knows exaclty which user is making a request without needding server-side sessions.

## **Tables involved:** `Users` (email, hashed password, decade)

### 2. Onboarding - Decade + category + Interests Tags

During signup, a three-step wizard collects:

- **Decade** (80s / 90s / 2000s) — stored directly on the `Users` row
- **Categories** (TV shows, Video games, Comics, etc.) — broad interest CAT
- **Specific interests** (free-text, e.g. "DuckTales," "Sega Genesis") — added one at a time and shown as removable tags

Both categories and specific interests are stored in a single **`interest_tags`** table, distinguished by a `type` column (`'category'` vs `'specific'`), with a foreign key back to the user who created them. This lets one table represent two related but distinct kinds of preference data, joined back together per-user at query time.

**Tables involved:** `interest_tags` (tag text, type, foreign key to `Users`) which USER the tag belongs to.

---

### 3. Unified Feed — Live eBay + YouTube Results

Once onboarded (or logged back in), the user's feed page calls a backend `/api/feed` route that:

1. Looks up the logged-in user's saved interests (and categories/decade as a fallback if no specific interests exist yet)
2. Fires parallel searches against the **YouTube Data API** and the **eBay Browse API** for each interest term
3. Normalizes both APIs' very different response shapes into one consistent card format (title, thumbnail, source badge, link)
4. Cross-references the results against the user's already-saved items, so previously-saved cards show as "Saved" immediately

The eBay side required a full OAuth2 client-credentials flow (fetching and caching an application access token) since the Browse API doesn't accept a simple API key the way YouTube's does.

**No new tables** — this feature reads from `interest_tags` and cross-checks against `saved_items`, but doesn't persist API results itself; results are fetched fresh on each feed load.

---

### 4. Save/Pin Functionality

Every card in the feed has a save (heart) button. Clicking it:

- Sends the item's source (`YouTube`/`eBay`), external ID, title, thumbnail, and link to a `POST /api/saved-items` route
- The backend uses `findOrCreate` to avoid duplicate saves of the same item
- The row is inserted into a dedicated **`saved_items`** table in Postgres, scoped to `user_id`, so each user's saved collection is completely private and isolated from every other user's

Unsaving does the reverse — a `DELETE` request scoped to both the item's identity _and_ the requesting user's ID, so a user can never accidentally (or maliciously) delete someone else's saved item.

**Tables involved:** `saved_items` (source, external ID, title, thumbnail, link, foreign key to `Users`)

---

### 5. Viewing Saved Items

The **Profile page** includes a dedicated "Saved items" section that fetches everything from `GET /api/saved-items` for the logged-in user and renders it as the same card style used in the main feed — so a user's curated collection is always one click away from their account settings, independent of whatever's currently trending in their live feed.

The Profile page also doubles as full account management: editing decade, changing password (requires current password verification), adding/removing individual interest tags without redoing the whole onboarding flow, and a guarded account-deletion flow that cascades — deleting a user automatically removes all of their `interest_tags` and `saved_items` rows too, thanks to `onDelete: 'CASCADE'` foreign key relationships defined at the Sequelize model level.
