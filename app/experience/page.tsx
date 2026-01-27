import { getDatabase } from '@/lib/mongodb';
import type { Experience } from '@/types';
import ExperienceTimeline from '@/components/ExperienceTimeline';

async function getExperiences(): Promise<Experience[]> {
  try {
    const db = await getDatabase();
    const experiences = await db
      .collection<Experience>('experiences')
      .find({})
      .sort({ startDate: -1 })
      .toArray();
    
    return experiences.map((exp) => ({
      ...exp,
      _id: exp._id?.toString(),
    }));
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Experience</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          My professional journey across companies, highlighting key projects and achievements
        </p>
      </div>

      {experiences.length > 0 ? (
        <ExperienceTimeline experiences={experiences} />
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <p className="text-[var(--text-tertiary)]">No experience entries found. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
