export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: string;
  requirements: string[];
  salary?: string;
  status: "Open" | "Closed";
  postedAt: string;
  employerId: string;
}

export type ApplicationStatus = "Applied" | "Screening" | "Interview" | "Offered" | "Rejected";

export interface Application {
  id: string;
  jobId: string;
  jobseekerId: string;
  jobseekerName: string;
  jobseekerBio: string;
  status: ApplicationStatus;
  appliedAt: string;
  matchScore: number;
}

export const MOCK_JOBS: Job[] = [
  {
    id: "job1", title: "Senior Frontend Engineer", company: "Startup0km",
    location: "Buenos Aires, AR", type: "Full-time",
    description: "We're looking for a senior frontend engineer to lead our React-based platform development. You'll work closely with design and product to build world-class hiring tools.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Experience with design systems", "Strong communication skills"],
    salary: "$120k - $160k", status: "Open", postedAt: "2026-03-15", employerId: "emp1",
  },
  {
    id: "job2", title: "Backend Developer", company: "Startup0km",
    location: "Remote", type: "Remote",
    description: "Join our backend team to build scalable APIs and microservices using Node.js and PostgreSQL. Focus on performance and reliability.",
    requirements: ["3+ years Node.js", "PostgreSQL experience", "API design", "Docker & CI/CD"],
    salary: "$100k - $140k", status: "Open", postedAt: "2026-03-12", employerId: "emp1",
  },
  {
    id: "job3", title: "Product Designer", company: "Startup0km",
    location: "Buenos Aires, AR", type: "Full-time",
    description: "Design intuitive, beautiful interfaces for our ATS platform. Work with engineers to ship polished features.",
    requirements: ["Figma expertise", "Design systems experience", "User research skills", "3+ years product design"],
    salary: "$90k - $130k", status: "Open", postedAt: "2026-03-10", employerId: "emp1",
  },
  {
    id: "job4", title: "DevOps Engineer", company: "Startup0km",
    location: "Remote", type: "Contract",
    description: "Help us build and maintain our cloud infrastructure on AWS. Focus on automation, monitoring, and security.",
    requirements: ["AWS expertise", "Terraform/IaC", "Kubernetes", "Monitoring & alerting"],
    salary: "$110k - $150k", status: "Open", postedAt: "2026-03-08", employerId: "emp1",
  },
  {
    id: "job5", title: "Data Analyst", company: "Startup0km",
    location: "Buenos Aires, AR", type: "Part-time",
    description: "Analyze hiring trends and platform metrics to drive product decisions. Build dashboards and reports.",
    requirements: ["SQL proficiency", "Python/R", "Data visualization", "Statistical analysis"],
    salary: "$60k - $80k", status: "Closed", postedAt: "2026-02-20", employerId: "emp1",
  },
];

export const MOCK_APPLICATIONS: Application[] = [
  { id: "app1", jobId: "job1", jobseekerId: "js1", jobseekerName: "Alex Rivera", jobseekerBio: "Full-stack developer with 5 years experience in React, Node.js, and Python.", status: "Interview", appliedAt: "2026-03-16", matchScore: 87 },
  { id: "app2", jobId: "job1", jobseekerId: "js2", jobseekerName: "María López", jobseekerBio: "Frontend specialist with deep React and TypeScript expertise. 4 years of experience.", status: "Screening", appliedAt: "2026-03-16", matchScore: 92 },
  { id: "app3", jobId: "job1", jobseekerId: "js3", jobseekerName: "Tomás García", jobseekerBio: "Junior developer eager to learn. Built several personal projects with React.", status: "Applied", appliedAt: "2026-03-17", matchScore: 54 },
  { id: "app4", jobId: "job2", jobseekerId: "js1", jobseekerName: "Alex Rivera", jobseekerBio: "Full-stack developer with 5 years experience in React, Node.js, and Python.", status: "Applied", appliedAt: "2026-03-17", matchScore: 78 },
  { id: "app5", jobId: "job2", jobseekerId: "js4", jobseekerName: "Lucas Fernández", jobseekerBio: "Backend engineer specializing in Node.js and PostgreSQL. 6 years experience.", status: "Offered", appliedAt: "2026-03-13", matchScore: 95 },
  { id: "app6", jobId: "job3", jobseekerId: "js5", jobseekerName: "Valentina Ruiz", jobseekerBio: "Product designer with 5 years experience in fintech. Expert in Figma and design systems.", status: "Interview", appliedAt: "2026-03-11", matchScore: 88 },
  { id: "app7", jobId: "job1", jobseekerId: "js6", jobseekerName: "Diego Morales", jobseekerBio: "Senior React developer with 7 years experience. Led frontend teams at two startups.", status: "Offered", appliedAt: "2026-03-15", matchScore: 96 },
];
