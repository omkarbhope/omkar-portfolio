import { getDatabase } from '@/lib/mongodb';
import type { Education } from '@/types';
import EducationTimeline from '@/components/EducationTimeline';

async function getEducation(): Promise<Education[]> {
  try {
    const db = await getDatabase();
    const education = await db
      .collection<Education>('education')
      .find({})
      .sort({ endDate: -1 })
      .toArray();
    
    return education.map((edu) => ({
      ...edu,
      _id: edu._id?.toString(),
    }));
  } catch (error) {
    console.error('Error fetching education:', error);
    return [];
  }
}

export default async function EducationPage() {
  const education = await getEducation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Education</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Academic background, coursework, and achievements
        </p>
      </div>

      {education.length > 0 ? (
        <EducationTimeline education={education} />
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <p className="text-[var(--text-tertiary)]">No education entries found. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
