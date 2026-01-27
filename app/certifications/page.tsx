import { getDatabase } from '@/lib/mongodb';
import type { LicenseCertification } from '@/types';
import CertificationsList from '@/components/CertificationsList';

async function getCertifications(): Promise<LicenseCertification[]> {
  try {
    const db = await getDatabase();
    const certifications = await db
      .collection<LicenseCertification>('licensesCertifications')
      .find({})
      .sort({ issueDate: -1 })
      .toArray();
    
    return certifications.map((cert) => ({
      ...cert,
      _id: cert._id?.toString(),
    }));
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
}

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Licenses & Certifications
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Professional certifications and licenses that validate my expertise
        </p>
      </div>

      {certifications.length > 0 ? (
        <CertificationsList certifications={certifications} />
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          <p className="text-[var(--text-tertiary)]">
            No certifications found. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
