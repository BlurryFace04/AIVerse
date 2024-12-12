import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDB } from '@/utils/database';
import User from '@/models/user';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Solana',
      credentials: {
        address: { label: 'Address', type: 'text' },
      },
      async authorize(credentials) {
        console.log("Received login request");
        if (!credentials?.address) {
          return null;
        }

        console.log('credentials:', credentials);

        return {
          id: credentials.address,
          name: credentials.name,
          username: credentials.username,
          image: credentials.image
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      const sessionUser = await User.findOne({ address: token.sub });

      if (session.user && sessionUser) {
        session.user.address = sessionUser.address;
        session.user.id = sessionUser._id;
        session.user.username = sessionUser.username;
        if (sessionUser.name) session.user.name = sessionUser.name;
        if (sessionUser.profilePicture)
          session.user.image = sessionUser.profilePicture;
      }

      return session;
    },
    async signIn({ user }) {
      // return true;

      try {
        await connectToDB();

        const address = user.id;
        const username = user.username;
        const name = user.name;
        const profilePicture = user.image;

        console.log("address: ", address);
        console.log("username: ", username);
        console.log("name: ", name);
        console.log("profilePicture: ", profilePicture);

        const userExists = await User.findOne({ address });

        if (!userExists) {
          if (!username) {
            throw new Error('No username provided for a new user.');
          }
          await User.create({
            address,
            username,
            name,
            profilePicture,
            timestamp: new Date(),
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
