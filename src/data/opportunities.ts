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

const MANUAL_SAMPLE_OPPORTUNITIES: Opportunity[] = [
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
  },
  {
    id: 'opp-13',
    title: 'Data Science Intern',
    organization: 'Tesla',
    type: 'Internship',
    location: 'Remote',
    remote: true,
    deadline: '2026-12-31',
    description: 'Work with the Autopilot telemetry group to process vehicle computer vision signals and train model weights using Python and Pandas tools.',
    eligibility: 'Enrolled in B.S./M.S. data analysis, mathematics, or physics programs with statistical backgrounds.',
    skills: ['Python', 'Pandas', 'Data Analysis', 'PyTorch'],
    experienceLevel: 'Some projects',
    tags: ['Tesla', 'Data Science', 'AI', 'Remote', 'Autopilot'],
    applicationUrl: 'https://careers.tesla.com'
  },
  {
    id: 'opp-14',
    title: 'AI Resident (Language Modeling)',
    organization: 'OpenAI',
    type: 'Research',
    location: 'San Francisco, CA',
    remote: false,
    deadline: '2026-12-15',
    description: 'Investigate alignment techniques and transformer scaling paradigms. Assist in coding deep learning configurations and managing high-capacity GPU cluster training.',
    eligibility: 'Open to exceptional B.Tech/M.S. graduates with published papers or significant open-source machine learning projects.',
    skills: ['Python', 'PyTorch', 'Deep Learning', 'Transformers'],
    experienceLevel: 'Advanced',
    tags: ['OpenAI', 'Research', 'AI Safety', 'San Francisco', 'Deep Learning'],
    applicationUrl: 'https://openai.com/careers'
  },
  {
    id: 'opp-15',
    title: 'MLH Open Source Fellow',
    organization: 'Major League Hacking',
    type: 'Internship',
    location: 'Remote',
    remote: true,
    deadline: '2026-09-10',
    description: 'Collaborate with global maintainers on key React or Node.js ecosystem packages. Gain open source software engineering credentials and receive mentoring.',
    eligibility: 'Beginner to intermediate programmers with basic Git knowledge and high enthusiasm for building open source products.',
    skills: ['Git', 'JavaScript', 'React', 'Open Source'],
    experienceLevel: 'Beginner',
    tags: ['MLH', 'Open Source', 'Internship', 'Remote', 'Git'],
    applicationUrl: 'https://fellowship.mlh.io'
  },
  {
    id: 'opp-16',
    title: 'Frontend Developer Intern (React)',
    organization: 'Meta India',
    type: 'Internship',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-11-10',
    description: 'Work on performance profiling and web application responsiveness inside Meta\'s messaging products. Translate mockups into highly accessible DOM states.',
    eligibility: 'Undergraduate student in CS/IT. Strong familiarity with React internals and component performance metrics.',
    skills: ['JavaScript', 'React', 'HTML', 'CSS'],
    experienceLevel: 'Intermediate',
    tags: ['Meta', 'Facebook', 'Frontend', 'React', 'Bangalore'],
    applicationUrl: 'https://metacareers.com'
  },
  {
    id: 'opp-17',
    title: 'Space Image Processing Fellowship',
    organization: 'ISRO (Space Applications Centre)',
    type: 'Research',
    location: 'Ahmedabad, GJ',
    remote: false,
    deadline: '2026-11-30',
    description: 'Analyze telemetry and high-resolution multispectral image data from Indian satellites. Build algorithmic modules for crop classification and terrain mapping.',
    eligibility: 'Students pursuing B.Tech/M.Tech in Aerospace, Remote Sensing, or Electronics and Communication.',
    skills: ['Python', 'MATLAB', 'Image Processing', 'Data Analysis'],
    experienceLevel: 'Advanced',
    tags: ['ISRO', 'Research', 'Satellite', 'Ahmedabad', 'Remote Sensing'],
    applicationUrl: 'https://isro.gov.in'
  },
  {
    id: 'opp-18',
    title: 'Stripe Global Developer Sprint',
    organization: 'Stripe',
    type: 'Hackathon',
    location: 'Remote',
    remote: true,
    deadline: '2026-10-25',
    description: 'Build creative SaaS dashboards and billing integrations using Stripe APIs. A 72-hour virtual build sprint focusing on payment innovation.',
    eligibility: 'Student builders working individually or in teams of up to 4.',
    skills: ['React', 'Node.js', 'APIs', 'Problem Solving'],
    experienceLevel: 'Some projects',
    tags: ['Stripe', 'Hackathon', 'SaaS', 'Remote', 'Fintech'],
    applicationUrl: 'https://stripe.com'
  },
  {
    id: 'opp-19',
    title: 'Cybersecurity Analyst Intern',
    organization: 'CrowdStrike',
    type: 'Internship',
    location: 'Pune, MH',
    remote: false,
    deadline: '2026-10-05',
    description: 'Analyze system activity logs, investigate kernel telemetry warnings, and write Python scripts to automate incident logs parsing.',
    eligibility: 'Students with operating systems background and passion for penetration testing or security analysis.',
    skills: ['Python', 'Linux Kernel', 'Cyber Security', 'Operating Systems'],
    experienceLevel: 'Intermediate',
    tags: ['CrowdStrike', 'Security', 'Linux', 'Pune'],
    applicationUrl: 'https://crowdstrike.com/careers'
  },
  {
    id: 'opp-20',
    title: 'Netflix Hackday 2026',
    organization: 'Netflix',
    type: 'Hackathon',
    location: 'Los Gatos, CA',
    remote: false,
    deadline: '2026-11-05',
    description: 'Design features that enhance the streaming experience. Focus on network protocol compression, localized UI animations, and content discovery algorithms.',
    eligibility: 'College students who are registered developers. Submissions require a working proof-of-concept.',
    skills: ['Java', 'React', 'Cloud Architecture', 'Presentation'],
    experienceLevel: 'Advanced',
    tags: ['Netflix', 'Hackathon', 'Streaming', 'Los Gatos'],
    applicationUrl: 'https://netflix.com'
  },
  {
    id: 'opp-21',
    title: 'Robotics Control Research Intern',
    organization: 'IISc Robotics Lab',
    type: 'Research',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-12-20',
    description: 'Develop trajectory-planning algorithms for robotic manipulators. Integrate ROS controls, run hardware-in-the-loop tests, and draft conference papers.',
    eligibility: 'CS/Mechanical engineering students with deep foundations in linear algebra, C++, and Python.',
    skills: ['C++', 'Python', 'ROS', 'Control Systems'],
    experienceLevel: 'Intermediate',
    tags: ['IISc', 'Research', 'Robotics', 'C++', 'Bangalore'],
    applicationUrl: 'https://iisc.ac.in'
  },
  {
    id: 'opp-22',
    title: 'Cryptographic Protocol Hackathon',
    organization: 'Ethereum Foundation',
    type: 'Hackathon',
    location: 'Remote',
    remote: true,
    deadline: '2026-12-05',
    description: 'Design zero-knowledge proofs and layer-2 privacy architectures. Write rust contracts and dapp connectors.',
    eligibility: 'Developers interested in cryptography, Rust, and EVM scaling solutions.',
    skills: ['Rust', 'Solidity', 'Smart Contracts', 'Web3'],
    experienceLevel: 'Intermediate',
    tags: ['Ethereum', 'Hackathon', 'Web3', 'Remote', 'Rust'],
    applicationUrl: 'https://ethereum.org'
  },
  {
    id: 'opp-23',
    title: 'Backend Developer Intern',
    organization: 'Zerodha',
    type: 'Internship',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-09-18',
    description: 'Work on scaling broker APIs and transaction data caches. Learn to write optimized Go code, design database schemas, and manage Redis servers.',
    eligibility: 'Pre-final year students with project portfolios demonstrating backend development and database usage.',
    skills: ['Go', 'Postgres', 'Redis', 'Python'],
    experienceLevel: 'Some projects',
    tags: ['Zerodha', 'Backend', 'Go', 'Bangalore', 'Fintech'],
    applicationUrl: 'https://zerodha.tech'
  },
  {
    id: 'opp-24',
    title: 'AI Alignment Research Intern',
    organization: 'Alignment Research Center',
    type: 'Research',
    location: 'Berkeley, CA',
    remote: false,
    deadline: '2026-12-10',
    description: 'Investigate theoretical alignment proofs and test language models for deceptive behaviors. Requires statistical modeling and math.',
    eligibility: 'Students with backgrounds in probability, machine learning, and CS theory.',
    skills: ['Python', 'Machine Learning', 'Probability & Stats', 'Algorithms'],
    experienceLevel: 'Advanced',
    tags: ['ARC', 'Research', 'AI Safety', 'Berkeley', 'Academic'],
    applicationUrl: 'https://alignmentresearch.org'
  },
  {
    id: 'opp-25',
    title: 'User Experience Research Intern',
    organization: 'Uber India',
    type: 'Internship',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-11-25',
    description: 'Collaborate with product designers to run usability test loops, perform wireframe analyses, and draft user interaction logs.',
    eligibility: 'Students enrolled in Human-Computer Interaction, Design, Psychology, or related fields.',
    skills: ['Figma', 'User Research', 'Interaction Design', 'Presentation'],
    experienceLevel: 'Intermediate',
    tags: ['Uber', 'UX Research', 'Design', 'Bangalore'],
    applicationUrl: 'https://careers.uber.com'
  },
  {
    id: 'opp-26',
    title: 'AI for Climate Science Fellow',
    organization: 'IISc & UN Environment Joint Initiative',
    type: 'Research',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-12-05',
    description: 'Apply deep learning to satellite telemetry for forecasting local rainfall anomalies. Work on computational physics modules.',
    eligibility: 'Graduate students or pre-final B.Tech with high mathematical proficiency and Python programming skills.',
    skills: ['Python', 'PyTorch', 'Data Analysis', 'Probability & Stats'],
    experienceLevel: 'Advanced',
    tags: ['IISc', 'Research', 'UN', 'Climate Science', 'Bangalore'],
    applicationUrl: 'https://iisc.ac.in'
  },
  {
    id: 'opp-27',
    title: 'Rust & Solana Systems Hackathon',
    organization: 'Solana Foundation',
    type: 'Hackathon',
    location: 'Remote',
    remote: true,
    deadline: '2026-10-18',
    description: 'Write high-speed smart contracts and layer-1 node performance modules using Rust in this 48-hour decentralized scaling sprint.',
    eligibility: 'Open to student teams globally. Focus is on performance and secure cryptography.',
    skills: ['Rust', 'Smart Contracts', 'Web3', 'Problem Solving'],
    experienceLevel: 'Intermediate',
    tags: ['Solana', 'Hackathon', 'Rust', 'Web3', 'Remote'],
    applicationUrl: 'https://solana.com'
  },
  {
    id: 'opp-28',
    title: 'iOS Software Engineering Intern',
    organization: 'Apple India',
    type: 'Internship',
    location: 'Hyderabad, TS',
    remote: false,
    deadline: '2026-10-22',
    description: 'Work on performance optimization and UI accessibility features for Apple Map services. Code in Swift and C++.',
    eligibility: 'Pre-final B.Tech students with projects demonstrating native Swift iOS app development.',
    skills: ['Swift', 'C++', 'Data Structures', 'Algorithms'],
    experienceLevel: 'Intermediate',
    tags: ['Apple', 'Software Engineering', 'iOS', 'Hyderabad', 'Swift'],
    applicationUrl: 'https://apple.com/careers/in'
  },
  {
    id: 'opp-29',
    title: 'CUDA Core & GPU Intern',
    organization: 'NVIDIA',
    type: 'Internship',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-11-15',
    description: 'Assist in writing parallelized processing kernels for tensor computations. Profile CUDA performance metrics on Blackwell architecture.',
    eligibility: 'Advanced CS/EE students with systems programming experience and knowledge of hardware architectures.',
    skills: ['C++', 'CUDA', 'Python', 'Algorithms'],
    experienceLevel: 'Advanced',
    tags: ['NVIDIA', 'GPU', 'Systems Programming', 'CUDA', 'Bangalore'],
    applicationUrl: 'https://nvidia.com/careers'
  },
  {
    id: 'opp-30',
    title: 'Open Source Frontend Fellow',
    organization: 'Vercel',
    type: 'Internship',
    location: 'Remote',
    remote: true,
    deadline: '2026-09-20',
    description: 'Collaborate with the Next.js core engineering team to profile and optimize server component rendering paths and accessibility specs.',
    eligibility: 'Students with projects demonstrating deep React, Next.js, and TypeScript skills.',
    skills: ['JavaScript', 'TypeScript', 'React', 'HTML'],
    experienceLevel: 'Some projects',
    tags: ['Vercel', 'NextJS', 'Open Source', 'Remote', 'Frontend'],
    applicationUrl: 'https://vercel.com/careers'
  },
  {
    id: 'opp-31',
    title: 'Quantum Computing Algorithm Research',
    organization: 'IBM Research',
    type: 'Research',
    location: 'Yorktown Heights, NY',
    remote: false,
    deadline: '2026-12-08',
    description: 'Write quantum simulation modules using Qiskit. Benchmark error mitigation configurations on superconducting hardware qubits.',
    eligibility: 'Enrolled in Physics, Mathematics, or CS graduate tracks with foundations in quantum mechanics.',
    skills: ['Python', 'Qiskit', 'Data Analysis', 'Algorithms'],
    experienceLevel: 'Advanced',
    tags: ['IBM', 'Research', 'Quantum', 'Yorktown Heights', 'Academic'],
    applicationUrl: 'https://research.ibm.com'
  },
  {
    id: 'opp-32',
    title: 'Infrastructure & DevOps Sprint',
    organization: 'HashiCorp',
    type: 'Hackathon',
    location: 'Remote',
    remote: true,
    deadline: '2026-09-28',
    description: 'Build infrastructure-as-code modules and secure configuration templates using Terraform and Vault APIs. A 48-hour automated build sprint.',
    eligibility: 'Beginners interested in cloud systems, Linux automation, and container registries.',
    skills: ['Terraform', 'Docker', 'Linux Kernel', 'Problem Solving'],
    experienceLevel: 'Beginner',
    tags: ['HashiCorp', 'DevOps', 'Cloud', 'Remote', 'Terraform'],
    applicationUrl: 'https://hashicorp.com'
  },
  {
    id: 'opp-33',
    title: 'Cloud Support Intern',
    organization: 'AWS India',
    type: 'Internship',
    location: 'Mumbai, MH',
    remote: false,
    deadline: '2026-10-12',
    description: 'Support high-availability enterprise cloud deployments. Build cloud automation templates and debug virtual network routing issues.',
    eligibility: 'Students in CS, IT, or ECE with foundations in networking, Linux, and cloud architectures.',
    skills: ['Python', 'AWS', 'Linux Kernel', 'Operating Systems'],
    experienceLevel: 'Intermediate',
    tags: ['AWS', 'Amazon', 'Cloud', 'Mumbai', 'DevOps'],
    applicationUrl: 'https://amazon.jobs'
  },
  {
    id: 'opp-34',
    title: 'Computational Biology Research Fellow',
    organization: 'Harvard Medical School',
    type: 'Research',
    location: 'Boston, MA',
    remote: false,
    deadline: '2026-12-12',
    description: 'Analyze genomic sequencing datasets using statistical models. Write sequence processing libraries and draft scientific papers.',
    eligibility: 'Students pursuing computational biology, bioinformatics, or data science degrees.',
    skills: ['Python', 'Data Analysis', 'Probability & Stats', 'Algorithms'],
    experienceLevel: 'Advanced',
    tags: ['Harvard', 'Research', 'Biology', 'Boston', 'Academic'],
    applicationUrl: 'https://hms.harvard.edu'
  },
  {
    id: 'opp-35',
    title: 'Full-Stack Developer Intern',
    organization: 'Postman',
    type: 'Internship',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-09-22',
    description: 'Build frontend workspaces and REST API clients inside Postman\'s collaborative workspaces. Work in Node.js and React.',
    eligibility: 'B.Tech/BCA/MCA pre-final students with projects demonstrating full-stack Node.js development.',
    skills: ['JavaScript', 'Node.js', 'React', 'APIs'],
    experienceLevel: 'Some projects',
    tags: ['Postman', 'Frontend', 'React', 'Bangalore', 'APIs'],
    applicationUrl: 'https://postman.com/careers'
  },
  {
    id: 'opp-36',
    title: 'Azure Cloud Hackathon 2026',
    organization: 'Microsoft India',
    type: 'Hackathon',
    location: 'Bangalore, KA',
    remote: false,
    deadline: '2026-11-28',
    description: 'A 48-hour innovation sprint. Build scalable web architectures and intelligence services utilizing Azure cognitive containers.',
    eligibility: 'All college students in teams of 1 to 4 members. Focus is on cloud utility and presentation.',
    skills: ['C#', 'Java', 'Cloud Architecture', 'Presentation'],
    experienceLevel: 'Beginner',
    tags: ['Microsoft', 'Azure', 'Hackathon', 'Bangalore', 'Cloud'],
    applicationUrl: 'https://careers.microsoft.com'
  }
];

