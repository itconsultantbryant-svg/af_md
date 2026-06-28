import {
  Bot,
  Compass,
  HeartPulse,
  BarChart3,
  GraduationCap,
  Cloud,
} from "lucide-react";

export const serviceDetails = [
  {
    icon: Bot,
    title: "AI Development & Integration",
    description:
      "We build custom AI-powered applications tailored to your organization's unique needs. From intelligent chatbots and virtual assistants to workflow automation and predictive analytics, our development team delivers production-ready solutions that integrate seamlessly with your existing systems.",
    deliverables: [
      "Custom AI application development",
      "Chatbot and conversational AI",
      "Workflow automation systems",
      "API integration and deployment",
      "Ongoing maintenance and support",
    ],
    audiences: ["Startups", "SMEs", "Enterprise", "NGOs"],
    pricing: "Starting from $2,000",
  },
  {
    icon: Compass,
    title: "AI Strategy Consulting",
    description:
      "Navigate your AI adoption journey with confidence. Our consultants assess your organization's AI readiness, develop strategic roadmaps, and guide vendor selection to ensure your investments deliver measurable returns.",
    deliverables: [
      "AI readiness assessment",
      "Strategic roadmap development",
      "Vendor evaluation and selection",
      "ROI analysis and business case",
      "Change management planning",
    ],
    audiences: ["Government", "Banks", "Enterprise", "NGOs"],
    pricing: "Starting from $500",
  },
  {
    icon: HeartPulse,
    title: "Healthcare & Government AI",
    description:
      "Specialized AI solutions for public sector and healthcare institutions. We understand the unique compliance, security, and operational requirements of government and health organizations across Africa.",
    deliverables: [
      "Health information systems",
      "Citizen service platforms",
      "Data collection and reporting tools",
      "Compliance-ready AI solutions",
      "Staff training and handover",
    ],
    audiences: ["Government", "Healthcare", "NGOs"],
    pricing: "Starting from $5,000",
  },
  {
    icon: BarChart3,
    title: "Data Analytics & Insights",
    description:
      "Transform your raw data into actionable intelligence. Our analytics solutions combine AI-powered processing with intuitive dashboards that empower decision-makers at every level of your organization.",
    deliverables: [
      "Custom analytics dashboards",
      "Predictive modeling",
      "Automated reporting systems",
      "Data pipeline development",
      "Business intelligence consulting",
    ],
    audiences: ["Banks", "Enterprise", "Government", "NGOs"],
    pricing: "Starting from $1,500",
  },
  {
    icon: GraduationCap,
    title: "AI Training & Workshops",
    description:
      "Build AI literacy across your organization with our comprehensive training programs. From executive briefings to technical bootcamps, we equip your team with the knowledge and skills to leverage AI effectively.",
    deliverables: [
      "Executive AI briefings",
      "Technical bootcamps",
      "Custom curriculum development",
      "On-site and remote delivery",
      "Post-training support",
    ],
    audiences: ["Enterprise", "Government", "NGOs", "Education"],
    pricing: "Starting from $150",
  },
  {
    icon: Cloud,
    title: "SaaS AI Products",
    description:
      "Purpose-built AI software products designed for African market verticals. Our subscription-based solutions deliver enterprise-grade AI capabilities at accessible price points for businesses across the continent.",
    deliverables: [
      "Subscription AI platforms",
      "Vertical-specific solutions",
      "Multi-tenant architecture",
      "Regular feature updates",
      "Dedicated support channels",
    ],
    audiences: ["SMEs", "Startups", "NGOs"],
    pricing: "From $29/month",
  },
];

export const processSteps = [
  {
    num: 1,
    title: "Discovery",
    description: "Understand your goals, challenges, and context",
  },
  {
    num: 2,
    title: "Requirements",
    description: "Define scope, specifications, and success metrics",
  },
  {
    num: 3,
    title: "Proposal",
    description: "Present solution design, timeline, and investment",
  },
  {
    num: 4,
    title: "Build",
    description: "Develop, test, and iterate on your AI solution",
  },
  {
    num: 5,
    title: "Delivery",
    description: "Deploy, train your team, and go live",
  },
  {
    num: 6,
    title: "Retainer Support",
    description: "Ongoing optimization, updates, and partnership",
  },
];

export const pricingTiers = [
  {
    name: "Starter",
    price: "$500",
    period: "per project",
    description: "For small projects and consultations",
    features: [
      "AI readiness assessment",
      "Strategy consultation (2 hours)",
      "Basic chatbot setup",
      "Email support",
      "1 revision round",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$2,500",
    period: "per project",
    description: "For growing organizations",
    features: [
      "Full AI solution development",
      "Custom integrations",
      "Training for up to 10 staff",
      "Priority support",
      "3 revision rounds",
      "30-day post-launch support",
    ],
    cta: "Most Popular",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "engagement",
    description: "For large-scale deployments",
    features: [
      "End-to-end AI transformation",
      "Dedicated project team",
      "Unlimited training sessions",
      "24/7 priority support",
      "SLA guarantees",
      "Ongoing retainer partnership",
    ],
    cta: "Contact Us",
    popular: false,
  },
];
