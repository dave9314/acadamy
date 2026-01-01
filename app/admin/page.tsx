'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  UserCheck,
  UserX,
  AlertTriangle,
  Bell,
  TrendingUp,
  Image,
  Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { SignOutButton } from '@/components/ui/sign-out-button'

interface User {
  id: string
  name: string
  email: string
  phone: string
  telegramUsername: string
  whatsappNumber: string
  isApproved: boolean
  registrationFee: boolean
  paymentMethod: string
  paymentScreenshot: string
  paymentApproved: boolean
  createdAt: string
  department: {
    name: string
  }
}

interface Assignment {
  id: string
  code: string
  title: string
  description: string
  status: string
  isApprovedByAdmin: boolean
  solutionDelivered: boolean
  aiDetectionScreenshot?: string
  createdAt: string
  submitterName: string
  submitterPhone: string
  department: {
    name: string
    serviceFee: number
  }
  assignedTo: {
    name: string
  }
}

interface Report {
  id: string
  title: string
  description: string
  status: string
  reporterName: string
  reporterEmail: string
  reporterPhone: string
  createdAt: string
  assignment?: {
    code: string
    title: string
  }
  reportedUser?: {
    name: string
    email: string
  }
}

interface BalanceData {
  totalUsers: number
  totalAssignments: number
  completedAssignments: number
  totalRevenue: number
  pendingPayments: number
  recentAssignments: Assignment[]
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'assignments' | 'reports' | 'announcements' | 'departments'>('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [showDepartmentModal, setShowDepartmentModal] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    description: '',
    serviceFee: ''
  })
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    targetType: 'ALL',
    targetUserId: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    if (session?.user?.role !== 'admin') {
      router.push('/auth/signin')
      return
    }

    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      // Fetch core data first
      const [usersRes, assignmentsRes, departmentsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/assignments'),
        fetch('/api/departments')
      ])
      
      const usersData = await usersRes.json()
      const assignmentsData = await assignmentsRes.json()
      const departmentsData = await departmentsRes.json()
      
      setUsers(usersData)
      setAssignments(assignmentsData)
      setDepartments(departmentsData)

      // Fetch optional data with error handling
      try {
        const reportsRes = await fetch('/api/reports')
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json()
          setReports(reportsData)
        }
      } catch (error) {
        console.log('Reports API not available yet')
        setReports([])
      }

      try {
        const announcementsRes = await fetch('/api/announcements')
        if (announcementsRes.ok) {
          const announcementsData = await announcementsRes.json()
          setAnnouncements(announcementsData)
        }
      } catch (error) {
        console.log('Announcements API not available yet')
        setAnnouncements([])
      }

      try {
        const balanceRes = await fetch('/api/balance')
        if (balanceRes.ok) {
          const balanceDataRes = await balanceRes.json()
          setBalanceData(balanceDataRes)
        }
      } catch (error) {
        console.log('Balance API not available yet')
        setBalanceData(null)
      }
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleUserApproval = async (userId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: approved })
      })

      if (response.ok) {
        toast.success(`User ${approved ? 'approved' : 'rejected'} successfully`)
        fetchData()
      } else {
        toast.error('Failed to update user status')
      }
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const handlePaymentApproval = async (userId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentApproved: approved })
      })

      if (response.ok) {
        toast.success(`Payment ${approved ? 'approved' : 'rejected'} successfully`)
        fetchData()
      } else {
        toast.error('Failed to update payment status')
      }
    } catch (error) {
      toast.error('Failed to update payment status')
    }
  }

  const handleUserDeletion = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('User deleted successfully')
        setSelectedUser(null)
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete user')
      }
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const handleAssignmentApproval = async (assignmentId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApprovedByAdmin: approved })
      })

      if (response.ok) {
        toast.success(`Assignment ${approved ? 'approved' : 'rejected'} successfully`)
        fetchData()
      } else {
        toast.error('Failed to update assignment status')
      }
    } catch (error) {
      toast.error('Failed to update assignment status')
    }
  }

  const handleSolutionApproval = async (assignmentId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          solutionDelivered: approved,
          isApprovedByAdmin: approved 
        })
      })

      if (response.ok) {
        toast.success(`Solution ${approved ? 'approved' : 'rejected'} successfully`)
        fetchData()
      } else {
        toast.error('Failed to update solution status')
      }
    } catch (error) {
      toast.error('Failed to update solution status')
    }
  }

  const handleReportUpdate = async (reportId: string, status: string, adminResponse?: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminResponse })
      })

      if (response.ok) {
        toast.success('Report updated successfully')
        fetchData()
      } else {
        toast.error('Failed to update report')
      }
    } catch (error) {
      toast.error('Failed to update report')
    }
  }

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!announcementForm.title || !announcementForm.content) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementForm)
      })

      if (response.ok) {
        toast.success('Announcement created successfully')
        setShowAnnouncementModal(false)
        setAnnouncementForm({ title: '', content: '', targetType: 'ALL', targetUserId: '' })
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create announcement')
      }
    } catch (error) {
      toast.error('Failed to create announcement')
    }
  }

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!departmentForm.name || !departmentForm.serviceFee) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const url = selectedDepartment 
        ? `/api/departments/${selectedDepartment.id}`
        : '/api/departments'
      
      const method = selectedDepartment ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(departmentForm)
      })

      if (response.ok) {
        toast.success(`Department ${selectedDepartment ? 'updated' : 'created'} successfully`)
        setShowDepartmentModal(false)
        setSelectedDepartment(null)
        setDepartmentForm({ name: '', description: '', serviceFee: '' })
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save department')
      }
    } catch (error) {
      toast.error('Failed to save department')
    }
  }

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department)
    setDepartmentForm({
      name: department.name,
      description: department.description || '',
      serviceFee: department.serviceFee.toString()
    })
    setShowDepartmentModal(true)
  }

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!confirm('Are you sure you want to delete this department?')) {
      return
    }

    try {
      const response = await fetch(`/api/departments/${departmentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Department deleted successfully')
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete department')
      }
    } catch (error) {
      toast.error('Failed to delete department')
    }
  }

  const stats = {
    totalUsers: balanceData?.totalUsers || (users || []).length,
    approvedUsers: (users || []).filter(u => u.isApproved).length,
    pendingUsers: (users || []).filter(u => !u.isApproved).length,
    totalAssignments: balanceData?.totalAssignments || (assignments || []).length,
    pendingAssignments: (assignments || []).filter(a => !a.isApprovedByAdmin).length,
    completedAssignments: balanceData?.completedAssignments || (assignments || []).filter(a => a.status === 'COMPLETED').length,
    totalRevenue: balanceData?.totalRevenue || (assignments || [])
      .filter(a => a.status === 'COMPLETED')
      .reduce((sum, a) => sum + a.department.serviceFee, 0),
    pendingReports: (reports || []).filter(r => r.status === 'PENDING').length
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sapphire-50 via-sapphire-100 to-sapphire-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sapphire-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sapphire-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sapphire-50 via-sapphire-100 to-sapphire-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-sapphire-600 mt-1">Welcome back, {session?.user?.name}</p>
            </div>
            <SignOutButton className="flex items-center space-x-2 px-4 py-2 text-sapphire-600 hover:text-sapphire-800 bg-white/50 hover:bg-white/70 rounded-xl transition-all duration-300 border border-sapphire-200">
              Sign Out
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sapphire-600 font-medium">Total Users</p>
                <p className="text-3xl font-bold text-sapphire-800">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-sapphire-500 to-sapphire-600 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sapphire-600 font-medium">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingUsers}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sapphire-600 font-medium">Total Assignments</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalAssignments}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sapphire-600 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalRevenue} Birr</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sapphire-600 font-medium">Pending Reports</p>
                <p className="text-3xl font-bold text-red-600">{stats.pendingReports}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="card mb-6">
          <div className="border-b border-sapphire-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-sapphire-500 text-sapphire-600'
                    : 'border-transparent text-sapphire-500 hover:text-sapphire-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-sapphire-500 text-sapphire-600'
                    : 'border-transparent text-sapphire-500 hover:text-sapphire-700'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'assignments'
                    ? 'border-sapphire-500 text-sapphire-600'
                    : 'border-transparent text-sapphire-500 hover:text-sapphire-700'
                }`}
              >
                Assignment Management
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors relative ${
                  activeTab === 'reports'
                    ? 'border-sapphire-500 text-sapphire-600'
                    : 'border-transparent text-sapphire-500 hover:text-sapphire-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>Reports</span>
                  {stats.pendingReports > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {stats.pendingReports}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'announcements'
                    ? 'border-sapphire-500 text-sapphire-600'
                    : 'border-transparent text-sapphire-500 hover:text-sapphire-700'
                }`}
              >
                Announcements
              </button>
              <button
                onClick={() => setActiveTab('departments')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'departments'
                    ? 'border-sapphire-500 text-sapphire-600'
                    : 'border-transparent text-sapphire-500 hover:text-sapphire-700'
                }`}
              >
                Department Management
              </button>
            </nav>
          </div>

          <div>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-sapphire-800 mb-6">Platform Overview</h2>
                
                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-sapphire-900 mb-4">Recent Assignments</h3>
                    {balanceData?.recentAssignments && balanceData.recentAssignments.length > 0 ? (
                      <div className="space-y-3">
                        {balanceData.recentAssignments.slice(0, 5).map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between p-3 bg-sapphire-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sapphire-900">{assignment.title}</p>
                              <p className="text-sm text-sapphire-600">{assignment.assignedTo?.name}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assignment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {assignment.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sapphire-600">No recent assignments</p>
                    )}
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-sapphire-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sapphire-600">Active Users</span>
                        <span className="font-bold text-sapphire-900">{stats.approvedUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sapphire-600">Pending Approvals</span>
                        <span className="font-bold text-yellow-600">{stats.pendingUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sapphire-600">Completed Assignments</span>
                        <span className="font-bold text-green-600">{stats.completedAssignments}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sapphire-600">Platform Revenue</span>
                        <span className="font-bold text-sapphire-900">{stats.totalRevenue} Birr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-sapphire-800 mb-6">Reports</h2>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(reports || []).length === 0 ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="w-12 h-12 text-sapphire-400 mx-auto mb-4" />
                        <p className="text-sapphire-600">No reports yet</p>
                      </div>
                    ) : (
                      (reports || []).map((report) => (
                        <motion.div
                          key={report.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            selectedReport?.id === report.id
                              ? 'border-sapphire-500 bg-sapphire-50 shadow-lg'
                              : 'border-sapphire-200 hover:border-sapphire-300 bg-white hover:shadow-md'
                          }`}
                          onClick={() => setSelectedReport(report)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-sapphire-800 text-lg">{report.title}</h3>
                              <p className="text-sapphire-600 mt-1">{report.reporterName}</p>
                              <p className="text-sapphire-500 text-sm mt-1">{new Date(report.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              report.status === 'RESOLVED'
                                ? 'bg-green-100 text-green-800'
                                : report.status === 'INVESTIGATING'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-sapphire-800 mb-6">Report Details</h2>
                  {selectedReport ? (
                    <div className="space-y-6">
                      <div className="bg-sapphire-50 p-6 rounded-xl border border-sapphire-200">
                        <h3 className="font-bold text-sapphire-800 text-xl mb-4">{selectedReport.title}</h3>
                        <p className="text-sapphire-700 mb-6 leading-relaxed">{selectedReport.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold text-sapphire-600">Reporter:</span>
                            <span className="text-sapphire-800">{selectedReport.reporterName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-sapphire-600">Email:</span>
                            <span className="text-sapphire-800">{selectedReport.reporterEmail}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-sapphire-600">Phone:</span>
                            <span className="text-sapphire-800">{selectedReport.reporterPhone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-sapphire-600">Status:</span>
                            <span className="text-sapphire-800">{selectedReport.status}</span>
                          </div>
                        </div>
                      </div>

                      {selectedReport.status === 'PENDING' && (
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleReportUpdate(selectedReport.id, 'INVESTIGATING')}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
                          >
                            <span>Start Investigation</span>
                          </button>
                          <button
                            onClick={() => handleReportUpdate(selectedReport.id, 'DISMISSED')}
                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
                          >
                            <span>Dismiss</span>
                          </button>
                        </div>
                      )}

                      {selectedReport.status === 'INVESTIGATING' && (
                        <button
                          onClick={() => handleReportUpdate(selectedReport.id, 'RESOLVED', 'Issue has been resolved.')}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>Mark as Resolved</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertTriangle className="w-16 h-16 text-sapphire-400 mx-auto mb-4" />
                      <p className="text-sapphire-600 text-lg">Select a report to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-sapphire-800">Announcements</h2>
                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Create Announcement</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-1 gap-6">
                  {(announcements || []).length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-sapphire-400 mx-auto mb-4" />
                      <p className="text-sapphire-600">No announcements yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(announcements || []).map((announcement) => (
                        <div key={announcement.id} className="card">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold text-sapphire-900">{announcement.title}</h3>
                            <span className="text-sm text-sapphire-500">
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sapphire-700 mb-4">{announcement.content}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-sapphire-600">
                              Target: {announcement.targetType === 'ALL' ? 'All Users' : 'Specific User'}
                            </span>
                            <span className="text-sapphire-600">
                              Delivered to: {announcement.userAnnouncements?.length || 0} users
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Announcement Modal */}
                {showAnnouncementModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                      <h3 className="text-2xl font-bold text-sapphire-800 mb-6">Create Announcement</h3>
                      
                      <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-sapphire-700 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={announcementForm.title}
                            onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                            className="input-field"
                            placeholder="Announcement title"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-sapphire-700 mb-2">
                            Content *
                          </label>
                          <textarea
                            value={announcementForm.content}
                            onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                            className="input-field"
                            rows={4}
                            placeholder="Announcement content"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-sapphire-700 mb-2">
                            Target Audience
                          </label>
                          <select
                            value={announcementForm.targetType}
                            onChange={(e) => setAnnouncementForm(prev => ({ ...prev, targetType: e.target.value }))}
                            className="input-field"
                          >
                            <option value="ALL">All Users</option>
                            <option value="SPECIFIC_USER">Specific User</option>
                          </select>
                        </div>

                        {announcementForm.targetType === 'SPECIFIC_USER' && (
                          <div>
                            <label className="block text-sm font-semibold text-sapphire-700 mb-2">
                              Select User
                            </label>
                            <select
                              value={announcementForm.targetUserId}
                              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, targetUserId: e.target.value }))}
                              className="input-field"
                              required
                            >
                              <option value="">Choose a user</option>
                              {(users || []).map(user => (
                                <option key={user.id} value={user.id}>
                                  {user.name} - {user.email}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        <div className="flex space-x-4 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAnnouncementModal(false)
                              setAnnouncementForm({ title: '', content: '', targetType: 'ALL', targetUserId: '' })
                            }}
                            className="flex-1 btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 btn-primary"
                          >
                            Create
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Users List */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Users</h2>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(users || []).map((user) => (
                      <motion.div
                        key={user.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedUser?.id === user.id
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
                            <p className="text-gray-600 mt-1">{user.email}</p>
                            <p className="text-gray-500 text-sm mt-1">{user.department.name}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isApproved
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.isApproved ? 'Approved' : 'Pending'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.paymentApproved
                                ? 'bg-green-100 text-green-800'
                                : user.paymentScreenshot
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.paymentApproved ? 'Payment Approved' : user.paymentScreenshot ? 'Payment Pending' : 'No Payment'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* User Details */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">User Details</h2>
                  {selectedUser ? (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-800 text-xl mb-4">{selectedUser.name}</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Email:</span>
                            <span className="text-gray-800">{selectedUser.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Phone:</span>
                            <span className="text-gray-800">{selectedUser.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Telegram:</span>
                            <span className="text-gray-800">@{selectedUser.telegramUsername}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">WhatsApp:</span>
                            <span className="text-gray-800">{selectedUser.whatsappNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Department:</span>
                            <span className="text-gray-800">{selectedUser.department.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Registered:</span>
                            <span className="text-gray-800">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                          </div>
                          {selectedUser.paymentMethod && (
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600">Payment Method:</span>
                              <span className="text-gray-800">{selectedUser.paymentMethod}</span>
                            </div>
                          )}
                        </div>
                        
                        {selectedUser.paymentScreenshot && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-semibold text-gray-600 mb-2">Payment Screenshot:</h4>
                            <img 
                              src={selectedUser.paymentScreenshot} 
                              alt="Payment screenshot" 
                              className="max-w-full h-48 object-contain rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                      </div>

                      {!selectedUser.isApproved && (
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleUserApproval(selectedUser.id, true)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
                          >
                            <UserCheck className="w-5 h-5" />
                            <span>Approve User</span>
                          </button>
                          <button
                            onClick={() => handleUserApproval(selectedUser.id, false)}
                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
                          >
                            <UserX className="w-5 h-5" />
                            <span>Reject User</span>
                          </button>
                        </div>
                      )}

                      {selectedUser.paymentScreenshot && !selectedUser.paymentApproved && (
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handlePaymentApproval(selectedUser.id, true)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Approve Payment</span>
                          </button>
                          <button
                            onClick={() => handlePaymentApproval(selectedUser.id, false)}
                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
                          >
                            <XCircle className="w-5 h-5" />
                            <span>Reject Payment</span>
                          </button>
                        </div>
                      )}

                      {/* Delete User Button - Always available for admin */}
                      <div className="border-t border-sapphire-200 pt-4">
                        <button
                          onClick={() => handleUserDeletion(selectedUser.id, selectedUser.name)}
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span>Delete User</span>
                        </button>
                        <p className="text-xs text-red-600 mt-2 text-center">
                          ⚠️ This action cannot be undone. User must have no active assignments.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">Select a user to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Assignments List */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Assignments</h2>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(assignments || []).map((assignment) => (
                      <motion.div
                        key={assignment.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedAssignment?.id === assignment.id
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                        }`}
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-gray-800 text-lg">{assignment.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            assignment.isApprovedByAdmin
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assignment.isApprovedByAdmin ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {assignment.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Code: {assignment.code}</span>
                          <span className="font-semibold text-green-600">{assignment.department.serviceFee} Birr</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Assignment Details */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Assignment Details</h2>
                  {selectedAssignment ? (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-800 text-xl mb-4">{selectedAssignment.title}</h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">{selectedAssignment.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Code:</span>
                            <span className="text-gray-800">{selectedAssignment.code}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Fee:</span>
                            <span className="text-green-600 font-bold">{selectedAssignment.department.serviceFee} Birr</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Department:</span>
                            <span className="text-gray-800">{selectedAssignment.department.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Assigned to:</span>
                            <span className="text-gray-800">{selectedAssignment.assignedTo.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Submitter:</span>
                            <span className="text-gray-800">{selectedAssignment.submitterName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Phone:</span>
                            <span className="text-gray-800">{selectedAssignment.submitterPhone}</span>
                          </div>
                        </div>
                      </div>

                      {!selectedAssignment.isApprovedByAdmin && (
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleAssignmentApproval(selectedAssignment.id, true)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleAssignmentApproval(selectedAssignment.id, false)}
                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
                          >
                            <XCircle className="w-5 h-5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">Select an assignment to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="space-y-6">
                {/* Add Department Button */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Department Management</h2>
                  <button
                    onClick={() => {
                      setSelectedDepartment(null)
                      setDepartmentForm({ name: '', description: '', serviceFee: '' })
                      setShowDepartmentModal(true)
                    }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Add Department</span>
                  </button>
                </div>

                {/* Departments Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(departments || []).map((department) => (
                    <motion.div
                      key={department.id}
                      whileHover={{ y: -5 }}
                      className="card"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{department.name}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditDepartment(department)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(department.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {department.description && (
                        <p className="text-gray-600 mb-4 text-sm">{department.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Service Fee:</span>
                        <span className="text-lg font-bold text-green-600">{department.serviceFee} Birr</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Users:</span>
                          <span>{(users || []).filter(u => u.department?.name === department.name).length}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Department Modal */}
                {showDepartmentModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        {selectedDepartment ? 'Edit Department' : 'Add New Department'}
                      </h3>
                      
                      <form onSubmit={handleDepartmentSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Department Name *
                          </label>
                          <input
                            type="text"
                            value={departmentForm.name}
                            onChange={(e) => setDepartmentForm(prev => ({ ...prev, name: e.target.value }))}
                            className="input-field"
                            placeholder="e.g., Computer Science"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={departmentForm.description}
                            onChange={(e) => setDepartmentForm(prev => ({ ...prev, description: e.target.value }))}
                            className="input-field"
                            rows={3}
                            placeholder="Brief description of the department"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Service Fee (Birr) *
                          </label>
                          <input
                            type="number"
                            value={departmentForm.serviceFee}
                            onChange={(e) => setDepartmentForm(prev => ({ ...prev, serviceFee: e.target.value }))}
                            className="input-field"
                            placeholder="e.g., 500"
                            min="0"
                            required
                          />
                        </div>
                        
                        <div className="flex space-x-4 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setShowDepartmentModal(false)
                              setSelectedDepartment(null)
                              setDepartmentForm({ name: '', description: '', serviceFee: '' })
                            }}
                            className="flex-1 btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 btn-primary"
                          >
                            {selectedDepartment ? 'Update' : 'Create'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}