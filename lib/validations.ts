export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateUserRegistration(data: {
  name: string
  email: string
  password: string
  phone: string
  telegramUsername: string
  whatsappNumber: string
  departmentId: string
}): ValidationResult {
  const errors: string[] = []

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Please provide a valid email address')
  }

  // Password validation
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  // Phone validation
  const phoneRegex = /^\+?[1-9]\d{8,14}$/
  if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
    errors.push('Please provide a valid phone number')
  }

  // Telegram username OR WhatsApp number validation (at least one required for solution delivery)
  if ((!data.telegramUsername || data.telegramUsername.length < 3) && 
      (!data.whatsappNumber || !phoneRegex.test(data.whatsappNumber.replace(/\s/g, '')))) {
    errors.push('Either Telegram username (min 3 characters) or WhatsApp number is required for assignment solution delivery')
  }

  // Department validation
  if (!data.departmentId) {
    errors.push('Please select a department')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateAssignmentSubmission(data: {
  title: string
  description: string
  departmentId: string
  assignedToId: string
  submitterName: string
  submitterPhone: string
}): ValidationResult {
  const errors: string[] = []

  // Title validation
  if (!data.title || data.title.trim().length < 5) {
    errors.push('Assignment title must be at least 5 characters long')
  }

  // Description validation
  if (!data.description || data.description.trim().length < 20) {
    errors.push('Assignment description must be at least 20 characters long')
  }

  // Department validation
  if (!data.departmentId) {
    errors.push('Please select a department')
  }

  // Assigned maker validation
  if (!data.assignedToId) {
    errors.push('Please select an assignment maker')
  }

  // Submitter name validation
  if (!data.submitterName || data.submitterName.trim().length < 2) {
    errors.push('Submitter name must be at least 2 characters long')
  }

  // Submitter phone validation
  const phoneRegex = /^\+?[1-9]\d{8,14}$/
  if (!data.submitterPhone || !phoneRegex.test(data.submitterPhone.replace(/\s/g, ''))) {
    errors.push('Please provide a valid phone number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateFileUpload(file: File): ValidationResult {
  const errors: string[] = []
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ]

  // File size validation
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`)
  }

  // File type validation
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not supported. Please upload PDF, Word, text, or image files.')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}