export const APP_CONFIG = {
  name: 'AssignmentPro',
  description: 'Professional Academic Services Platform',
  version: '1.0.0',
  author: 'Assignment Platform Team'
}

export const ASSIGNMENT_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED'
} as const

export const PAYMENT_TYPE = {
  REGISTRATION_FEE: 'REGISTRATION_FEE',
  COMMISSION: 'COMMISSION'
} as const

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
} as const

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
} as const

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ],
  UPLOAD_DIR: '/uploads'
}

export const REGISTRATION_FEE = 300 // Birr

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
}

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/signin',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/signout'
  },
  ASSIGNMENTS: '/api/assignments',
  DEPARTMENTS: '/api/departments',
  MAKERS: '/api/makers',
  ADMIN: {
    USERS: '/api/admin/users',
    ASSIGNMENTS: '/api/admin/assignments'
  }
}

export const PAGES = {
  HOME: '/',
  LOGIN: '/auth/signin',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  REQUEST: '/request'
}

export const STATUS_COLORS = {
  [ASSIGNMENT_STATUS.PENDING]: 'text-yellow-600 bg-yellow-100',
  [ASSIGNMENT_STATUS.IN_PROGRESS]: 'text-blue-600 bg-blue-100',
  [ASSIGNMENT_STATUS.COMPLETED]: 'text-green-600 bg-green-100',
  [ASSIGNMENT_STATUS.REJECTED]: 'text-red-600 bg-red-100'
}

export const CONTACT_INFO = {
  email: 'support@assignmentpro.com',
  phone: '+251911234567',
  telegram: '@assignmentpro_support',
  whatsapp: '+251911234567'
}