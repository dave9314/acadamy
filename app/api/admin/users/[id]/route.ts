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