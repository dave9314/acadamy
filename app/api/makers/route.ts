import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get('departmentId')
    
    let whereClause: any = {
      isApproved: true,
      paymentApproved: true
    }

    // If departmentId is provided, filter by department
    if (departmentId) {
      whereClause.departmentId = departmentId
    }

    const makers = await prisma.user.findMany({
      where: whereClause,
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