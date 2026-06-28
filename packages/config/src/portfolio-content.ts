/**
 * Portfolio content sourced from project PRDs (Documents 1–3, 12–15, 29).
 * Single source of truth for district UI and AI canned responses.
 * Contact URLs omitted until provided — PRD 29 launch checklist.
 */

export interface PortfolioProject {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly tech: readonly string[];
  readonly highlights: readonly string[];
}

export interface ClientProject {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly tech: readonly string[];
  readonly features: readonly string[];
}

export interface SkillEntry {
  readonly id: string;
  readonly name: string;
  readonly metaphor: string;
  readonly description: string;
}

export interface CareerMilestone {
  readonly id: string;
  readonly title: string;
  readonly context: string;
  readonly technologies: readonly string[];
}

export interface AiResponseRule {
  readonly keywords: readonly string[];
  readonly response: string;
  readonly navigateToDistrict?: string;
}

export const PORTFOLIO_IDENTITY = {
  name: "Mohamed Jaasim",
  tagline: "Enter the Mind of Mohamed Jaasim",
  subtitle: "Every scroll reveals a thought.",
  roles: [
    "Builder",
    "Engineer",
    "Problem Solver",
    "Creative Technologist",
    "AI Explorer",
    "Product Thinker",
    "Performance Optimizer",
    "Storyteller",
  ] as const,
  about: [
    "SYNAPSE is an abstract representation of how a builder thinks — not just a list of projects, but a journey through curiosity, craft, and creation.",
    "Mohamed enjoys making difficult things feel effortless. He thinks in systems, explains through stories, and cares deeply about performance, clarity, and products that feel intelligent rather than just functional.",
    "When not building, you'll probably find him coding, at the gym, playing League of Legends, or following football.",
  ] as const,
  interests: [
    "League of Legends",
    "Football",
    "Gym",
    "Gaming",
    "Learning",
    "Productivity",
  ] as const,
} as const;

export const PERSONAL_PROJECTS: readonly PortfolioProject[] = [
  {
    id: "synapse",
    name: "PROJECT SYNAPSE",
    tagline: "This portfolio — engineering meets storytelling",
    description:
      "An award-level interactive portfolio combining React, Three.js, GSAP scroll cinematography, and an AI twin. The universe you are exploring right now.",
    tech: ["Next.js", "React", "Three.js", "GSAP", "TypeScript", "Zustand"],
    highlights: [
      "Scroll-driven narrative navigation",
      "Data-driven district architecture",
      "Digital Jaasim AI guide",
    ],
  },
  {
    id: "football-dashboard",
    name: "Football Dashboard",
    tagline: "Data, motion, and match-day clarity",
    description:
      "A personal project exploring sports data visualization — turning match statistics into intuitive, animated dashboards.",
    tech: ["React", "TypeScript", "Data Visualization"],
    highlights: ["Live-style data presentation", "Motion-driven UI", "Sports analytics focus"],
  },
  {
    id: "storybooks",
    name: "StoryBooks",
    tagline: "Stories as interactive experiences",
    description:
      "A creative project blending narrative and interface design — experimenting with how stories can be told through interaction rather than static pages.",
    tech: ["React", "TypeScript", "Animation"],
    highlights: ["Narrative-first UX", "Interactive storytelling", "Creative experimentation"],
  },
];

export const CLIENT_PROJECTS: readonly ClientProject[] = [
  {
    id: "fuze",
    name: "Fuze",
    tagline: "Floating futuristic fitness city",
    description:
      "Production React Native fitness platform — workout stations, AI coaching, wearables integration, analytics, and subscription systems in a premium mobile experience.",
    tech: ["React Native", "Expo", "Mixpanel", "AI Coach", "OTA Deployment"],
    features: [
      "Workout stations and energy paths",
      "AI coaching interactions",
      "Subscription constellations",
      "OTA deployment pipeline",
    ],
  },
  {
    id: "filozo",
    name: "Filozo",
    tagline: "Crystalline financial precision",
    description:
      "Elegant financial world where tax documents become floating geometry, secure vaults protect data, and GST flows visualize as streams of light.",
    tech: ["React Native", "TypeScript", "Secure Data", "Financial UX"],
    features: [
      "Tax document visualization",
      "Secure vault architecture",
      "GST flow analytics",
      "Precision-driven UI",
    ],
  },
  {
    id: "borderless",
    name: "Borderless Creatives",
    tagline: "Design atelier in space",
    description:
      "Floating design studio — typography in space, color systems orbiting, responsive layouts assembling live, Figma nodes becoming architecture.",
    tech: ["Design Systems", "Figma", "Responsive Layout", "Typography"],
    features: [
      "Live layout assembly",
      "Color system orbits",
      "Glass drafting tables",
      "Figma-to-architecture metaphor",
    ],
  },
];

