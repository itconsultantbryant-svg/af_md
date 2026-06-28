export type ProjectCategory =
  | "healthcare"
  | "government"
  | "finance"
  | "education"
  | "ngo"
  | "infrastructure";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  clientType: string;
  country: string;
  description: string;
  techStack: string[];
  problem: string;
  solution: string;
  impact: { metric: string; label: string }[];
}

export const projects: Project[] = [
  {
    id: "health-info-system",
    title: "AI-Powered Health Information System",
    category: "healthcare",
    clientType: "Government Health Institution",
    country: "Liberia",
    description:
      "Comprehensive digital health platform for nationwide patient data collection and reporting.",
    techStack: ["React", "Next.js", "PostgreSQL", "SQLite"],
    problem:
      "Health facilities across Liberia lacked a unified system for patient data collection, resulting in delayed reporting and incomplete national health statistics.",
    solution:
      "AfriMind Tech&AI Consulting Agency designed and deployed an offline-first health information system with real-time sync, enabling facilities to collect, track, and report patient data seamlessly.",
    impact: [
      { metric: "31", label: "Facilities Connected" },
      { metric: "50K+", label: "Records Processed" },
      { metric: "90%", label: "Reporting Accuracy" },
    ],
  },
  {
    id: "gov-chatbot",
    title: "Citizen Services AI Chatbot",
    category: "government",
    clientType: "Government Agency",
    country: "Liberia",
    description:
      "Multilingual AI chatbot for citizen inquiries and service requests.",
    techStack: ["Python", "OpenAI", "WhatsApp API", "PostgreSQL"],
    problem:
      "Citizens faced long wait times and limited access to government service information through traditional channels.",
    solution:
      "Deployed an AI-powered chatbot accessible via web and WhatsApp, handling common inquiries in English and local languages 24/7.",
    impact: [
      { metric: "10K+", label: "Queries Handled" },
      { metric: "70%", label: "Response Automation" },
      { metric: "24/7", label: "Availability" },
    ],
  },
  {
    id: "finance-analytics",
    title: "Financial Analytics Dashboard",
    category: "finance",
    clientType: "Regional Bank",
    country: "Ghana",
    description:
      "AI-powered analytics platform for branch performance and risk assessment.",
    techStack: ["React", "Python", "TensorFlow", "PostgreSQL"],
    problem:
      "The bank lacked real-time visibility into branch performance and emerging risk patterns across 12 locations.",
    solution:
      "Built an intelligent dashboard with predictive analytics, automated reporting, and anomaly detection for financial operations.",
    impact: [
      { metric: "12", label: "Branches Monitored" },
      { metric: "40%", label: "Faster Reporting" },
      { metric: "3x", label: "Risk Detection Speed" },
    ],
  },
  {
    id: "edu-platform",
    title: "AI Learning Management System",
    category: "education",
    clientType: "University",
    country: "Nigeria",
    description:
      "Adaptive learning platform with AI-powered content recommendations.",
    techStack: ["Next.js", "Node.js", "MongoDB", "OpenAI"],
    problem:
      "Students needed personalized learning paths but the institution lacked tools to adapt content to individual progress.",
    solution:
      "Created an AI-driven LMS with adaptive assessments, personalized recommendations, and automated grading assistance.",
    impact: [
      { metric: "2K+", label: "Students Enrolled" },
      { metric: "35%", label: "Completion Rate Increase" },
      { metric: "85%", label: "Student Satisfaction" },
    ],
  },
  {
    id: "ngo-data",
    title: "NGO Impact Tracking System",
    category: "ngo",
    clientType: "International NGO",
    country: "Senegal",
    description:
      "Data collection and impact measurement platform for field programs.",
    techStack: ["React Native", "Firebase", "Python", "Power BI"],
    problem:
      "Field teams struggled to collect consistent data across remote locations with limited connectivity.",
    solution:
      "Mobile-first data collection app with offline sync, automated impact dashboards, and donor reporting tools.",
    impact: [
      { metric: "15", label: "Field Sites" },
      { metric: "5K+", label: "Beneficiaries Tracked" },
      { metric: "60%", label: "Reporting Time Saved" },
    ],
  },
  {
    id: "infra-monitoring",
    title: "Infrastructure Monitoring AI",
    category: "infrastructure",
    clientType: "Utility Company",
    country: "Kenya",
    description:
      "Predictive maintenance system for power grid infrastructure.",
    techStack: ["Python", "IoT", "TensorFlow", "Grafana"],
    problem:
      "Frequent unplanned outages due to inability to predict equipment failures across the power grid.",
    solution:
      "Deployed IoT sensors with AI predictive models to forecast equipment failures and optimize maintenance schedules.",
    impact: [
      { metric: "25%", label: "Outage Reduction" },
      { metric: "200+", label: "Sensors Deployed" },
      { metric: "$500K", label: "Maintenance Savings" },
    ],
  },
];

export const categories = [
  { id: "all", label: "All" },
  { id: "healthcare", label: "Healthcare" },
  { id: "government", label: "Government" },
  { id: "finance", label: "Finance" },
  { id: "education", label: "Education" },
  { id: "ngo", label: "NGO" },
  { id: "infrastructure", label: "Infrastructure" },
] as const;
