import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      role: number
      access_token: string
      user_name: string
      image?: string
      status: number
    } & DefaultSession["user"]
  }

  interface User {
    id: number
    role: number
    access_token: string
    user_name: string
    image?: string
    status: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: number
    access_token: string
  }
}