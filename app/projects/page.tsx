import { getDatabase } from '@/lib/mongodb';
import type { Project } from '@/types';
import ProjectCard from '@/components/ProjectCard';

async function getProjects(): Promise<Project[]> {
  try {
    const db = await getDatabase();
    const projects = await db
      .collection<Project>('projects')
      .find({})
      .sort({ featured: -1, createdAt: -1 })
      .toArray();
    
    return projects.map((project) => ({
      ...project,
      _id: project._id?.toString(),
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Projects</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          A collection of my work showcasing full-stack development, AI/ML solutions, and infrastructure automation
        </p>
      </div>

      {featuredProjects.length > 0 && (
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-[var(--text-primary)]">
            Featured Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        </div>
      )}

      {otherProjects.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-[var(--text-primary)]">
            All Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={featuredProjects.length + index} />
            ))}
          </div>
        </div>
      )}

      {projects.length === 0 && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <p className="text-[var(--text-tertiary)]">No projects found. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
