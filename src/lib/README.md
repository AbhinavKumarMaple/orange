# src/lib

Utility and data-fetching helpers.

| File / Export          | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `utils.ts` → `cn`      | Merges Tailwind classes via clsx                            |
| `colors.ts` → `colors` | Brand color constants (blue, dark, light, background)       |
| `motion.ts`            | Animation presets, easings, durations, `createTransition()` |
| `posthog.ts`           | PostHog initialization and singleton export                 |
| `posthogServer.ts`     | Server-side PostHog HogQL query helper                      |
| `queries.ts`           | Server-side DB query functions (see below)                  |

## queries.ts

| Function                   | Description                                     |
| -------------------------- | ----------------------------------------------- |
| --------------             |
| `getProjects()`            | Fetch all projects ordered by `order`           |
| `getProject(slug)`         | Fetch a single project by slug                  |
| `getArticles()`            | Fetch all articles ordered by `order`           |
| `getArticle(slug)`         | Fetch a single article by slug                  |
| `getRelatedArticles(slug)` | Fetch up to 2 articles excluding the given slug |
| `getTestimonials()`        | Fetch all testimonials ordered by `order`       |
| `getFaqs()`                | Fetch all FAQs ordered by `order`               |
| `getServices()`            | Fetch all services ordered by `order`           |
| `getPricingPlans()`        | Fetch all pricing plans ordered by `order`      |
