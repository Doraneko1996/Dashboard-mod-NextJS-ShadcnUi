import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authConfig = {
    pages: {
        signIn: "/",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.user_name = user.user_name
                token.access_token = user.access_token
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as number
                session.user.access_token = token.access_token as string
                session.user.user_name = token.user_name as string
            }
            return session
        }
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            user_name: credentials?.username,
                            password: credentials?.password,
                        }),
                    })

                    const data = await res.json()

                    if (!res.ok) {
                        throw new Error(data.message)
                    }

                    return {
                        id: data.user.id,
                        name: `${data.user.first_name} ${data.user.last_name}`,
                        email: data.user.email,
                        role: data.user.role,
                        access_token: data.access_token,
                        first_name: data.user.first_name,
                        last_name: data.user.last_name,
                        user_name: data.user.user_name,
                        image: data.user.image,
                        status: data.user.status
                    }
                } catch (error: any) {
                    throw new Error(error.message)
                }
            }
        })
    ]
} satisfies NextAuthConfig