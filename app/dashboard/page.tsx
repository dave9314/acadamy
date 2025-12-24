'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Phone, 
  Mail,
  Download,
  Send,
  LogOut
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { SignOutButton } from '@/components/ui/sign-out-button'

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
  createdAt: string
  assignedToId?: string
  department: {
    name: string
    serviceFee: number
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [availableAssignments, setAvailableAssignments] = useState<Assignment[]>([])
  const [activeTab, setActiveTab] = useState<'my-assignments' | 'available'>('my-assignments')
  const [loading, setLoading] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

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

    fetchAssignments()
    fetchAvailableAssignments()
  }, [session, status, router])

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/assignments?userId=${session?.user?.id}`)
      const data = await response.json()
      setAssignments(data)
    } catch (error) {
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableAssignments = async () => {
    try {
      const response = await fetch('/api/available-assignments')
      const data = await response.json()
      setAvailableAssignments(data)
    } catch (error) {
      toast.error('Failed to load available assignments')
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
      <div className="min-h-screen bg-academic-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-academic-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session?.user?.isApproved) {
    return (
      <div className="min-h-screen bg-academic-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-academic-900 mb-2">Account Pending Approval</h1>
          <p className="text-academic-600 mb-6">
            Your account is currently under review by our admin team. You'll receive access once approved.
          </p>
          <SignOutButton className="btn-primary">
            Sign Out
          </SignOutButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-academic-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-academic-900">Assignment Maker Dashboard</h1>
              <p className="text-academic-600">Welcome back, {session?.user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-academic-600">Department</p>
                <p className="font-medium text-academic-900">{session?.user?.department}</p>
              </div>
              <SignOutButton className="flex items-center space-x-2 text-academic-600 hover:text-academic-900 transition-colors">
                Sign Out
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-academic-600">My Assignments</p>
                <p className="text-2xl font-bold text-academic-900">{assignments.length}</p>
              </div>
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-academic-600">Available</p>
                <p className="text-2xl font-bold text-blue-600">{availableAssignments.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-academic-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {assignments.filter(a => !a.isApprovedByAdmin).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-academic-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {assignments.filter(a => a.status === 'COMPLETED').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('my-assignments')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'my-assignments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Assignments ({assignments.length})
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'available'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Available Assignments ({availableAssignments.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Assignments Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assignments List */}
          <div className="card">
            <h2 className="text-xl font-semibold text-academic-900 mb-6">
              {activeTab === 'my-assignments' ? 'Your Assignments' : 'Available Assignments'}
            </h2>
            
            {activeTab === 'my-assignments' ? (
              assignments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-academic-400 mx-auto mb-4" />
                  <p className="text-academic-600">No assignments yet</p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
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
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-academic-200 hover:border-academic-300'
                      }`}
                      onClick={() => setSelectedAssignment(assignment)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-academic-900">{assignment.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getStatusColor(assignment.status, assignment.isApprovedByAdmin)
                        }`}>
                          {getStatusText(assignment.status, assignment.isApprovedByAdmin)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-academic-600 mb-2 line-clamp-2">
                        {assignment.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-academic-500">
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
                  <FileText className="w-12 h-12 text-academic-400 mx-auto mb-4" />
                  <p className="text-academic-600">No available assignments in your department</p>
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
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAssignment(assignment)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            {assignment.department.serviceFee} Birr
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {assignment.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
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
            <h2 className="text-xl font-semibold text-academic-900 mb-6">Assignment Details</h2>
            
            {selectedAssignment ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-academic-900 mb-2">{selectedAssignment.title}</h3>
                  <p className="text-academic-700 mb-4">{selectedAssignment.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-academic-600">Code:</span>
                      <span className="ml-2 font-medium">{selectedAssignment.code}</span>
                    </div>
                    <div>
                      <span className="text-academic-600">Fee:</span>
                      <span className="ml-2 font-medium">{selectedAssignment.department.serviceFee} Birr</span>
                    </div>
                    <div>
                      <span className="text-academic-600">Department:</span>
                      <span className="ml-2 font-medium">{selectedAssignment.department.name}</span>
                    </div>
                    <div>
                      <span className="text-academic-600">Status:</span>
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
                  <h4 className="font-medium text-academic-900 mb-3">Submitter Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-academic-500" />
                      <span>{selectedAssignment.submitterName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-academic-500" />
                      <span>{selectedAssignment.submitterPhone}</span>
                    </div>
                    {selectedAssignment.submitterEmail && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-academic-500" />
                        <span>{selectedAssignment.submitterEmail}</span>
                      </div>
                    )}
                    {selectedAssignment.submitterTelegram && (
                      <div className="flex items-center space-x-2 bg-blue-50 rounded-lg p-2">
                        <span className="text-blue-600">📱</span>
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
                    <h4 className="font-medium text-academic-900 mb-3">Attached Files</h4>
                    <div className="space-y-2">
                      {selectedAssignment.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-academic-50 rounded">
                          <span className="text-sm text-academic-700">{file.split('/').pop()}</span>
                          <a
                            href={file}
                            download
                            className="text-primary-600 hover:text-primary-700"
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
                    <h4 className="font-medium text-academic-900 mb-3">Additional Comments</h4>
                    <p className="text-sm text-academic-700 bg-academic-50 p-3 rounded">
                      {selectedAssignment.comments}
                    </p>
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
                ) : activeTab === 'my-assignments' && selectedAssignment?.isApprovedByAdmin && !selectedAssignment.solutionDelivered ? (
                  <div className="border-t pt-4">
                    <button className="btn-primary w-full flex items-center justify-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Submit Solution</span>
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-academic-400 mx-auto mb-4" />
                <p className="text-academic-600">Select an assignment to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}