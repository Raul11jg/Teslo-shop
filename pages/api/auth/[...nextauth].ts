import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from '../../../database';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'correo@mail.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials) {
        const user = await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
        if (user) {
          return { ...user, id: user._id };
        }
        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accesToken = account.access_token;

        switch (account.type) {
          case 'oauth':
            //TODO: check if user exists
            break;
          case 'credentials':
            token.user = user;
            break;
        }
      }
      return token;
    },

    async session({ session, token, user }) {
      session.accessToken = token.accessToken as any;
      session.user = token.user as any;
      return session;
    },
  },
};

export default NextAuth(authOptions);
