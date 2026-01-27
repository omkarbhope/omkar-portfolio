export interface Project {
  _id?: string;
  title: string;
  description: string;
  techStack: string[];
  achievements: string[];
  metrics: Record<string, string | number>;
  demoUrl?: string;
  githubUrl?: string;
  images: string[];
  architectureDiagrams: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceProject {
  name: string;
  description: string;
  technologies: string[];
  metrics?: Record<string, string | number>;
  architectureDiagrams?: string[];
}

export interface Experience {
  _id?: string;
  company: string;
  position: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  projects: ExperienceProject[];
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: Date;
  endDate: Date;
  gpa?: number;
  gpaScale?: number;
  courses: string[];
  honors: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  _id?: string;
  name: string;
  category: 'Languages' | 'Web Dev' | 'Databases' | 'AI/ML' | 'Infrastructure' | 'DevOps';
  proficiency: number; // 1-5 or percentage
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LicenseCertification {
  _id?: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialId?: string;
  verificationUrl?: string;
  badgeUrl?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Award {
  _id?: string;
  title: string;
  issuer: string;
  date: Date;
  category: 'Academic' | 'Professional' | 'Other';
  description: string;
  significance?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArchitectureDiagram {
  _id?: string;
  projectId: string;
  title: string;
  description?: string;
  imageUrl: string; // base64 or URL
  createdAt: Date;
}

export interface Embedding {
  _id?: string;
  content: string;
  contentType: 'resume' | 'project' | 'experience' | 'skill' | 'license' | 'award' | 'education';
  referenceId: string;
  metadata: Record<string, any>;
  embedding: number[];
  createdAt: Date;
}

export interface AdminUser {
  _id?: string;
  email: string;
  passwordHash: string;
  role: 'admin';
  createdAt: Date;
}
