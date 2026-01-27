import AIHero from "@/components/AIHero";
import ScrollSections from "@/components/ScrollSections";
import { getDatabase } from '@/lib/mongodb';
import type { Skill } from '@/types';

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

export default async function Home() {
  const skills = await getSkills();

  return (
    <div className="bg-[var(--background)]">
      <AIHero skills={skills} />
      <ScrollSections />
    </div>
  );
}
