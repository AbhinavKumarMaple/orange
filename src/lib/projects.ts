export interface Project {
  slug: string;
  name: string;
  category: string;
  year: string;
  industry: string;
  timeline: string;
  description: string;
  problem: string;
  solution: string;
  heroImage: string;
  images: string[];
  icon: string;
}

export const projects: Project[] = [
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
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
