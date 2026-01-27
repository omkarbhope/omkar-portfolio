import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDatabase } from '@/lib/mongodb';

async function getStats() {
  const db = await getDatabase();
  const [projects, experiences, education, skills, certifications, awards] = await Promise.all([
    db.collection('projects').countDocuments(),
    db.collection('experiences').countDocuments(),
    db.collection('education').countDocuments(),
    db.collection('skills').countDocuments(),
    db.collection('licensesCertifications').countDocuments(),
    db.collection('awards').countDocuments(),
  ]);

  return { projects, experiences, education, skills, certifications, awards };
}

export default async function AdminDashboard() {
  try {
    await requireAuth();
  } catch {
    redirect('/admin/login');
  }

  const stats = await getStats();

  const menuItems = [
    { href: '/admin/projects', label: 'Projects', count: stats.projects },
    { href: '/admin/experiences', label: 'Experiences', count: stats.experiences },
    { href: '/admin/education', label: 'Education', count: stats.education },
    { href: '/admin/skills', label: 'Skills', count: stats.skills },
    { href: '/admin/certifications', label: 'Certifications', count: stats.certifications },
    { href: '/admin/awards', label: 'Awards', count: stats.awards },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Manage your portfolio content
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-lg border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--primary)]"
          >
            <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
              {item.label}
            </h3>
            <p className="mt-2 text-3xl font-bold text-[var(--primary)]">
              {item.count}
            </p>
            <p className="mt-1 text-sm text-[var(--text-tertiary)]">
              Manage {item.label.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
