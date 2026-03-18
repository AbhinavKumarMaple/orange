import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding database...");

  // Projects
  await db.delete(schema.projects);
  await db.insert(schema.projects).values([
    {
      slug: "baseline-sports",
      name: "Baseline Sports",
      category: "Web Design & Development",
      year: "2025",
      industry: "Sports & Fitness",
      timeline: "7 weeks",
      description:
        "Baseline Sports needed a refreshed brand identity that would better reflect their focus on performance and attract serious athletes.",
      problem:
        "The old identity felt outdated and generic. It failed to highlight their expertise in sports science, struggled to inspire trust, and left them overshadowed by modern competitors. Visuals lacked consistency and marketing materials did not connect with their audience.",
      solution:
        "We created a bold new identity centered on performance and precision. A modern logo, fresh typography, and a cohesive color palette gave the brand clarity and strength across every touchpoint.",
      heroImage:
        "https://framerusercontent.com/images/kf0L3mld1QAbDZWfDp3yi4LfwV8.png",
      images: [
        "https://framerusercontent.com/images/kf0L3mld1QAbDZWfDp3yi4LfwV8.png",
        "https://framerusercontent.com/images/kf0L3mld1QAbDZWfDp3yi4LfwV8.png",
      ],
      icon: "https://framerusercontent.com/images/2rq9YMILXCGw0qOqXvxaPhzIuWo.svg",
      order: 1,
    },
    {
      slug: "urban-bites",
      name: "Urban Bites",
      category: "UI/UX Design",
      year: "2024",
      industry: "Food & Beverage",
      timeline: "5 weeks",
      description:
        "Urban Bites needed a digital ordering experience that felt effortless and matched their vibrant brand personality.",
      problem:
        "Their existing ordering flow was clunky and confusing. Customers dropped off before completing orders, and the interface failed to reflect the energy of the brand.",
      solution:
        "We redesigned the full ordering flow with a focus on clarity and speed. Bold visuals, intuitive navigation, and a streamlined checkout turned browsers into buyers.",
      heroImage:
        "https://framerusercontent.com/images/Vzqe1Y7Hjtxberq3o9cKXZ514.png",
      images: [
        "https://framerusercontent.com/images/Vzqe1Y7Hjtxberq3o9cKXZ514.png",
        "https://framerusercontent.com/images/Vzqe1Y7Hjtxberq3o9cKXZ514.png",
      ],
      icon: "https://framerusercontent.com/images/9XfpXOcQrpiKYnZNcFlnYhYZVI.svg",
      order: 2,
    },
    {
      slug: "northcap-supply",
      name: "Northcap Supply",
      category: "Brand Identity",
      year: "2024",
      industry: "Fashion & Streetwear",
      timeline: "6 weeks",
      description:
        "Northcap Supply needed a brand identity that captured their clean, minimal streetwear aesthetic and helped them break through a crowded market.",
      problem:
        "The brand lacked a cohesive visual language. Their logo felt generic, and without a strong identity system, they struggled to stand out on social media and in retail.",
      solution:
        "We built a complete brand ecosystem — logo, typography, color system, and packaging guidelines — rooted in minimal precision and urban edge.",
      heroImage:
        "https://framerusercontent.com/images/FZLSLkf4KypXwztwnGP7AfQOpo.png",
      images: [
        "https://framerusercontent.com/images/FZLSLkf4KypXwztwnGP7AfQOpo.png",
        "https://framerusercontent.com/images/FZLSLkf4KypXwztwnGP7AfQOpo.png",
      ],
      icon: "https://framerusercontent.com/images/rHPu3YfQxZrz1Xw15tIQTPQIsU.svg",
      order: 3,
    },
    {
      slug: "velo-studio",
      name: "Velo Studio",
      category: "Web Design & Development",
      year: "2023",
      industry: "Creative Agency",
      timeline: "8 weeks",
      description:
        "Velo Studio needed a website that matched their creative energy — smooth, dynamic, and built to attract exciting new collaborations.",
      problem:
        "Their old site was static and uninspiring. It didn't communicate the studio's capabilities or personality, and failed to convert visitors into clients.",
      solution:
        "We designed and built a fully custom website with fluid animations, a bold layout system, and a portfolio showcase that puts their work front and center.",
      heroImage:
        "https://framerusercontent.com/images/RAVhlibsB1Uz6MJmEED2G3SQc.png",
      images: [
        "https://framerusercontent.com/images/RAVhlibsB1Uz6MJmEED2G3SQc.png",
        "https://framerusercontent.com/images/RAVhlibsB1Uz6MJmEED2G3SQc.png",
      ],
      icon: "https://framerusercontent.com/images/Ntc48i8GxNtzZe6K8P7DeRLzQ.svg",
      order: 4,
    },
  ]);

  // Articles
  await db.delete(schema.articles);
  await db.insert(schema.articles).values([
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
      order: 1,
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
      order: 2,
    },
  ]);

  // Testimonials
  await db.delete(schema.testimonials);
  await db.insert(schema.testimonials).values([
    {
      company: "Urban bites",
      quote:
        "Our digital ordering system finally feels effortless. Customers find it easy to navigate, and we've seen orders skyrocket since launch.",
      avatar:
        "https://framerusercontent.com/images/PvGkgeiMfJS3ppQqn74U9dVhHg.png",
      name: "Isabella Rodriguez",
      role: "Founder of Urban Bites",
      xPercent: "28%",
      order: 1,
    },
    {
      company: "Baseline Sports",
      quote:
        "The new brand identity gave us the confidence to stand out. Athletes now recognize us instantly, and engagement from our community grew stronger than ever.",
      avatar:
        "https://framerusercontent.com/images/PvGkgeiMfJS3ppQqn74U9dVhHg.png",
      name: "Derek Thompson",
      role: "Founder of Baseline sports",
      xPercent: "55%",
      order: 2,
    },
    {
      company: "Northcap Supply",
      quote:
        "The rebrand captured exactly what we stand for. Clean, minimal, and bold, it gave our streetwear label the edge we needed to break through.",
      avatar:
        "https://framerusercontent.com/images/PvGkgeiMfJS3ppQqn74U9dVhHg.png",
      name: "Sarah Kim",
      role: "Founder of Northcap Supply",
      xPercent: "15%",
      order: 3,
    },
    {
      company: "Velo Studio",
      quote:
        "The new website completely reflects our creative energy. It's smooth, dynamic, and has opened the door to exciting new collaborations",
      avatar:
        "https://framerusercontent.com/images/PvGkgeiMfJS3ppQqn74U9dVhHg.png",
      name: "Marcus Chen",
      role: "Director of Velo Studio",
      xPercent: "42%",
      order: 4,
    },
  ]);

  // FAQs
  await db.delete(schema.faqs);
  await db.insert(schema.faqs).values([
    {
      question: "How long does a typical project take?",
      answer:
        "Project timelines vary based on scope. Brand identity projects typically take 4-6 weeks, website projects 6-10 weeks, and comprehensive packages 8-12 weeks. Every timeline is confirmed during onboarding.",
      order: 1,
    },
    {
      question: "What does your process look like?",
      answer:
        "We follow a 4-phase process: Discovery (understanding your brand and goals), Strategy (defining direction and approach), Design (creating and refining visuals), and Delivery (final files, handoff, and launch support).",
      order: 2,
    },
    {
      question: "What's included in ongoing support?",
      answer:
        "All plans include post-launch support for bug fixes and minor adjustments. The Professional and Premium plans include extended support periods and dedicated account management.",
      order: 3,
    },
    {
      question: "How much should I budget for a project?",
      answer:
        "Our Essential Plan starts at $3,499 for startups and small businesses. Growing businesses typically invest $6,499+ for comprehensive brand and web work. We're transparent about pricing — no hidden fees.",
      order: 4,
    },
    {
      question: "What if I'm not happy with initial concepts?",
      answer:
        "We include revision rounds in every plan. If initial concepts miss the mark, we go back to the drawing board. Our goal is work you're genuinely proud of, not just work that's technically complete.",
      order: 5,
    },
    {
      question: "Do you offer payment plans?",
      answer:
        "Yes. We typically structure payments as 50% upfront and 50% on delivery. For larger projects, we can arrange milestone-based payment schedules. Reach out to discuss what works for you.",
      order: 6,
    },
  ]);

  // Services
  await db.delete(schema.services);
  await db.insert(schema.services).values([
    {
      number: "001",
      name: "Branding",
      description:
        "Visual systems that make your business unforgettable and differentiate you from competitors.",
      order: 1,
    },
    {
      number: "002",
      name: "Web design",
      description:
        "Custom websites that look stunning, perform flawlessly, and convert visitors into customers.",
      order: 2,
    },
    {
      number: "003",
      name: "UX/UI Design",
      description:
        "Strategic UX/UI design that turns confused visitors into converting loyal customers.",
      order: 3,
    },
    {
      number: "004",
      name: "Digital marketing",
      description:
        "Data-driven campaigns that grow your audience and turn clicks into measurable revenue.",
      order: 4,
    },
  ]);

  // Pricing
  await db.delete(schema.pricingPlans);
  await db.insert(schema.pricingPlans).values([
    {
      name: "Essential Plan",
      subtitle: "For Startups, new businesses, single location companies",
      priceProject: 3499,
      priceMonthly: 999,
      features: [
        "Brand identity design",
        "Basic website (5 pages)",
        "Social media templates",
        "Monthly strategy session",
        "Project kickoff workshop",
        "2 revision rounds per month",
      ],
      delivery: "3-4 weeks",
      isFeatured: false,
      order: 1,
    },
    {
      name: "Professional Plan",
      subtitle: "Best for growing businesses ready to scale",
      priceProject: 6499,
      priceMonthly: 1999,
      features: [
        "Advanced brand identity system",
        "Custom website (up to 10 pages)",
        "Digital marketing strategy",
        "Monthly strategy session",
        "Unlimited revisions",
        "SEO optimization",
      ],
      delivery: "6-8 weeks",
      isFeatured: true,
      order: 2,
    },
    {
      name: "Premium Plan",
      subtitle: "For companies serious about market leadership",
      priceProject: 11999,
      priceMonthly: 3999,
      features: [
        "Complete brand ecosystem",
        "Enterprise web platform",
        "Comprehensive marketing system",
        "12 months partnership support",
        "Dedicated account manager",
        "Quarterly strategy reviews",
      ],
      delivery: "8-12 weeks",
      isFeatured: false,
      order: 3,
    },
  ]);

  console.log("✅ Seed complete");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
