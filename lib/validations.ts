import { z } from 'zod';

// Project validation schema
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  achievements: z.array(z.string()).min(1, 'At least one achievement is required'),
  metrics: z.record(z.union([z.string(), z.number()])).optional(),
  demoUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string()).default([]),
  architectureDiagrams: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Experience validation schema
export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  projects: z.array(z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Description is required'),
    technologies: z.array(z.string()).default([]),
    metrics: z.record(z.union([z.string(), z.number()])).optional(),
    architectureDiagrams: z.union([z.string(), z.array(z.string())]).optional().default(''),
  })).default([]),
  technologies: z.array(z.string()).default([]),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

// Education validation schema
export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  gpa: z.number().optional(),
  gpaScale: z.number().optional(),
  courses: z.array(z.string()).default([]),
  honors: z.array(z.string()).default([]),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// Skill validation schema
export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['Languages', 'Web Dev', 'Databases', 'AI/ML', 'Infrastructure', 'DevOps']),
  proficiency: z.number().min(1).max(5, 'Proficiency must be between 1 and 5'),
  icon: z.string().optional(),
});

export type SkillFormData = z.infer<typeof skillSchema>;

// Certification validation schema
export const certificationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  verificationUrl: z.string().url().optional().or(z.literal('')),
  badgeUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
});

export type CertificationFormData = z.infer<typeof certificationSchema>;

// Award validation schema
export const awardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  category: z.enum(['Academic', 'Professional', 'Other']),
  description: z.string().min(1, 'Description is required'),
  significance: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export type AwardFormData = z.infer<typeof awardSchema>;
