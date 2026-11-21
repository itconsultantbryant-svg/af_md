export interface TeamMember {
  name: string;
  role: string;
  initials: string;
  image: string;
  bio: string;
  linkedin: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Samson Bryant",
    role: "Founder & CEO",
    initials: "SB",
    image: "/team/samson-bryant.jpeg",
    bio: "A Full-Stack Software Developer, IT Specialist, AI Engineer and TechPreneur with a strong background in web development, mobile applications, and system administration and maintenance.",
    linkedin: "#",
  },
  {
    name: "Prosper PS Fallah",
    role: "Chief Technology Officer",
    initials: "PF",
    image: "/team/prosper-fallah.jpeg",
    bio: "Prosper PS Fallah is currently studying System Administration at Starz University and has a strong passion for technology, software development, and digital innovation. His goal is to become a well-rounded IT professional and software developer, continuously expanding his knowledge and making a meaningful impact through technology.",
    linkedin: "#",
  },
];

export const partners = [
  "Tech Hub Liberia",
  "West Africa Innovation Network",
  "African AI Alliance",
  "Liberia Chamber of Commerce",
  "Open Source Initiative Africa",
  "Digital Africa Foundation",
];

export const milestones = [
  { year: "2026", title: "AfriMind Tech&AI Consulting Agency founded in Monrovia, Liberia" },
  { year: "2026", title: "First government AI deployment goes live" },
  { year: "2026", title: "First corporate AI training program launched" },
  { year: "2027", title: "Expansion to West African market" },
  { year: "2027", title: "SaaS product line launch" },
  { year: "2028", title: "Pan-African partnerships program" },
];