// Programmatic Generator to yield exactly 100 listings total
const generateRemainingOpportunities = (): Opportunity[] => {
  const list: Opportunity[] = [];
  
  const companies = [
    'Salesforce', 'Intel', 'SpaceX', 'Flipkart', 'Swiggy', 'Meesho', 
    'CRED', 'Groww', 'Cognizant', 'Infosys', 'TCS', 'Wipro', 'HCLTech',
    'Twilio', 'Slack', 'GitHub', 'Atlassian', 'Discord', 'Datadog', 'Snowflake'
  ];

  const locations = [
    'Bangalore, KA', 'Hyderabad, TS', 'Pune, MH', 'Mumbai, MH', 
    'Noida, UP', 'Chennai, TN', 'Remote'
  ];

  const internshipTitles = [
    { title: 'Backend Systems Developer Intern', skills: ['Go', 'Postgres', 'Redis', 'Python'], tags: ['Backend', 'Database'] },
    { title: 'Frontend Systems UI Intern', skills: ['HTML', 'CSS', 'JavaScript', 'React'], tags: ['Frontend', 'UI/UX'] },
    { title: 'Cloud Infrastructure Associate', skills: ['AWS', 'Docker', 'Kubernetes', 'Linux Kernel'], tags: ['Cloud', 'DevOps'] },
    { title: 'Mobile App Developer Intern', skills: ['Swift', 'C++', 'Git', 'Algorithms'], tags: ['iOS', 'Mobile'] },
    { title: 'Data Analytics Intern', skills: ['Python', 'SQL', 'Pandas', 'Data Analysis'], tags: ['Data', 'SQL'] },
    { title: 'Security Systems Support Intern', skills: ['Linux Kernel', 'Python', 'Cyber Security', 'Git'], tags: ['Security', 'Infra'] }
  ];

  const researchTitles = [
    { title: 'Natural Language Processing Assistant', skills: ['Python', 'PyTorch', 'Transformers', 'Deep Learning'], tags: ['Research', 'AI'] },
    { title: 'Reinforcement Learning Research Fellow', skills: ['Python', 'PyTorch', 'Reinforcement Learning', 'Probability & Stats'], tags: ['Research', 'ML'] },
    { title: 'Quantum Computing Algorithm Intern', skills: ['Python', 'Qiskit', 'Algorithms', 'Data Analysis'], tags: ['Research', 'Quantum'] },
    { title: 'Distributed Networking Systems Intern', skills: ['C++', 'Go', 'Git', 'Linux Kernel'], tags: ['Research', 'Systems'] }
  ];

  const hackathonTitles = [
    { title: 'Global Open Hackathon Sprint', skills: ['React', 'Node.js', 'APIs', 'Problem Solving'], tags: ['Hackathon', 'Build'] },
    { title: 'DeFi protocol Scaling Hackday', skills: ['Solidity', 'Rust', 'Web3', 'Smart Contracts'], tags: ['Hackathon', 'Blockchain'] },
    { title: 'Generative AI Solutions Sprint', skills: ['Python', 'React', 'APIs', 'Machine Learning'], tags: ['Hackathon', 'AI'] }
  ];

  for (let i = 37; i <= 100; i++) {
    // Alternate remote status
    const isRemote = i % 2 === 0;
    const location = isRemote ? 'Remote' : locations[i % locations.length];

    // Determine opportunity type
    let type: 'Internship' | 'Hackathon' | 'Research' = 'Internship';
    if (i % 3 === 0) type = 'Research';
    else if (i % 3 === 1) type = 'Hackathon';

    // Get specific titles/skills
    let info: any;
    if (type === 'Internship') {
      info = internshipTitles[i % internshipTitles.length];
    } else if (type === 'Research') {
      info = researchTitles[i % researchTitles.length];
    } else {
      info = hackathonTitles[i % hackathonTitles.length];
    }

    const company = companies[i % companies.length];
    const experienceLevels: Opportunity['experienceLevel'][] = ['Beginner', 'Some projects', 'Intermediate', 'Advanced'];
    const expLevel = experienceLevels[i % experienceLevels.length];

    // Generate deadline in future (Sept - Dec 2026)
    const month = String(9 + (i % 4)).padStart(2, '0');
    const day = String(1 + (i % 28)).padStart(2, '0');
    const deadline = `2026-${month}-${day}`;

    list.push({
      id: `opp-${i}`,
      title: info.title,
      organization: company,
      type,
      location,
      remote: isRemote,
      deadline,
      description: `Collaborate with engineers and product mentors at ${company} to design responsive architectures, research parallel computing models, and solve technical pipelines.`,
      eligibility: `Open to all undergraduate students pursuing STEM degrees with experience in software engineering projects.`,
      skills: info.skills,
      experienceLevel: expLevel,
      tags: [company, ...info.tags, isRemote ? 'Remote' : 'In-Person'],
      applicationUrl: `https://careers.${company.toLowerCase()}.com`
    });
  }

  return list;
};

export const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  ...MANUAL_SAMPLE_OPPORTUNITIES,
  ...generateRemainingOpportunities()
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
