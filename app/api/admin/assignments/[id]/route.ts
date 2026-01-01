import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { isApprovedByAdmin, status, solutionDelivered } = await request.json()
    const assignmentId = params.id

    const updateData: any = {}
    if (typeof isApprovedByAdmin === 'boolean') {
      updateData.isApprovedByAdmin = isApprovedByAdmin
      // If rejecting, set status to REJECTED
      if (!isApprovedByAdmin) {
        updateData.status = 'REJECTED'
      } else if (status !== 'COMPLETED') {
        updateData.status = 'IN_PROGRESS'
      }
    }
    if (status) {
      updateData.status = status
    }
    if (typeof solutionDelivered === 'boolean') {
      updateData.solutionDelivered = solutionDelivered
    }

    const assignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: updateData,
      include: {
        department: true,
        assignedTo: true
      }
    })

    // If admin approves a completed assignment with AI detection, finalize the payment
    if (isApprovedByAdmin && assignment.status === 'COMPLETED' && assignment.aiDetectionScreenshot) {
      // Ensure payment is marked as completed
      await prisma.payment.updateMany({
        where: {
          assignmentId: assignmentId,
          type: 'COMMISSION'
        },
        data: {
          status: 'COMPLETED'
        }
      })
    }
    
    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    )
  }
}