export const SKILLS: readonly SkillEntry[] = [
  {
    id: "react-native",
    name: "React Native",
    metaphor: "Production mobile craft",
    description:
      "I've spent a lot of time building production React Native apps, especially in the fitness space. Making complex interactions feel simple is what I enjoy most.",
  },
  {
    id: "react",
    name: "React",
    metaphor: "Large interconnected tree",
    description:
      "The ecosystem I return to for expressive, component-driven interfaces at every scale.",
  },
  {
    id: "typescript",
    name: "TypeScript",
    metaphor: "Crystal branches",
    description: "Strict types as architecture — clarity before cleverness.",
  },
  {
    id: "nextjs",
    name: "Next.js",
    metaphor: "Architectural foundation",
    description: "App Router, server boundaries, and production-grade web delivery.",
  },
  {
    id: "threejs",
    name: "Three.js",
    metaphor: "Spatial thinking",
    description: "GPU-driven worlds, shaders, and cinematic real-time graphics.",
  },
  {
    id: "ai",
    name: "AI",
    metaphor: "Bioluminescent ecosystem",
    description:
      "I've been moving more into AI recently because I enjoy building products that feel intelligent rather than just functional.",
  },
  {
    id: "nodejs",
    name: "Node.js",
    metaphor: "Energy roots",
    description: "Backend services, automation pipelines, and system glue.",
  },
  {
    id: "performance",
    name: "Performance",
    metaphor: "Self-optimizing core",
    description:
      "One of the most satisfying moments is watching FPS stabilize after tracking down unnecessary re-renders.",
  },
];

export const ENGINEERING_PHILOSOPHY = [
  {
    id: "systems",
    title: "Systems First",
    description: "Every feature should emerge from a reusable system — not a one-off shortcut.",
  },
  {
    id: "performance",
    title: "Performance Is Product",
    description: "Assume every frame matters. Optimize after correctness, never before.",
  },
  {
    id: "clarity",
    title: "Clarity Over Cleverness",
    description: "Readable architecture scales; clever hacks don't.",
  },
  {
    id: "intelligence",
    title: "Intelligent, Not Decorative",
    description: "AI and automation should feel purposeful — products that think, not gimmicks.",
  },
] as const;

export const CAREER_MILESTONES: readonly CareerMilestone[] = [
  {
    id: "mobile-fitness",
    title: "Production Mobile — Fitness",
    context:
      "Building and shipping React Native apps in the fitness space with AI coaching and analytics.",
    technologies: ["React Native", "Expo", "Mixpanel"],
  },
  {
    id: "client-ecosystems",
    title: "Client World Building",
    context: "Fuze, Filozo, and Borderless Creatives — each client as its own premium ecosystem.",
    technologies: ["React Native", "TypeScript", "Design Systems"],
  },
  {
    id: "synapse-engine",
    title: "SYNAPSE Engine",
    context:
      "Architecting a reusable cinematic portfolio engine — districts, narrative, AI, and 3D as one system.",
    technologies: ["Next.js", "Three.js", "GSAP", "AI"],
  },
];

