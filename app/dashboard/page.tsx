'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Phone, 
  Mail,
  Download,
  Upload,
  Bell,
  DollarSign,
  TrendingUp
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { SignOutButton } from '@/components/ui/sign-out-button'
import { CardSkeleton, AssignmentSkeleton } from '@/components/ui/skeleton'

interface Assignment {
  id: string
  code: string
  title: string
  description: string
  files: string[]
  comments: string
  submitterName: string
  submitterPhone: string
  submitterEmail: string
  submitterTelegram?: string
  submitterWhatsApp?: string
  status: string
  isApprovedByAdmin: boolean
  solutionDelivered: boolean
  aiDetectionScreenshot?: string
  createdAt: string
  assignedToId?: string
  department: {
    name: string
    serviceFee: number
  }
}

interface BalanceData {
  balance: number
  totalEarnings: number
  completedAssignments: number
  pendingAssignments: number
  recentAssignments: Assignment[]
}

interface Announcement {
  id: string
  isRead: boolean
  readAt?: string
  announcement: {
    id: string
    title: string
    content: string
    createdAt: string
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [availableAssignments, setAvailableAssignments] = useState<Assignment[]>([])
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [activeTab, setActiveTab] = useState<'my-assignments' | 'available' | 'announcements'>('my-assignments')
  const [loading, setLoading] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [aiDetectionFile, setAiDetectionFile] = useState<File | null>(null)
  const [submittingAssignment, setSubmittingAssignment] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    if (session?.user?.role !== 'user') {
      router.push('/auth/signin')
      return
    }

    if (session?.user && !session.user.isApproved) {
      toast.error('Your account is pending admin approval')
      return
    }

    // Load initial data
    loadInitialData()
  }, [session, status, router])

  // Load data based on active tab to improve performance
  useEffect(() => {
    if (session?.user?.isApproved) {
      if (activeTab === 'my-assignments') {
        fetchAssignments()
        fetchBalanceData()
      } else if (activeTab === 'available') {
        fetchAvailableAssignments()
      } else if (activeTab === 'announcements') {
        fetchAnnouncements()
      }
    }
  }, [activeTab, session])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Load only essential data first
      await Promise.all([
        fetchAssignments(),
        fetchBalanceData()
      ])
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const fetchAssignments = async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch(`/api/assignments?userId=${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setAssignments(data)
      }
    } catch (error) {
      console.error('Failed to load assignments:', error)
    }
  }

  const fetchAvailableAssignments = async () => {
    try {
      const response = await fetch('/api/available-assignments')
      if (response.ok) {
        const data = await response.json()
        setAvailableAssignments(data)
      }
    } catch (error) {
      console.error('Failed to load available assignments:', error)
    }
  }

  const fetchBalanceData = async () => {
    try {
      const response = await fetch('/api/balance')
      if (response.ok) {
        const data = await response.json()
        setBalanceData(data)
      }
    } catch (error) {
      console.error('Failed to load balance data:', error)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Failed to load announcements:', error)
    }
  }

  const handleAcceptAssignment = async (assignmentId: string) => {
    try {
      const response = await fetch('/api/available-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId })
      })

      if (response.ok) {
        toast.success('Assignment accepted successfully!')
        fetchAssignments()
        fetchAvailableAssignments()
        setActiveTab('my-assignments')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to accept assignment')
      }
    } catch (error) {
      toast.error('Failed to accept assignment')
    }
  }

  const handleCompleteAssignment = async (assignmentId: string) => {
    if (!aiDetectionFile) {
      toast.error('Please upload AI detection screenshot')
      return
    }

    setSubmittingAssignment(assignmentId)

    try {
      const formData = new FormData()
      formData.append('aiDetectionScreenshot', aiDetectionFile)

      const response = await fetch(`/api/assignments/${assignmentId}/complete`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`Assignment completed! You earned ${result.commission} Birr`)
        fetchAssignments()
        fetchBalanceData()
        setAiDetectionFile(null)
        setSelectedAssignment(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to complete assignment')
      }
    } catch (error) {
      toast.error('Failed to complete assignment')
    } finally {
      setSubmittingAssignment(null)
    }
  }

  const markAnnouncementAsRead = async (announcementId: string) => {
    try {
      await fetch(`/api/announcements/${announcementId}/read`, {
        method: 'PATCH'
      })
      fetchAnnouncements()
    } catch (error) {
      console.error('Failed to mark announcement as read')
    }
  }

  const getStatusColor = (status: string, isApproved: boolean) => {
    if (status === 'COMPLETED') return 'text-green-600 bg-green-100'
    if (status === 'REJECTED') return 'text-red-600 bg-red-100'
    if (status === 'IN_PROGRESS' && isApproved) return 'text-blue-600 bg-blue-100'
    return 'text-yellow-600 bg-yellow-100'
  }

  const getStatusText = (status: string, isApproved: boolean) => {
    if (status === 'COMPLETED') return 'Completed'
    if (status === 'REJECTED') return 'Rejected'
    if (status === 'IN_PROGRESS' && isApproved) return 'Approved - In Progress'
    if (status === 'PENDING' && isApproved) return 'Approved - Ready to Start'
    return 'Pending Admin Approval'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-sapphire-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sapphire-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sapphire-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session?.user?.isApproved) {
    return (
      <div className="min-h-screen bg-sapphire-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-sapphire-900 mb-2">Account Pending Approval</h1>
          <p className="text-sapphire-600 mb-6">
            Your account is currently under review by our admin team. You'll receive access once approved.
          </p>
          <SignOutButton className="btn-primary">
            Sign Out
          </SignOutButton>
        </div>
      </div>
    )
  }

  const unreadAnnouncements = announcements.filter(a => !a.isRead).length

  return (
    <div className="min-h-screen bg-sapphire-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sapphire-900">Assignment Maker Dashboard</h1>
              <p className="text-sapphire-600">Welcome back, {session?.user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/report" 
                className="px-3 py-2 text-red-600 hover:text-red-800 rounded-lg transition-all duration-300 font-medium hover:bg-red-50 text-sm"
              >
                Report Issue
              </Link>
              <div className="text-right">
                <p className="text-sm text-sapphire-600">Balance</p>
                <p className="font-bold text-sapphire-900 text-lg">
                  {balanceData?.balance || 0} Birr
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-sapphire-600">Department</p>
                <p className="font-medium text-sapphire-900">{session?.user?.department}</p>
              </div>
              <SignOutButton className="flex items-center space-x-2 text-sapphire-600 hover:text-sapphire-900 transition-colors">
                Sign Out
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sapphire-600">Current Balance</p>
                    <p className="text-2xl font-bold text-sapphire-900">{balanceData?.balance || 0} Birr</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sapphire-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-sapphire-900">{balanceData?.totalEarnings || 0} Birr</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-sapphire-600" />
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sapphire-600">Available</p>
                    <p className="text-2xl font-bold text-blue-600">{availableAssignments.length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sapphire-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {balanceData?.pendingAssignments || 0}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sapphire-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {balanceData?.completedAssignments || 0}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-sapphire-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('my-assignments')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'my-assignments'
                    ? 'border-sapphire-500 text-sapphire-600'
                    : 'border-transparent text-sapphire-500 hover:text-sapphire-700'
                }`}
              >
                My Assignments ({assignments.length})
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'available'
                    ? 'border-sapphire-500 text-sapphire-600'
                    : 'border-transparent text-sapphire-500 hover:text-sapphire-700'
                }`}
              >
                Available Assignments ({availableAssignments.length})
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors relative ${
                  activeTab === 'announcements'
                    ? 'border-sapphire-500 text-sapphire-600'
                    : 'border-transparent text-sapphire-500 hover:text-sapphire-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Announcements ({announcements.length})</span>
                  {unreadAnnouncements > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadAnnouncements}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'announcements' ? (
          <div className="card">
            <h2 className="text-xl font-semibold text-sapphire-900 mb-6">Announcements</h2>
            {announcements.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-sapphire-400 mx-auto mb-4" />
                <p className="text-sapphire-600">No announcements yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((userAnnouncement) => (
                  <motion.div
                    key={userAnnouncement.id}
                    className={`p-4 border rounded-lg transition-all ${
                      userAnnouncement.isRead
                        ? 'border-sapphire-200 bg-white'
                        : 'border-sapphire-300 bg-sapphire-50'
                    }`}
                    onClick={() => {
                      if (!userAnnouncement.isRead) {
                        markAnnouncementAsRead(userAnnouncement.announcement.id)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${
                        userAnnouncement.isRead ? 'text-sapphire-700' : 'text-sapphire-900'
                      }`}>
                        {userAnnouncement.announcement.title}
                      </h3>
                      {!userAnnouncement.isRead && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${
                      userAnnouncement.isRead ? 'text-sapphire-600' : 'text-sapphire-800'
                    }`}>
                      {userAnnouncement.announcement.content}
                    </p>
                    <div className="text-xs text-sapphire-500">
                      {new Date(userAnnouncement.announcement.createdAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Assignments Content */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Assignments List */}
            <div className="card">
              <h2 className="text-xl font-semibold text-sapphire-900 mb-6">
                {activeTab === 'my-assignments' ? 'Your Assignments' : 'Available Assignments'}
              </h2>
              
              {activeTab === 'my-assignments' ? (
                assignments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-sapphire-400 mx-auto mb-4" />
                    <p className="text-sapphire-600">No assignments yet</p>
                    <button
                      onClick={() => setActiveTab('available')}
                      className="mt-4 text-sapphire-600 hover:text-sapphire-800 font-medium"
                    >
                      Browse Available Assignments
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <motion.div
                        key={assignment.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedAssignment?.id === assignment.id
                            ? 'border-sapphire-500 bg-sapphire-50'
                            : 'border-sapphire-200 hover:border-sapphire-300'
                        }`}
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sapphire-900">{assignment.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getStatusColor(assignment.status, assignment.isApprovedByAdmin)
                          }`}>
                            {getStatusText(assignment.status, assignment.isApprovedByAdmin)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-sapphire-600 mb-2 line-clamp-2">
                          {assignment.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-sapphire-500">
                          <span>Code: {assignment.code}</span>
                          <span>{new Date(assignment.createdAt).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : (
                availableAssignments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-sapphire-400 mx-auto mb-4" />
                    <p className="text-sapphire-600">No available assignments in your department</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableAssignments.map((assignment) => (
                      <motion.div
                        key={assignment.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedAssignment?.id === assignment.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-sapphire-200 hover:border-sapphire-300'
                        }`}
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sapphire-900">{assignment.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Available
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {assignment.department.serviceFee} Birr
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-sapphire-600 mb-2 line-clamp-2">
                          {assignment.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-sapphire-500">
                          <span>Code: {assignment.code}</span>
                          <span>{new Date(assignment.createdAt).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Assignment Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-sapphire-900 mb-6">Assignment Details</h2>
              
              {selectedAssignment ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-sapphire-900 mb-2">{selectedAssignment.title}</h3>
                    <p className="text-sapphire-700 mb-4">{selectedAssignment.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-sapphire-600">Code:</span>
                        <span className="ml-2 font-medium">{selectedAssignment.code}</span>
                      </div>
                      <div>
                        <span className="text-sapphire-600">Fee:</span>
                        <span className="ml-2 font-medium">{selectedAssignment.department.serviceFee} Birr</span>
                      </div>
                      <div>
                        <span className="text-sapphire-600">Department:</span>
                        <span className="ml-2 font-medium">{selectedAssignment.department.name}</span>
                      </div>
                      <div>
                        <span className="text-sapphire-600">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          getStatusColor(selectedAssignment.status, selectedAssignment.isApprovedByAdmin)
                        }`}>
                          {getStatusText(selectedAssignment.status, selectedAssignment.isApprovedByAdmin)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submitter Info */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sapphire-900 mb-3">Submitter Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-sapphire-500" />
                        <span>{selectedAssignment.submitterName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-sapphire-500" />
                        <span>{selectedAssignment.submitterPhone}</span>
                      </div>
                      {selectedAssignment.submitterEmail && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-sapphire-500" />
                          <span>{selectedAssignment.submitterEmail}</span>
                        </div>
                      )}
                      {selectedAssignment.submitterTelegram && (
                        <div className="flex items-center space-x-2 bg-sapphire-50 rounded-lg p-2">
                          <span className="text-sapphire-600">📱</span>
                          <span><strong>Telegram:</strong> @{selectedAssignment.submitterTelegram}</span>
                        </div>
                      )}
                      {selectedAssignment.submitterWhatsApp && (
                        <div className="flex items-center space-x-2 bg-green-50 rounded-lg p-2">
                          <span className="text-green-600">💬</span>
                          <span><strong>WhatsApp:</strong> {selectedAssignment.submitterWhatsApp}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Files */}
                  {selectedAssignment.files.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sapphire-900 mb-3">Attached Files</h4>
                      <div className="space-y-2">
                        {selectedAssignment.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-sapphire-50 rounded">
                            <span className="text-sm text-sapphire-700">{file.split('/').pop()}</span>
                            <a
                              href={file}
                              download
                              className="text-sapphire-600 hover:text-sapphire-700"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  {selectedAssignment.comments && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sapphire-900 mb-3">Additional Comments</h4>
                      <p className="text-sm text-sapphire-700 bg-sapphire-50 p-3 rounded">
                        {selectedAssignment.comments}
                      </p>
                    </div>
                  )}

                  {/* AI Detection Screenshot Upload for Completed Assignments */}
                  {activeTab === 'my-assignments' && 
                   selectedAssignment?.isApprovedByAdmin && 
                   selectedAssignment?.status === 'IN_PROGRESS' && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sapphire-900 mb-3">Complete Assignment</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-sapphire-700 mb-2">
                            AI Detection Screenshot *
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAiDetectionFile(e.target.files?.[0] || null)}
                            className="input-field"
                            required
                          />
                          <p className="text-xs text-sapphire-500 mt-1">
                            Upload a screenshot showing AI detection results for your solution
                          </p>
                        </div>
                        <button
                          onClick={() => handleCompleteAssignment(selectedAssignment.id)}
                          disabled={!aiDetectionFile || submittingAssignment === selectedAssignment.id}
                          className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                          {submittingAssignment === selectedAssignment.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Submit Solution</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {activeTab === 'available' && selectedAssignment && !selectedAssignment.assignedToId ? (
                    <div className="border-t pt-4">
                      <button 
                        onClick={() => handleAcceptAssignment(selectedAssignment.id)}
                        className="btn-primary w-full flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept Assignment</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-sapphire-400 mx-auto mb-4" />
                  <p className="text-sapphire-600">Select an assignment to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}