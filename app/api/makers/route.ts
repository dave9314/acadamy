import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get('departmentId')
    
    if (!departmentId) {
      return NextResponse.json(
        { error: 'Department ID is required' },
        { status: 400 }
      )
    }

    const makers = await prisma.user.findMany({
      where: {
        departmentId,
        isApproved: true,
        paymentApproved: true
      },
      include: {
        department: true
      },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(makers)
  } catch (error) {
    console.error('Error fetching makers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignment makers' },
      { status: 500 }
    )
  }
}