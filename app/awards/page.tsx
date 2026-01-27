import { getDatabase } from '@/lib/mongodb';
import type { Award } from '@/types';
import AwardsList from '@/components/AwardsList';

async function getAwards(): Promise<Award[]> {
  try {
    const db = await getDatabase();
    const awards = await db
      .collection<Award>('awards')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return awards.map((award) => ({
      ...award,
      _id: award._id?.toString(),
    }));
  } catch (error) {
    console.error('Error fetching awards:', error);
    return [];
  }
}

export default async function AwardsPage() {
  const awards = await getAwards();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Awards</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Recognition and honors received for academic and professional achievements
        </p>
      </div>

      {awards.length > 0 ? (
        <AwardsList awards={awards} />
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <p className="text-[var(--text-tertiary)]">No awards found. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
