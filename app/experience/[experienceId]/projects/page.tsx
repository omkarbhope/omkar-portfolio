import { getDatabase } from '@/lib/mongodb';
import type { Experience } from '@/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ExperienceProjectCard from '@/components/ExperienceProjectCard';
import ScrollReveal from '@/components/animations/ScrollReveal';

async function getExperience(experienceId: string): Promise<Experience | null> {
  try {
    const db = await getDatabase();
    const { ObjectId } = await import('mongodb');
    
    const experience = await db.collection<Experience>('experiences').findOne({
      _id: new ObjectId(experienceId) as any,
    });

    if (!experience) {
      return null;
    }

    return {
      ...experience,
      _id: experience._id?.toString(),
    };
  } catch (error) {
    console.error('Error fetching experience:', error);
    return null;
  }
}

export default async function ExperienceProjectsPage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  const experience = await getExperience(experienceId);

  if (!experience) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <p className="text-[var(--text-tertiary)]">Experience not found.</p>
          <Link
            href="/experience"
            className="mt-4 inline-flex items-center text-[var(--primary)] hover:underline"
          >
            ← Back to Experience
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/experience"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Experience
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Projects at {experience.company}
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          {experience.position} • {experience.projects.length} Project{experience.projects.length > 1 ? 's' : ''}
        </p>
      </div>

      {experience.projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experience.projects.map((project, index) => (
            <ScrollReveal key={index} delay={index * 0.1} direction="up">
              <ExperienceProjectCard
                project={project}
                experienceId={experienceId}
                projectIndex={index}
                experience={experience}
              />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <p className="text-[var(--text-tertiary)]">No projects found for this experience.</p>
        </div>
      )}
    </div>
  );
}
