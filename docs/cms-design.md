# CMS Design — Nori Studio

## Overview

Content is stored in Neon (Postgres) and fetched server-side via Drizzle ORM.
No external CMS dependency — the DB is the source of truth.

## Content Types & Tables

### `projects`

| Column      | Type        | Notes                           |
| ----------- | ----------- | ------------------------------- |
| id          | serial PK   |                                 |
| slug        | text unique | URL identifier                  |
| name        | text        | Display name                    |
| category    | text        | e.g. "Web Design & Development" |
| year        | text        | e.g. "2025"                     |
| industry    | text        | e.g. "Sports & Fitness"         |
| timeline    | text        | e.g. "7 weeks"                  |
| description | text        | Short hero description          |
| problem     | text        | Problem section body            |
| solution    | text        | Solution section body           |
| hero_image  | text        | URL                             |
| images      | text[]      | Array of image URLs             |
| icon        | text        | Logo SVG URL                    |
| order       | int         | Display order                   |
| created_at  | timestamp   |                                 |

### `articles`

| Column     | Type        | Notes                        |
| ---------- | ----------- | ---------------------------- |
| id         | serial PK   |                              |
| slug       | text unique | URL identifier               |
| title      | text        |                              |
| category   | text        | e.g. "Website design"        |
| date       | text        | e.g. "Jun 17, 2025"          |
| excerpt    | text        | Short description            |
| image      | text        | Hero image URL               |
| content    | jsonb       | Array of `{ heading, body }` |
| order      | int         | Display order                |
| created_at | timestamp   |                              |

### `testimonials`

| Column    | Type      | Notes                                 |
| --------- | --------- | ------------------------------------- |
| id        | serial PK |                                       |
| company   | text      |                                       |
| quote     | text      |                                       |
| avatar    | text      | Image URL                             |
| name      | text      | Person name                           |
| role      | text      | e.g. "Founder of Urban Bites"         |
| x_percent | text      | Horizontal position for floating card |
| order     | int       |                                       |

### `faqs`

| Column   | Type      | Notes |
| -------- | --------- | ----- |
| id       | serial PK |       |
| question | text      |       |
| answer   | text      |       |
| order    | int       |       |

### `services`

| Column      | Type      | Notes           |
| ----------- | --------- | --------------- |
| id          | serial PK |                 |
| number      | text      | e.g. "001"      |
| name        | text      | e.g. "Branding" |
| description | text      |                 |
| order       | int       |                 |

### `pricing_plans`

| Column        | Type      | Notes                 |
| ------------- | --------- | --------------------- |
| id            | serial PK |                       |
| name          | text      | e.g. "Essential Plan" |
| subtitle      | text      |                       |
| price_monthly | int       | cents                 |
| price_project | int       | cents                 |
| features      | text[]    |                       |
| delivery      | text      | e.g. "3-4 weeks"      |
| is_featured   | boolean   | "Most chosen" badge   |
| order         | int       |                       |

## Data Flow

```
Neon DB → Drizzle ORM → Server Component → Client Component (props)
```

- All DB reads happen in Server Components (no `"use client"` for data fetching)
- Client components receive data as props
- No API routes needed for reads
- Contact form submissions → POST `/api/contact` → insert to a `contact_submissions` table

## File Structure

```
src/
  db/
    index.ts          # Drizzle client
    schema.ts         # All table definitions
    seed.ts           # Seed script with current hardcoded data
  lib/
    queries.ts        # All DB query functions
```
