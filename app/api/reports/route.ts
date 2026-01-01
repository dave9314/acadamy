import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Dynamic import to handle potential Prisma client issues
let prisma: any;
try {
  prisma = require('@/lib/prisma').prisma;
} catch (error) {
  console.error('Prisma import error:', error);
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available. Please try again later.' },
        { status: 503 }
      )
    }

    const body = await request.json()

    const {
      title,
      description,
      assignmentId,
      reportedUserId,
      reporterName,
      reporterEmail,
      reporterPhone
    } = body

    if (!title || !description || !reporterName) {
      return NextResponse.json(
        { error: 'Title, description, and reporter name are required' },
        { status: 400 }
      )
    }

    // Check if Report model exists
    if (!prisma.report) {
      return NextResponse.json(
        { error: 'Reports feature is currently unavailable. Please contact support.' },
        { status: 503 }
      )
    }

    const report = await prisma.report.create({
      data: {
        title,
        description,
        assignmentId: assignmentId || null,
        reportedUserId: reportedUserId || null,
        reporterName,
        reporterEmail: reporterEmail || null,
        reporterPhone: reporterPhone || null,
        status: 'PENDING'
      },
      include: {
        assignment: {
          include: {
            assignedTo: true,
            department: true
          }
        },
        reportedUser: true
      }
    })

    return NextResponse.json({ 
      message: 'Report submitted successfully',
      report 
    })
  } catch (error) {
    console.error('Error creating report:', error)
    
    // Check if it's a Prisma-related error
    if (error.message?.includes('Unknown arg') || error.message?.includes('report')) {
      return NextResponse.json(
        { error: 'Reports feature is temporarily unavailable. Please try again later or contact support.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create report. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if Report model exists
    if (!prisma.report) {
      return NextResponse.json(
        { error: 'Reports feature is currently unavailable' },
        { status: 503 }
      )
    }

    const reports = await prisma.report.findMany({
      include: {
        assignment: {
          include: {
            assignedTo: true,
            department: true
          }
        },
        reportedUser: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}