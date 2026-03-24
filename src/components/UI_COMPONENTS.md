# UI Components

## shadcn/ui

| Component | Key Props               | Description      |
| --------- | ----------------------- | ---------------- |
| Button    | variant, size, disabled | Triggers actions |

## Custom

| Component            | Key Props                                                                       | Description                                                                |
| -------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| IntroOverlay         | —                                                                               | Full-screen intro overlay with text reveal and slide-up dismiss            |
| HeroSection          | —                                                                               | Viewport-height hero with giant title, stats, CTA, and nav toggle          |
| Navbar               | onMenuToggle, isMenuOpen                                                        | Top bar with logo and hamburger/close toggle                               |
| NavOverlay           | isOpen                                                                          | Full-screen nav dropdown with staggered link reveals                       |
| StarRating           | —                                                                               | Row of 5 small SVG stars (12x12)                                           |
| ShowreelSection      | —                                                                               | Section 2 wrapper: logo marquee + showreel heading + video                 |
| LogoMarquee          | —                                                                               | Auto-scrolling ticker of client logos with border separators               |
| ShowreelContent      | —                                                                               | "SEE OUR WORK IN MOTION" heading, description, and autoplay video          |
| PortfolioSection     | —                                                                               | Section 3: "Selected Work" heading + 2-col project grid                    |
| PortfolioGrid        | —                                                                               | 2×2 grid of portfolio cards with image, name, category, year               |
| ServicesSection      | —                                                                               | Section 4: dark bg, giant heading + numbered service rows                  |
| ServiceRows          | services                                                                        | Client-side service rows with floating hover image that follows cursor     |
| WhyUsSection         | —                                                                               | Section 5: stats grid (150+, 3.2x, 97%, 24hr) + client logo cards          |
| ClientResultsSection | —                                                                               | Section 6: scroll-driven sticky section with floating testimonial cards    |
| PricingSection       | —                                                                               | Section 7: pricing toggle (project/monthly) with 3 plan cards              |
| SectionLayout        | label, heading, description, bg, textColor, headerRight, headingStyle, headerMb | Shared section wrapper: label + h2 + description header row                |
| PricingSection       | —                                                                               | Section 7: pricing toggle (project/monthly) with 3 plan cards              |
| BlogSection          | —                                                                               | Section 8: 2-col blog cards with cover image, title, category, date        |
| FaqSection           | —                                                                               | Section 10: accordion FAQ with +/× toggle, heading left, items right       |
| ContactSection       | —                                                                               | Contact section: blue bg, heading left, form card right                    |
| Footer               | —                                                                               | Footer: newsletter, nav links, giant Nori Studio text, bottom bar          |
| PostHogProvider      | children                                                                        | Initializes PostHog and tracks page views on route changes                 |
| AnalyticsTracker     | —                                                                               | Activates all custom analytics hooks (scroll, section, hover, text, click) |
