import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'user') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's department
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { department: true }
    })

    if (!user || !user.isApproved) {
      return NextResponse.json(
        { error: 'User not approved' },
        { status: 403 }
      )
    }

    // Get available assignments in user's department that are:
    // 1. Approved by admin
    // 2. Not assigned to anyone yet OR assigned to this user
    // 3. Not completed
    const availableAssignments = await prisma.assignment.findMany({
      where: {
        departmentId: user.departmentId,
        isApprovedByAdmin: true,
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        },
        OR: [
          { assignedToId: null },
          { assignedToId: user.id }
        ]
      },
      include: {
        department: true,
        assignedTo: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(availableAssignments)
  } catch (error) {
    console.error('Error fetching available assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available assignments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'user') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { assignmentId } = await request.json()

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    // Check if assignment exists and is available
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { department: true }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    if (!assignment.isApprovedByAdmin) {
      return NextResponse.json(
        { error: 'Assignment not approved by admin' },
        { status: 400 }
      )
    }

    if (assignment.assignedToId && assignment.assignedToId !== session.user.id) {
      return NextResponse.json(
        { error: 'Assignment already assigned to another maker' },
        { status: 400 }
      )
    }

    // Assign the assignment to the current user
    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        assignedToId: session.user.id,
        status: 'IN_PROGRESS'
      },
      include: {
        department: true,
        assignedTo: true
      }
    })
    
    return NextResponse.json({
      message: 'Assignment accepted successfully',
      assignment: updatedAssignment
    })
  } catch (error) {
    console.error('Error accepting assignment:', error)
    return NextResponse.json(
      { error: 'Failed to accept assignment' },
      { status: 500 }
    )
  }
}