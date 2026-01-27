import { getDatabase } from '@/lib/mongodb';
import type { Skill } from '@/types';
import SkillsShowcase from '@/components/SkillsShowcase';

async function getSkills(): Promise<Skill[]> {
  try {
    const db = await getDatabase();
    const skills = await db
      .collection<Skill>('skills')
      .find({})
      .sort({ category: 1, proficiency: -1 })
      .toArray();
    
    return skills.map((skill) => ({
      ...skill,
      _id: skill._id?.toString(),
    }));
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export default async function SkillsPage() {
  const skills = await getSkills();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Skills</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Technical skills across languages, frameworks, databases, AI/ML, and infrastructure
        </p>
      </div>

      {skills.length > 0 ? (
        <SkillsShowcase skills={skills} />
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <p className="text-[var(--text-tertiary)]">No skills found. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
