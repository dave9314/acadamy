import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          if (credentials.userType === 'admin') {
            const admin = await prisma.admin.findUnique({
              where: { email: credentials.email }
            })

            if (!admin) return null

            const isValidPassword = await bcrypt.compare(
              credentials.password,
              admin.password
            )

            if (!isValidPassword) return null

            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: 'admin'
            }
          } else {
            const user = await prisma.user.findUnique({
              where: { email: credentials.email },
              include: { department: true }
            })

            if (!user) return null

            const isValidPassword = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!isValidPassword) return null

            if (!user.isApproved) {
              throw new Error('Account pending admin approval')
            }

            if (!user.paymentApproved) {
              throw new Error('Payment pending admin approval')
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: 'user',
              isApproved: user.isApproved,
              registrationFee: user.registrationFee,
              paymentApproved: user.paymentApproved,
              department: user.department?.name || ''
            }
          }
        } catch (error) {
          console.error('Auth error:', error)
          if (error instanceof Error) {
            throw error
          }
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.isApproved = user.isApproved
        token.registrationFee = user.registrationFee
        token.paymentApproved = user.paymentApproved
        token.department = user.department
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.isApproved = token.isApproved as boolean | undefined
        session.user.registrationFee = token.registrationFee as boolean | undefined
        session.user.paymentApproved = token.paymentApproved as boolean | undefined
        session.user.department = token.department as string | undefined
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout'
  },
  secret: process.env.NEXTAUTH_SECRET,
}