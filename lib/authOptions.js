import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();
      await User.findOneAndUpdate(
        { email: user.email },
        { name: user.name, image: user.image, googleId: account.providerAccountId },
        { upsert: true, new: true }
      );
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) token.userId = dbUser._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId;
      return session;
    },
  },
};
