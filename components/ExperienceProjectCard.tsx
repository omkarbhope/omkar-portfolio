'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Experience, ExperienceProject } from '@/types';
import { convertGoogleDriveUrl } from '@/lib/image-utils';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface ExperienceProjectCardProps {
  project: ExperienceProject;
  experienceId: string;
  projectIndex: number;
  experience: Experience;
}

export default function ExperienceProjectCard({
  project,
  experienceId,
  projectIndex,
  experience,
}: ExperienceProjectCardProps) {
  // Get first architecture diagram as preview, or use a placeholder
  const previewImage = project.architectureDiagrams && project.architectureDiagrams.length > 0
    ? convertGoogleDriveUrl(project.architectureDiagrams[0])
    : null;

  // Truncate description for card view
  const truncatedDescription = project.description.length > 150
    ? `${project.description.substring(0, 150)}...`
    : project.description;

  return (
    <Link href={`/experience/${experienceId}/projects/${projectIndex}`}>
      <Card hover className="h-full flex flex-col overflow-hidden group">
        {/* Preview Image */}
        {previewImage && (
          <div className="relative h-48 w-full overflow-hidden bg-[var(--background-secondary)]">
            <Image
              src={previewImage}
              alt={`${project.name} preview`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
              {project.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-tertiary)]">
              {experience.company}
            </p>
          </div>

          {/* Description */}
          <p className="mb-4 flex-1 text-sm text-[var(--text-secondary)] line-clamp-3">
            {truncatedDescription}
          </p>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="primary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 3 && (
                <Badge variant="default" className="text-xs">
                  +{project.technologies.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Metrics */}
          {project.metrics && Object.keys(project.metrics).length > 0 && (
            <div className="mb-4 text-xs text-[var(--text-tertiary)]">
              {Object.entries(project.metrics)
                .slice(0, 2)
                .map(([key, value]) => (
                  <div key={key} className="truncate">
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
            </div>
          )}

          {/* View Details Link */}
          <div className="mt-auto flex items-center gap-2 text-sm font-medium text-[var(--primary)] group-hover:gap-3 transition-all">
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
