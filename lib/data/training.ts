export type CourseAudience =
  | "students"
  | "professionals"
  | "companies"
  | "ngos"
  | "public";

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  format: "Online" | "In-Person" | "Corporate";
  price: string;
  topics: string[];
  audiences: CourseAudience[];
  image?: string;
}

export const audienceLabels: Record<CourseAudience, string> = {
  students: "Students",
  professionals: "Professionals",
  companies: "Companies",
  ngos: "NGOs",
  public: "General Public",
};

export const courses: Course[] = [
  {
    id: "ai-essentials",
    title: "AI Essentials for Business",
    description:
      "A foundational course for professionals who want to understand AI capabilities and applications in business contexts.",
    duration: "90 hours",
    level: "beginner",
    format: "Online",
    price: "$150",
    audiences: ["professionals", "companies", "public"],
    topics: [
      "What is AI and how does it work?",
      "AI use cases across industries",
      "Evaluating AI tools for your business",
      "Ethics and responsible AI",
      "Getting started with AI adoption",
    ],
  },
  {
    id: "ai-executives",
    title: "AI for Executives & Leaders",
    description:
      "Strategic AI literacy for C-suite and senior leaders making technology investment decisions.",
    duration: "105 hours",
    level: "intermediate",
    format: "Corporate",
    price: "$200",
    audiences: ["companies", "professionals"],
    topics: [
      "AI strategy and competitive advantage",
      "ROI frameworks for AI investments",
      "Building AI-ready organizations",
      "Risk management and governance",
      "Vendor evaluation and partnerships",
    ],
  },
  {
    id: "ai-bootcamp",
    title: "AI Development Bootcamp",
    description:
      "Intensive hands-on training in building AI applications with modern tools and frameworks.",
    duration: "Upcoming",
    level: "advanced",
    format: "Online",
    price: "Upcoming",
    audiences: ["students", "professionals"],
    topics: [
      "Python for AI development",
      "Machine learning fundamentals",
      "Building chatbots and agents",
      "API integration and deployment",
      "Capstone project build",
    ],
  },
  {
    id: "ai-healthcare",
    title: "AI for Healthcare Professionals",
    description:
      "Specialized training on AI applications in healthcare delivery, diagnostics, and health informatics.",
    duration: "150 hours",
    level: "intermediate",
    format: "Online",
    price: "$275",
    audiences: ["professionals", "ngos", "companies"],
    topics: [
      "AI in clinical decision support",
      "Health data analytics",
      "Patient engagement AI tools",
      "Regulatory considerations",
      "Implementation best practices",
    ],
  },
  {
    id: "gov-ai-policy",
    title: "Government AI Policy & Governance",
    description:
      "Framework for developing AI policies, governance structures, and ethical guidelines for public sector.",
    duration: "105 hours",
    level: "intermediate",
    format: "Corporate",
    price: "$200",
    audiences: ["companies", "ngos", "public"],
    topics: [
      "AI policy development frameworks",
      "Data governance and privacy",
      "Algorithmic accountability",
      "Public sector AI procurement",
      "International standards alignment",
    ],
  },
  {
    id: "chatbot-building",
    title: "Building Chatbots & AI Tools",
    description:
      "Practical workshop on designing, building, and deploying conversational AI and automation tools.",
    duration: "50 hours",
    level: "advanced",
    format: "Online",
    price: "$500",
    audiences: ["professionals", "students", "companies"],
    topics: [
      "Conversational AI design principles",
      "LLM integration and prompting",
      "Multi-channel deployment",
      "Testing and optimization",
      "Production deployment",
    ],
  },
  {
    id: "ai-ngos",
    title: "AI for NGOs & Development Workers",
    description:
      "Practical AI tools and strategies for NGOs to amplify program impact, streamline reporting, and reach more beneficiaries.",
    duration: "72 hours",
    level: "beginner",
    format: "Online",
    price: "$150",
    audiences: ["ngos", "public"],
    topics: [
      "AI for program monitoring & evaluation",
      "Automated reporting for donors",
      "Beneficiary communication via chatbots",
      "Field data collection with AI",
      "Low-cost AI tools for nonprofits",
    ],
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering Masterclass",
    description:
      "Master the art of crafting effective prompts for ChatGPT, Claude, and other LLMs to maximize productivity.",
    duration: "50 hours",
    level: "intermediate",
    format: "Online",
    price: "$125",
    audiences: ["professionals", "students", "public"],
    topics: [
      "Prompt design fundamentals",
      "Chain-of-thought techniques",
      "Role-based prompting strategies",
      "Output formatting and constraints",
      "Building prompt libraries for teams",
    ],
  },
  {
    id: "ml-beginners",
    title: "Machine Learning for Beginners",
    description:
      "A gentle introduction to machine learning concepts for students and career-switchers entering the AI field.",
    duration: "150 hours",
    level: "beginner",
    format: "Online",
    price: "$250",
    audiences: ["students", "public"],
    topics: [
      "What is machine learning?",
      "Supervised vs unsupervised learning",
      "Hands-on with Python & scikit-learn",
      "Model evaluation basics",
      "Career paths in African AI",
    ],
  },
  {
    id: "ai-agriculture",
    title: "AI in Agriculture & Food Security",
    description:
      "Explore AI applications in crop monitoring, yield prediction, and supply chain optimization for African agriculture.",
    duration: "120 hours",
    level: "intermediate",
    format: "Online",
    price: "$200",
    audiences: ["ngos", "companies", "public"],
    topics: [
      "Satellite imagery & crop health",
      "Yield prediction models",
      "Supply chain AI optimization",
      "Mobile-based farmer advisory systems",
      "Case studies from West Africa",
    ],
  },
  {
    id: "ai-ethics",
    title: "Data Privacy & AI Ethics in Africa",
    description:
      "Navigate ethical AI development, data protection laws, and responsible deployment across African contexts.",
    duration: "105 hours",
    level: "intermediate",
    format: "Online",
    price: "$150",
    audiences: ["professionals", "companies", "ngos", "public"],
    topics: [
      "African data protection landscape",
      "Bias and fairness in AI systems",
      "Informed consent and data rights",
      "Ethical AI frameworks",
      "Building trust with communities",
    ],
  },
  {
    id: "ai-marketing",
    title: "AI for Marketing & Sales Teams",
    description:
      "Leverage AI for content creation, customer segmentation, campaign optimization, and sales automation.",
    duration: "72 hours",
    level: "beginner",
    format: "Corporate",
    price: "$150",
    audiences: ["companies", "professionals"],
    topics: [
      "AI content generation tools",
      "Customer segmentation with AI",
      "Social media automation",
      "Sales pipeline AI assistants",
      "Measuring marketing AI ROI",
    ],
  },
  {
    id: "python-weekend",
    title: "Python for AI — Weekend Intensive",
    description:
      "Fast-track Python programming skills specifically for AI development — designed for busy professionals.",
    duration: "50 hours",
    level: "advanced",
    format: "Online",
    price: "$175",
    audiences: ["students", "professionals"],
    topics: [
      "Python fundamentals crash course",
      "NumPy, Pandas & data handling",
      "Working with AI APIs",
      "Building a simple AI app",
      "Development environment setup",
    ],
  },
  {
    id: "ai-finance",
    title: "AI for Financial Services",
    description:
      "AI applications in banking, microfinance, insurance, and fintech — fraud detection, credit scoring, and automation.",
    duration: "105 hours",
    level: "intermediate",
    format: "Corporate",
    price: "$200",
    audiences: ["companies", "professionals"],
    topics: [
      "Fraud detection with AI",
      "Credit scoring models",
      "Customer service automation",
      "Regulatory compliance & AI",
      "Fintech case studies in Africa",
    ],
  },
  {
    id: "women-ai-leadership",
    title: "Women in AI Leadership Program",
    description:
      "Empowering women professionals to lead AI initiatives, build technical confidence, and shape Africa's AI future.",
    duration: "Upcoming",
    level: "intermediate",
    format: "Online",
    price: "Upcoming",
    audiences: ["professionals", "students", "public"],
    topics: [
      "AI leadership for women",
      "Building technical confidence",
      "Networking & mentorship",
      "Pitching AI projects",
      "Career advancement strategies",
    ],
  },
  {
    id: "ai-educators",
    title: "AI for Educators & Trainers",
    description:
      "Help teachers and trainers integrate AI into classrooms, curriculum design, and student assessment.",
    duration: "72 hours",
    level: "beginner",
    format: "Online",
    price: "$125",
    audiences: ["public", "professionals", "students"],
    topics: [
      "AI tools for lesson planning",
      "Automated grading assistance",
      "Personalized learning with AI",
      "Academic integrity & AI",
      "AI literacy for students",
    ],
  },
  {
    id: "computer-vision",
    title: "Computer Vision Workshop",
    description:
      "Hands-on workshop on image recognition, object detection, and visual AI applications for real-world problems.",
    duration: "Upcoming",
    level: "advanced",
    format: "Online",
    price: "Upcoming",
    audiences: ["students", "professionals"],
    topics: [
      "Image classification fundamentals",
      "Object detection with YOLO",
      "OpenCV for preprocessing",
      "Deploying vision models on edge",
      "Agriculture & security use cases",
    ],
  },
  {
    id: "ai-product-mgmt",
    title: "AI Product Management",
    description:
      "Learn to define, build, and launch AI-powered products — from ideation to go-to-market for African markets.",
    duration: "105 hours",
    level: "intermediate",
    format: "Corporate",
    price: "$200",
    audiences: ["companies", "professionals"],
    topics: [
      "AI product lifecycle",
      "User research for AI products",
      "MVP development strategies",
      "Pricing AI products in Africa",
      "Go-to-market playbooks",
    ],
  },
  {
    id: "youth-ai-camp",
    title: "Youth AI Discovery Camp",
    description:
      "An exciting introduction to AI for teenagers and young adults — no prior experience required. Build your first AI project!",
    duration: "Upcoming",
    level: "beginner",
    format: "Online",
    price: "Upcoming",
    audiences: ["students", "public"],
    topics: [
      "What is AI? Fun demonstrations",
      "Build a chatbot in an afternoon",
      "AI in games, music & art",
      "Careers in AI across Africa",
      "Team project showcase",
    ],
  },
  {
    id: "ai-legal",
    title: "AI for Legal & Compliance Teams",
    description:
      "How legal professionals and compliance officers can use AI for document review, contract analysis, and regulatory research.",
    duration: "105 hours",
    level: "intermediate",
    format: "Corporate",
    price: "$200",
    audiences: ["companies", "professionals"],
    topics: [
      "AI for contract analysis",
      "Legal research automation",
      "Compliance monitoring tools",
      "Risk assessment with AI",
      "Ethical boundaries in legal AI",
    ],
  },
  {
    id: "nlp-african-languages",
    title: "NLP & African Languages",
    description:
      "Building natural language processing solutions for African languages — translation, sentiment, and voice interfaces.",
    duration: "90 hours",
    level: "advanced",
    format: "Online",
    price: "$250",
    audiences: ["professionals", "ngos", "students"],
    topics: [
      "African language datasets",
      "Text preprocessing for local languages",
      "Building translation pipelines",
      "Voice interfaces for low-literacy users",
      "Open-source NLP tools",
    ],
  },
  {
    id: "ai-freelancers",
    title: "AI Tools for Freelancers & Creators",
    description:
      "Boost your freelance business with AI — content creation, client management, proposal writing, and productivity hacks.",
    duration: "50 hours",
    level: "beginner",
    format: "Online",
    price: "$125",
    audiences: ["public", "professionals", "students"],
    topics: [
      "AI writing & content tools",
      "Proposal & pitch generation",
      "Client communication automation",
      "Portfolio & branding with AI",
      "Pricing your AI-enhanced services",
    ],
  },
  {
    id: "enterprise-transformation",
    title: "Digital Transformation with AI",
    description:
      "Enterprise-grade program for organizations undergoing AI-driven digital transformation across departments.",
    duration: "Upcoming",
    level: "advanced",
    format: "Corporate",
    price: "Upcoming",
    audiences: ["companies"],
    topics: [
      "Transformation strategy & roadmap",
      "Change management for AI adoption",
      "Department-by-department AI integration",
      "KPI frameworks for AI initiatives",
      "Building internal AI capabilities",
    ],
  },
  {
    id: "ai-research-methods",
    title: "AI Research Methods for Academics",
    description:
      "For university students and researchers — methodologies, tools, and publishing in AI and machine learning.",
    duration: "72 hours",
    level: "intermediate",
    format: "Online",
    price: "$125",
    audiences: ["students", "professionals"],
    topics: [
      "Research design for AI projects",
      "Literature review with AI tools",
      "Reproducible research practices",
      "Academic writing & publishing",
      "Grant applications for AI research",
    ],
  },
];

export const upcomingSessions = [
  {
    course: "AI Essentials for Business",
    date: "Upcoming",
    location: "Online",
    price: "Upcoming",
    seats: 0,
  },
  {
    course: "Youth AI Discovery Camp",
    date: "Upcoming",
    location: "Online",
    price: "Upcoming",
    seats: 0,
  },
  {
    course: "AI Development Bootcamp",
    date: "Upcoming",
    location: "Online",
    price: "Upcoming",
    seats: 0,
  },
  {
    course: "Prompt Engineering Masterclass",
    date: "Upcoming",
    location: "Online",
    price: "Upcoming",
    seats: 0,
  },
  {
    course: "AI for NGOs & Development Workers",
    date: "Upcoming",
    location: "Online",
    price: "Upcoming",
    seats: 0,
  },
  {
    course: "AI for Healthcare Professionals",
    date: "Upcoming",
    location: "Online",
    price: "Upcoming",
    seats: 0,
  },
  {
    course: "Women in AI Leadership Program",
    date: "Upcoming",
    location: "Online",
    price: "Upcoming",
    seats: 0,
  },
  {
    course: "Machine Learning for Beginners",
    date: "Upcoming",
    location: "Online",
    price: "Upcoming",
    seats: 0,
  },
];
