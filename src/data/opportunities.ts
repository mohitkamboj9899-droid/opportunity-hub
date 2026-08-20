import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: 'Internship' | 'Hackathon' | 'Research';
  location: string;
  remote: boolean;
  deadline: string; // YYYY-MM-DD
  description: string;
  eligibility: string;
  skills: string[];
  experienceLevel: 'Beginner' | 'Some projects' | 'Intermediate' | 'Advanced';
  tags: string[];
  applicationUrl: string;
}

export const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Software Engineering Intern',
    organization: 'Google India',
    type: 'Internship',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-10-15',
    description: 'Join the Google Cloud team to build scalable services. You will work on real-world projects, collaborate with cross-functional teams, and learn about Google-scale architecture.',
    eligibility: 'Pre-final or final year B.Tech/M.Tech students in Computer Science or related fields.',
    skills: ['C++', 'Java', 'Data Structures', 'Algorithms'],
    experienceLevel: 'Intermediate',
    tags: ['Google', 'Software Engineering', 'Cloud', 'Bangalore'],
    applicationUrl: 'https://careers.google.com'
  },
  {
    id: 'opp-2',
    title: 'Research Fellow (Computer Vision)',
    organization: 'Microsoft Research',
    type: 'Research',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-11-01',
    description: 'Collaborate with world-class researchers to advance state-of-the-art vision models. Work on projects bridging theory and application in computer vision and deep learning.',
    eligibility: 'Graduating students or recent graduates with strong coding skills in Python and PyTorch.',
    skills: ['Python', 'PyTorch', 'Computer Vision', 'Deep Learning'],
    experienceLevel: 'Advanced',
    tags: ['Microsoft', 'Research', 'AI', 'Bangalore', 'Computer Vision'],
    applicationUrl: 'https://research.microsoft.com'
  },
  {
    id: 'opp-3',
    title: 'Smart India Hackathon 2026',
    organization: 'Ministry of Education, India',
    type: 'Hackathon',
    location: 'New Delhi, DL',
    remote: false,
    deadline: '2026-09-30',
    description: 'A nationwide initiative to provide students a platform to solve some of the pressing problems we face in our daily lives, and thus inculcate a product innovation mindset.',
    eligibility: 'All college students in teams of 6 with at least one female member.',
    skills: ['Problem Solving', 'Full-stack Development', 'App Development', 'Presentation'],
    experienceLevel: 'Beginner',
    tags: ['Government', 'Hackathon', 'National', 'New Delhi'],
    applicationUrl: 'https://sih.gov.in'
  },
  {
    id: 'opp-4',
    title: 'NASA Space Apps Challenge',
    organization: 'NASA',
    type: 'Hackathon',
    location: 'Remote',
    remote: true,
    deadline: '2026-10-04',
    description: 'NASA\'s international incubator program. Address real-world problems on Earth and in space using NASA\'s open data resources in this 48-hour global sprint.',
    eligibility: 'Open to coders, scientists, designers, storytellers, makers, builders, and technologists globally.',
    skills: ['Python', 'Data Analysis', 'Web Development', 'UI/UX Design'],
    experienceLevel: 'Some projects',
    tags: ['NASA', 'Hackathon', 'Remote', 'Data Science', 'Space'],
    applicationUrl: 'https://spaceappschallenge.org'
  },
  {
    id: 'opp-5',
    title: 'Linux Kernel Mentorship Program',
    organization: 'The Linux Foundation',
    type: 'Internship',
    location: 'Remote',
    remote: true,
    deadline: '2026-09-15',
    description: 'Work directly with Linux Kernel maintainers on active development tasks. Gain open-source experience and learn the workflow of kernel contribution.',
    eligibility: 'Students or open-source enthusiasts with a strong foundation in C and operating systems concepts.',
    skills: ['C', 'Linux Kernel', 'Git', 'Operating Systems'],
    experienceLevel: 'Advanced',
    tags: ['Linux', 'Open Source', 'Remote', 'Systems Programming'],
    applicationUrl: 'https://mentorship.lfx.linuxfoundation.org'
  },
  {
    id: 'opp-6',
    title: 'Product Design Intern',
    organization: 'Adobe India',
    type: 'Internship',
    location: 'Noida, UP',
    remote: false,
    deadline: '2026-10-30',
    description: 'Design intuitive interfaces and workflows for Adobe Creative Cloud applications. Focus on user research, wireframing, high-fidelity mockups, and interaction design.',
    eligibility: 'Design students pursuing visual design, UI/UX, or human-computer interaction degrees.',
    skills: ['Figma', 'UI/UX Design', 'Interaction Design', 'User Research'],
    experienceLevel: 'Intermediate',
    tags: ['Adobe', 'Design', 'UI/UX', 'Noida'],
    applicationUrl: 'https://careers.adobe.com'
  },
  {
    id: 'opp-7',
    title: 'Machine Learning Research Intern',
    organization: 'IISc Computational AI Lab',
    type: 'Research',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-12-15',
    description: 'Investigate sample-efficient reinforcement learning algorithms. Draft papers, write clean PyTorch research code, and run large-scale experiments.',
    eligibility: 'Enrolled in a Master\'s or Ph.D. program, or B.Tech with strong theoretical background and programming skills.',
    skills: ['Python', 'PyTorch', 'Reinforcement Learning', 'Probability & Stats'],
    experienceLevel: 'Advanced',
    tags: ['IISc', 'Research', 'Academic', 'Reinforcement Learning', 'AI'],
    applicationUrl: 'https://iisc.ac.in'
  },
  {
    id: 'opp-8',
    title: 'Web3 & Solidity Developer Intern',
    organization: 'Polygon Labs',
    type: 'Internship',
    location: 'Remote',
    remote: true,
    deadline: '2026-11-15',
    description: 'Build decentralized applications and smart contracts on Polygon\'s Layer 2 scaling infrastructure. Assist in writing secure smart contracts and frontend DApp integrations.',
    eligibility: 'Undergraduate students with basic blockchain knowledge and solid Javascript/Typescript skills.',
    skills: ['Solidity', 'TypeScript', 'React', 'Ethers.js'],
    experienceLevel: 'Intermediate',
    tags: ['Polygon', 'Web3', 'Blockchain', 'Remote', 'React'],
    applicationUrl: 'https://polygon.technology'
  },
  {
    id: 'opp-9',
    title: 'Open Source Security Research',
    organization: 'OWASP Foundation',
    type: 'Research',
    location: 'Remote',
    remote: true,
    deadline: '2026-10-20',
    description: 'Conduct security vulnerability research in modern JavaScript frameworks. Build tooling to scan open-source projects for common OWASP Top 10 vulnerabilities.',
    eligibility: 'Students interested in application security and static code analysis.',
    skills: ['JavaScript', 'Node.js', 'Cyber Security', 'Penetration Testing'],
    experienceLevel: 'Some projects',
    tags: ['OWASP', 'Research', 'Security', 'Remote', 'JavaScript'],
    applicationUrl: 'https://owasp.org'
  },
  {
    id: 'opp-10',
    title: 'EthIndia 2026 Hackathon',
    organization: 'Devfolio',
    type: 'Hackathon',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-11-20',
    description: 'Asia\'s biggest Ethereum hackathon. Gather with thousands of developers, designers, and web3 enthusiasts to hack on Ethereum projects and win bounties.',
    eligibility: 'Open to developers and students globally. Selection is based on Devfolio profiles.',
    skills: ['Solidity', 'React', 'Smart Contracts', 'Web3'],
    experienceLevel: 'Intermediate',
    tags: ['EthIndia', 'Hackathon', 'Web3', 'Bangalore', 'Devfolio'],
    applicationUrl: 'https://ethindia.co'
  },
  {
    id: 'opp-11',
    title: 'Frontend Developer Intern',
    organization: 'Razorpay',
    type: 'Internship',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-09-25',
    description: 'Build fast, accessible, and responsive user interfaces for Razorpay\'s checkout experiences. Collaborate with designers and backend teams.',
    eligibility: 'B.Tech/BCA/MCA pre-final year students with a portfolio demonstrating web development skills.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind'],
    experienceLevel: 'Some projects',
    tags: ['Razorpay', 'Frontend', 'React', 'Bangalore', 'Fintech'],
    applicationUrl: 'https://razorpay.com'
  },
  {
    id: 'opp-12',
    title: 'CERN Summer Student Programme',
    organization: 'CERN',
    type: 'Research',
    location: 'Geneva, Switzerland',
    remote: false,
    deadline: '2026-12-01',
    description: 'Work with physicists and engineers on experimental physics data analysis, computing algorithms, and high-performance computing clusters in Geneva.',
    eligibility: 'Bachelor or Master students in Physics, Engineering, Computer Science or Mathematics who have completed at least 3 years of university studies.',
    skills: ['Python', 'C++', 'Data Analysis', 'HPC', 'Linux'],
    experienceLevel: 'Advanced',
    tags: ['CERN', 'Research', 'Global', 'Physics', 'HPC'],
    applicationUrl: 'https://home.cern'
  }
];

// Helper to map DB row object properties into strict Opportunity TS interface properties
const mapDBToOpportunity = (item: any): Opportunity => {
  return {
    id: String(item.id),
    title: String(item.title),
    organization: String(item.organization),
    type: item.type as Opportunity['type'],
    location: String(item.location),
    remote: Boolean(item.remote),
    deadline: String(item.deadline),
    description: String(item.description),
    eligibility: String(item.eligibility),
    skills: Array.isArray(item.skills) ? item.skills.map(String) : [],
    experienceLevel: item.experience_level as Opportunity['experienceLevel'],
    tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
    applicationUrl: String(item.application_url)
  };
};

export const getOpportunities = async (): Promise<Opportunity[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*');
      
      if (!error && data && data.length > 0) {
        return data.map(mapDBToOpportunity);
      }
      if (error) {
        console.warn('Supabase opportunities fetch failed, falling back to local dataset:', error.message);
      }
    } catch (e) {
      console.warn('Supabase opportunities connection error, falling back to local dataset:', e);
    }
  }
  return SAMPLE_OPPORTUNITIES;
};