export const AI_ASSISTANT = {
  name: "Digital Jaasim",
  greeting:
    "Hey. Thanks for making it this far. I'm basically Jaasim… just available 24/7. Ask me anything about projects, engineering, or this universe.",
  suggestions: [
    "Show me your best project",
    "Tell me about Fuze",
    "What's your engineering philosophy?",
    "What tech do you use most?",
    "Are you always online?",
  ] as const,
  responses: [
    {
      keywords: ["project", "best", "favorite", "portfolio", "synapse"],
      response:
        "Favorite project is probably this portfolio — it combines engineering, storytelling, 3D graphics, AI, and interaction design into one living universe.",
      navigateToDistrict: "project-galaxy",
    },
    {
      keywords: ["fuze", "fitness", "mobile"],
      response:
        "I've spent a lot of time building production React Native apps, especially in the fitness space. Fuze is a floating futuristic fitness city — AI coaching, wearables, analytics, the whole ecosystem.",
      navigateToDistrict: "client-worlds",
    },
    {
      keywords: ["filozo", "finance", "gst", "tax"],
      response:
        "Filozo is an elegant crystalline financial world — tax documents as floating geometry, secure vaults, and GST flows visualized as streams of light.",
      navigateToDistrict: "client-worlds",
    },
    {
      keywords: ["borderless", "design", "figma"],
      response:
        "Borderless Creatives is a floating design atelier — typography in space, color systems orbiting, and Figma nodes becoming architecture.",
      navigateToDistrict: "client-worlds",
    },
    {
      keywords: ["skill", "tech", "stack", "typescript", "react"],
      response:
        "I enjoy figuring out how different pieces fit together. React Native, TypeScript, Next.js, Three.js, and AI are the tools I reach for most.",
      navigateToDistrict: "engineering-core",
    },
    {
      keywords: ["philosophy", "engineer", "think", "architecture"],
      response:
        "I think in systems first. Performance is a product feature. And I'd rather build something maintainable for years than something clever for a demo.",
      navigateToDistrict: "engineering-core",
    },
    {
      keywords: ["about", "yourself", "who", "jaasim", "bio"],
      response:
        "I'm a builder who enjoys making difficult things feel effortless. This universe is how I think — curiosity, craft, and care for invisible details.",
      navigateToDistrict: "knowledge-forest",
    },
    {
      keywords: ["online", "sleep", "always"],
      response:
        "The digital version of me is. The real one is probably coding, at the gym, or losing LP in League.",
    },
    {
      keywords: ["tab", "space"],
      response: "Tabs start arguments. Spaces end them. I'll let you guess which side I picked.",
    },
    {
      keywords: ["league", "lol", "game"],
      response:
        "League of Legends is a guilty pleasure. The real one is probably losing LP right now.",
    },
    {
      keywords: ["football", "soccer"],
      response:
        "Football fan — and I built a Football Dashboard project to explore sports data visualization.",
      navigateToDistrict: "project-galaxy",
    },
    {
      keywords: ["hire", "recruiter", "job", "relocate"],
      response:
        "I'm looking for roles where I can build products that feel intelligent and polished — mobile, web, or full-stack with a strong eye for experience quality.",
    },
    {
      keywords: ["contact", "reach", "email", "connect"],
      response:
        "Scroll to the Memory Stream at the end of the journey — that's where the contact constellation lives.",
      navigateToDistrict: "memory-stream",
    },
  ] as const satisfies readonly AiResponseRule[],
} as const;

export const CONTACT = {
  headline: "Let's connect",
  description:
    "You've travelled through the universe. If something here resonated, reach out — I'm always interested in thoughtful projects and good conversations.",
  methods: [
    { id: "github", label: "GitHub", description: "Code and open-source work" },
    { id: "linkedin", label: "LinkedIn", description: "Professional background" },
    { id: "email", label: "Email", description: "Direct conversation" },
  ] as const,
  endingCopy:
    "The universe has no true ending. One particle remains — and the journey begins again.",
  note: "Contact links will be verified at launch (PRD 29 checklist).",
} as const;

export const MEMORY_FRAGMENTS = [
  "First production app shipped",
  "Learning Three.js changed how I see interfaces",
  "Performance wins that felt invisible until they weren't",
  "Building AI that feels authentic, not performative",
  "Football dashboards at 2am",
  "League LP lost, lessons gained",
] as const;
