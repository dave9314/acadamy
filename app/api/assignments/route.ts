import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const comments = formData.get('comments') as string
    const submitterName = formData.get('submitterName') as string
    const submitterPhone = formData.get('submitterPhone') as string
    const submitterEmail = formData.get('submitterEmail') as string
    const submitterTelegram = formData.get('submitterTelegram') as string
    const submitterWhatsApp = formData.get('submitterWhatsApp') as string
    const departmentId = formData.get('departmentId') as string
    const assignedToId = formData.get('assignedToId') as string
    
    // Validate required fields
    if (!title || !description || !departmentId || !assignedToId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate that at least one contact method is provided
    if ((!submitterTelegram || submitterTelegram.length < 3) && 
        (!submitterWhatsApp || submitterWhatsApp.length < 8)) {
      return NextResponse.json(
        { error: 'Either Telegram username or WhatsApp number is required for communication' },
        { status: 400 }
      )
    }

    // Handle file uploads
    const files = formData.getAll('files') as File[]
    const uploadedFiles: string[] = []
    
    if (files.length > 0) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      
      for (const file of files) {
        if (file.size > 0) {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          // Generate unique filename
          const timestamp = Date.now()
          const filename = `${timestamp}-${file.name}`
          const filepath = join(uploadsDir, filename)
          
          await writeFile(filepath, buffer)
          uploadedFiles.push(`/uploads/${filename}`)
        }
      }
    }

    // Create assignment in database
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        comments: comments || null,
        submitterName: submitterName || null,
        submitterPhone: submitterPhone || null,
        submitterEmail: submitterEmail || null,
        submitterTelegram: submitterTelegram || null,
        submitterWhatsApp: submitterWhatsApp || null,
        files: uploadedFiles,
        departmentId,
        assignedToId,
        status: 'PENDING'
      },
      include: {
        department: true,
        assignedTo: true
      }
    })

    return NextResponse.json({
      message: 'Assignment submitted successfully',
      code: assignment.code,
      assignment
    })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to submit assignment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let whereClause = {}
    
    if (userId) {
      whereClause = { assignedToId: userId }
    }

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: {
        department: true,
        assignedTo: true,
        aiDetectionReport: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}