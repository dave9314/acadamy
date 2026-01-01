import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { error } from 'console'

export async function POST(request: NextRequest) {
  try {
    console.error('Registration error:', error)
    
    let body: any = {}
    let paymentScreenshot: File | null = null
    
    // Check content type to determine how to parse the request
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with file upload)
      const formData = await request.formData()
      
      // Extract all form fields
      body = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        telegramUsername: formData.get('telegramUsername') as string,
        whatsappNumber: formData.get('whatsappNumber') as string,
        departmentId: formData.get('departmentId') as string,
        paymentMethod: formData.get('paymentMethod') as string,
        userType: formData.get('userType') as string || 'user'
      }
      
      paymentScreenshot = formData.get('paymentScreenshot') as File | null
      console.log('FormData parsed:', { ...body, hasScreenshot: !!paymentScreenshot })
    } else {
      // Handle JSON data
      body = await request.json()
      console.log('JSON data parsed:', body)
    }
    
    const { 
      email, 
      password, 
      name, 
      phone, 
      telegramUsername, 
      whatsappNumber, 
      departmentId, 
      userType,
      paymentMethod
    } = body

    console.log('Processing registration for:', email, 'Type:', userType)

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Admin registration
    if (userType === 'admin') {
      console.log('Processing admin registration')
      
      const existingAdmin = await prisma.admin.findUnique({
        where: { email }
      })

      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Admin with this email already exists' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          name: name || 'Admin'
        }
      })

      console.log('Admin created successfully:', admin.id)
      return NextResponse.json({
        message: 'Admin registered successfully',
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name
        }
      })
    } 
    
    // User registration
    console.log('Processing user registration')
    
    if (!name || !phone || !departmentId) {
      console.log('Missing required user fields')
      return NextResponse.json(
        { error: 'Name, phone, and department are required' },
        { status: 400 }
      )
    }

    // Validate contact methods
    const hasValidTelegram = telegramUsername && telegramUsername.length >= 3
    const hasValidWhatsApp = whatsappNumber && whatsappNumber.length >= 8
    
    if (!hasValidTelegram && !hasValidWhatsApp) {
      console.log('Invalid contact methods')
      return NextResponse.json(
        { error: 'Either Telegram username (min 3 characters) or WhatsApp number (min 8 digits) is required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Verify department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    })

    if (!department) {
      console.log('Invalid department')
      return NextResponse.json(
        { error: 'Invalid department selected' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    let screenshotPath = null
    
    // Handle file upload if present
    if (paymentScreenshot && paymentScreenshot.size > 0) {
      console.log('Processing payment screenshot upload')
      
      try {
        const bytes = await paymentScreenshot.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Create unique filename
        const filename = `payment_${Date.now()}_${paymentScreenshot.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const uploadsDir = join(process.cwd(), 'public', 'uploads')
        const filePath = join(uploadsDir, filename)
        
        // Ensure uploads directory exists
        try {
          await mkdir(uploadsDir, { recursive: true })
        } catch (error) {
          // Directory might already exist
        }
        
        await writeFile(filePath, buffer)
        screenshotPath = `/uploads/${filename}`
        console.log('Screenshot saved:', screenshotPath)
      } catch (fileError) {
        console.error('File upload error:', fileError)
        return NextResponse.json(
          { error: 'Failed to upload payment screenshot' },
          { status: 500 }
        )
      }
    }

    // Create user
    console.log('Creating user in database')
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        telegramUsername: telegramUsername || null,
        whatsappNumber: whatsappNumber || null,
        departmentId,
        isApproved: false,
        registrationFee: false,
        paymentMethod: paymentMethod || null,
        paymentScreenshot: screenshotPath,
        paymentApproved: false
      },
      include: {
        department: true
      }
    })

    console.log('User created successfully:', user.id)
    
    return NextResponse.json({
      message: paymentScreenshot 
        ? 'Registration successful! Please wait for admin approval of your payment and account.'
        : 'User registered successfully. Please wait for admin approval.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department?.name,
        isApproved: user.isApproved,
        paymentApproved: user.paymentApproved
      }
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }
      
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Invalid department selected' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}