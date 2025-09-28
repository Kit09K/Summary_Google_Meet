import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "email", 
            "profile",
            "https://www.googleapis.com/auth/drive.readonly",
            "https://www.googleapis.com/auth/drive.metadata.readonly",
            "https://www.googleapis.com/auth/calendar.readonly",
            "https://www.googleapis.com/auth/meetings.space.readonly",
            "https://www.googleapis.com/auth/drive.file"
          ].join(" "),
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      return session
    },
  },pages: {
    signIn: '/login',
    error: '/auth/error',
  },
})

// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           scope: [
//             "openid",
//             "email", 
//             "profile",
//             "https://www.googleapis.com/auth/drive.readonly",
//             "https://www.googleapis.com/auth/meetings.space.readonly",
//             "https://www.googleapis.com/auth/calendar.readonly",
//             "https://www.googleapis.com/auth/meetings.space.readonly"
//           ].join(" ")
//         }
//       }
//     })
//   ],
//   pages: {
//     signIn: '/login',
//   },
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token
//         token.refreshToken = account.refresh_token
//       }
//       return token
//     },
//     async session({ session, token }) {
//       token.accessToken = token.accessToken as string
//       return session
//     },
//     async redirect({ url, baseUrl }) {
//       // Redirect to dashboard after successful login
//       if (url.startsWith("/")) return `${baseUrl}${url}`
//       else if (new URL(url).origin === baseUrl) return url
//       return `${baseUrl}/dashboard`
//     },
//   }
// })