export interface Article {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  content: Section[];
}

export interface Section {
  heading: string;
  body: string;
}

export const articles: Article[] = [
  {
    slug: "psychology-of-high-converting-landing-pages",
    title: "Psychology of High-Converting Landing Pages",
    category: "Website design",
    date: "Jun 17, 2025",
    excerpt:
      "Want to boost conversions? Here's how behavioral science can help your landing pages succeed.",
    image:
      "https://framerusercontent.com/images/S2QOyOk4A16i6x2jsTudO4LAKA.png",
    content: [
      {
        heading: "The Power of First Impressions",
        body: "Users form opinions about your website within 50 milliseconds of viewing it. Your landing page design, headline clarity, and overall visual hierarchy determine whether visitors stay or immediately leave. Professional design signals credibility and competence.",
      },
      {
        heading: "Cognitive Load Theory",
        body: "The human brain can only process limited information simultaneously. Landing pages with too many choices, complex navigation, or cluttered layouts overwhelm visitors and reduce conversions. Simplicity always wins over complexity.",
      },
      {
        heading: "Social Proof Influence",
        body: "People look to others' behavior when making decisions, especially in uncertain situations. Customer testimonials, review scores, client logos, and usage statistics provide social validation that reduces purchase anxiety and increases trust.",
      },
      {
        heading: "Color Psychology in Conversions",
        body: "Colors evoke emotional responses that influence behavior. Red creates urgency and excitement, blue builds trust and reliability, green suggests growth and positivity. Your button colors should align with desired user emotions and actions.",
      },
      {
        heading: "The Scarcity Principle",
        body: "Limited availability triggers loss aversion — one of the most powerful psychological motivators. Time-limited offers, low stock indicators, and exclusive access messaging create urgency that compels visitors to act before the opportunity disappears.",
      },
      {
        heading: "Clear Value Proposition",
        body: "Visitors need to understand within seconds what you offer, who it's for, and why it matters. A sharp headline paired with a concise subheading eliminates confusion and keeps users engaged long enough to convert.",
      },
    ],
  },
  {
    slug: "5-signs-your-brand-identity-needs-a-refresh",
    title: "5 Signs Your Brand Identity Needs a Refresh",
    category: "Brand identity",
    date: "May 16, 2025",
    excerpt:
      "Is your brand still resonating with your audience? Here are five clear signals it's time for a visual refresh.",
    image:
      "https://framerusercontent.com/images/kf0L3mld1QAbDZWfDp3yi4LfwV8.png",
    content: [
      {
        heading: "Your Logo Looks Dated",
        body: "Design trends evolve, and a logo that felt modern five years ago can now signal stagnation. If your mark uses gradients, drop shadows, or overly complex illustrations, it may be time to simplify and modernize.",
      },
      {
        heading: "Your Visuals Are Inconsistent",
        body: "If your website, social media, and printed materials all look like they belong to different companies, you have a brand consistency problem. A cohesive identity system builds recognition and trust across every touchpoint.",
      },
      {
        heading: "You've Outgrown Your Original Positioning",
        body: "Brands evolve as businesses grow. If you've expanded your services, moved upmarket, or shifted your target audience, your visual identity should reflect that evolution — not anchor you to who you used to be.",
      },
      {
        heading: "Competitors Look More Professional",
        body: "Perception is reality in business. If prospects consistently choose competitors with stronger visual identities, your brand may be costing you deals before a single conversation happens.",
      },
      {
        heading: "Your Team Isn't Proud to Share It",
        body: "Internal buy-in matters. When your team hesitates to share the website or hands out business cards apologetically, that's a signal your brand no longer reflects the quality of work you actually deliver.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
