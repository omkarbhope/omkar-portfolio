import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';
import { getDatabase } from '@/lib/mongodb';
import type { AdminUser } from '@/types';
import bcrypt from 'bcryptjs';

const authConfig = {
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          const db = await getDatabase();
          const admin = await db.collection<AdminUser>('adminUsers').findOne({
            email: credentials.email as string,
          });

          if (!admin) {
            console.log('Admin user not found:', credentials.email);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            admin.passwordHash
          );

          if (!isValid) {
            console.log('Invalid password for:', credentials.email);
            return null;
          }

          console.log('Authentication successful for:', credentials.email);
          return {
            id: admin._id?.toString(),
            email: admin.email,
            role: admin.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = (user as User & { role: string }).role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as Session['user'] & { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const { GET, POST } = handlers;
