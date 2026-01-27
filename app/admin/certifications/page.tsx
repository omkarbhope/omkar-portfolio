import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDatabase } from '@/lib/mongodb';
import type { LicenseCertification } from '@/types';
import Link from 'next/link';
import CertificationsList from '@/components/admin/CertificationsList';

async function getCertifications(): Promise<LicenseCertification[]> {
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
}

export default async function AdminCertificationsPage() {
  try {
    await requireAuth();
  } catch {
    redirect('/admin/login');
  }

  const certifications = await getCertifications();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certifications</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your licenses and certifications
          </p>
        </div>
        <Link
          href="/admin/certifications/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Add Certification
        </Link>
      </div>

      <CertificationsList certifications={certifications} />
    </div>
  );
}
