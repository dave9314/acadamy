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

    const { name, description, serviceFee } = await request.json()
    const departmentId = params.id

    const department = await prisma.department.update({
      where: { id: departmentId },
      data: {
        name,
        description,
        serviceFee: parseInt(serviceFee)
      }
    })
    
    return NextResponse.json(department)
  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json(
      { error: 'Failed to update department' },
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

    const departmentId = params.id

    // Check if department has users
    const usersCount = await prisma.user.count({
      where: { departmentId }
    })

    if (usersCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete department with existing users' },
        { status: 400 }
      )
    }

    await prisma.department.delete({
      where: { id: departmentId }
    })
    
    return NextResponse.json({ message: 'Department deleted successfully' })
  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    )
  }
}