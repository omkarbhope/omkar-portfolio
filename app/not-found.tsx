import Link from 'next/link';
import { Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--text-primary)]">404</h1>
        <p className="mt-4 text-lg text-[var(--text-secondary)]">
          Page not found
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="primary" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
