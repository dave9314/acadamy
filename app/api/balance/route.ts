import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role === 'admin') {
      // Admin dashboard - get platform statistics
      const totalUsers = await prisma.user.count({
        where: { isApproved: true }
      })

      const totalAssignments = await prisma.assignment.count()
      
      const completedAssignments = await prisma.assignment.count({
        where: { status: 'COMPLETED' }
      })

      const totalRevenue = await prisma.payment.aggregate({
        where: { 
          type: 'REGISTRATION_FEE',
          status: 'COMPLETED'
        },
        _sum: { amount: true }
      })

      const pendingPayments = await prisma.payment.count({
        where: { status: 'PENDING' }
      })

      const recentAssignments = await prisma.assignment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: {
            select: { name: true, email: true }
          },
          department: {
            select: { name: true }
          }
        }
      })

      return NextResponse.json({
        totalUsers,
        totalAssignments,
        completedAssignments,
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingPayments,
        recentAssignments
      })
    } else {
      // User dashboard - get personal balance and earnings
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          balance: true,
          totalEarnings: true,
          assignments: {
            where: { status: 'COMPLETED' },
            include: {
              department: {
                select: { serviceFee: true }
              }
            }
          }
        }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const completedAssignments = user.assignments.length
      const pendingAssignments = await prisma.assignment.count({
        where: {
          assignedToId: session.user.id,
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        }
      })

      return NextResponse.json({
        balance: user.balance,
        totalEarnings: user.totalEarnings,
        completedAssignments,
        pendingAssignments,
        recentAssignments: user.assignments.slice(0, 5)
      })
    }
  } catch (error) {
    console.error('Error fetching balance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    )
  }
}