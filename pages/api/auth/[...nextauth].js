import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                Email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const res = await fetch("http://localhost:3000/api/login", {
                    method: 'POST',
                    body: JSON.stringify({
                        Email: credentials?.Email,
                        password: credentials?.password,
                    }),
                    headers: { "Content-Type": "application/json" }
                })
                const data = await res.json()
                
                if (data.status == "ok") {
                    return data.user
                }
                return null
            }
        })

    ], secret: '39c6bc1c70e1ca5898cff76d4fda33f2',
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                token.accessToken = account.access_token
                token.user = user
            }
            return token
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            session.user = token.user
            return session
        }
    }
}
export default NextAuth(authOptions)