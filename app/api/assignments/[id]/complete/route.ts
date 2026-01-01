import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role === 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const aiDetectionScreenshot = formData.get('aiDetectionScreenshot') as File

    if (!aiDetectionScreenshot) {
      return NextResponse.json(
        { error: 'AI detection screenshot is required' },
        { status: 400 }
      )
    }

    // Verify assignment belongs to user
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: params.id,
        assignedToId: session.user.id
      },
      include: {
        department: true
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Handle AI detection screenshot upload
    let screenshotPath = ''
    if (aiDetectionScreenshot.size > 0) {
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'ai-detection')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      
      const bytes = await aiDetectionScreenshot.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const timestamp = Date.now()
      const filename = `ai-detection-${timestamp}-${aiDetectionScreenshot.name}`
      const filepath = join(uploadsDir, filename)
      
      await writeFile(filepath, buffer)
      screenshotPath = `/uploads/ai-detection/${filename}`
    }

    // Update assignment status and add AI detection screenshot
    const updatedAssignment = await prisma.assignment.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        aiDetectionScreenshot: screenshotPath,
        updatedAt: new Date()
      },
      include: {
        department: true,
        assignedTo: true
      }
    })

    // Update user's balance and earnings
    const serviceFee = assignment.department.serviceFee
    const commission = Math.floor(serviceFee * 0.8) // 80% to maker, 20% platform fee

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        balance: { increment: commission },
        totalEarnings: { increment: commission }
      }
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        amount: commission,
        type: 'COMMISSION',
        status: 'COMPLETED',
        assignmentId: params.id,
        userId: session.user.id
      }
    })

    return NextResponse.json({
      message: 'Assignment completed successfully',
      assignment: updatedAssignment,
      commission
    })
  } catch (error) {
    console.error('Error completing assignment:', error)
    return NextResponse.json(
      { error: 'Failed to complete assignment' },
      { status: 500 }
    )
  }
}