import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, targetType, targetUserId } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create the announcement
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        targetType: targetType || 'ALL',
        targetUserId: targetType === 'SPECIFIC_USER' ? targetUserId : null
      }
    })

    // Create user announcements based on target type
    if (targetType === 'SPECIFIC_USER' && targetUserId) {
      await prisma.userAnnouncement.create({
        data: {
          userId: targetUserId,
          announcementId: announcement.id
        }
      })
    } else {
      // Send to all approved users
      const users = await prisma.user.findMany({
        where: { isApproved: true },
        select: { id: true }
      })

      const userAnnouncements = users.map(user => ({
        userId: user.id,
        announcementId: announcement.id
      }))

      await prisma.userAnnouncement.createMany({
        data: userAnnouncements
      })
    }

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    )
  }
}

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
      // Admin sees all announcements
      const announcements = await prisma.announcement.findMany({
        include: {
          userAnnouncements: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(announcements)
    } else {
      // Users see their announcements
      const userAnnouncements = await prisma.userAnnouncement.findMany({
        where: { userId: session.user.id },
        include: {
          announcement: true
        },
        orderBy: { announcement: { createdAt: 'desc' } }
      })

      return NextResponse.json(userAnnouncements)
    }
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}