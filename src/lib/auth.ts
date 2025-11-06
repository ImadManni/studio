import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing required environment variables for Google OAuth');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token as string | undefined;
        // user fields coming from providers may be null - coerce to strings when present
        if (typeof user.id === 'string') token.id = user.id;
        if (typeof (user as any).role === 'string') token.role = (user as any).role;
        if (typeof (user as any).createdAt === 'string') token.createdAt = (user as any).createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Only assign when values are present to satisfy strict typings
        if (typeof token.id === 'string') session.user.id = token.id;
        if (typeof token.role === 'string') session.user.role = token.role;
        if (typeof token.accessToken === 'string') (session as any).accessToken = token.accessToken;
        if (typeof token.createdAt === 'string') session.user.createdAt = token.createdAt;
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log('User signed in:', message.user?.email);
    },
    // Note: NextAuth's events typing can be strict; avoid adding an 'error' event handler here
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
};