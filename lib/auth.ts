import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
