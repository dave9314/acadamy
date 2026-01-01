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

    const { isApproved, registrationFee, paymentApproved } = await request.json()
    const userId = params.id

    const updateData: any = {}
    if (typeof isApproved === 'boolean') {
      updateData.isApproved = isApproved
    }
    if (typeof registrationFee === 'boolean') {
      updateData.registrationFee = registrationFee
    }
    if (typeof paymentApproved === 'boolean') {
      updateData.paymentApproved = paymentApproved
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        department: true
      }
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const userId = params.id

    // Check if user has any assignments
    const userAssignments = await prisma.assignment.count({
      where: { assignedToId: userId }
    })

    if (userAssignments > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with existing assignments. Please reassign or complete assignments first.' },
        { status: 400 }
      )
    }

    // Delete related records first
    await prisma.payment.deleteMany({
      where: { userId: userId }
    })

    await prisma.userAnnouncement.deleteMany({
      where: { userId: userId }
    })

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    })
    
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}