import { getDatabase } from '@/lib/mongodb';
import type { Experience } from '@/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { convertGoogleDriveUrl } from '@/lib/image-utils';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ArchitectureDiagramImage from '@/components/ArchitectureDiagramImage';

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

export default async function ExperienceProjectDetailPage({
  params,
}: {
  params: Promise<{ experienceId: string; projectIndex: string }>;
}) {
  const { experienceId, projectIndex } = await params;
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

  const index = parseInt(projectIndex, 10);
  const project = experience.projects[index];

  if (!project) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <p className="text-[var(--text-tertiary)]">Project not found.</p>
          <Link
            href={`/experience/${experienceId}/projects`}
            className="mt-4 inline-flex items-center text-[var(--primary)] hover:underline"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href={`/experience/${experienceId}/projects`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <ScrollReveal delay={0} direction="up">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            {project.name}
          </h1>
          <p className="mt-2 text-lg text-[var(--text-secondary)]">
            {experience.position} at {experience.company}
          </p>
        </div>

        {/* Description */}
        <div className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
            About This Project
          </h2>
          <div className="prose prose-sm max-w-none text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
            {project.description}
          </div>
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
              Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="primary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        {project.metrics && Object.keys(project.metrics).length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
              Key Metrics
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(project.metrics).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-4"
                >
                  <div className="text-sm text-[var(--text-tertiary)]">{key}</div>
                  <div className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architecture Diagrams */}
        {project.architectureDiagrams && project.architectureDiagrams.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
              Architecture Diagrams
            </h2>
            <div className="grid gap-4 sm:grid-cols-1">
              {project.architectureDiagrams.map((diagram, diagramIndex) => {
                const imageUrl = convertGoogleDriveUrl(diagram);
                return (
                  <ScrollReveal
                    key={diagramIndex}
                    delay={diagramIndex * 0.1}
                    direction="up"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
                      <ArchitectureDiagramImage
                        src={imageUrl}
                        alt={`Architecture diagram ${diagramIndex + 1} for ${project.name}`}
                        originalUrl={diagram}
                      />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
