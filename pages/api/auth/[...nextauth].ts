import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

import prisma from "utils/database/prisma";

const refreshAccessToken = async (token) => {
  console.log("i want a new token please");
};

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      profile(profile) {
        console.log("profile", { profile });
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images?.[0]?.url,
        };
      },
    }),
    // ...add more providers here
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),

  session: {
    jwt: true,
  },

  callbacks: {
    async jwt(token, user, account) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.accessToken,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      } else {
        console.log("access token still valid");
        console.log("TOKEN", { token });
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session(session, user) {
      // console.log("SESSION", { session, user });
      session.user = user;
      return session;
    },
  },
  database: process.env.DB_PATH,
});
