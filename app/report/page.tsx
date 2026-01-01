'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Send, ArrowLeft, User, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface AssignmentMaker {
  id: string
  name: string
  email: string
  phone: string
  telegramUsername?: string
  whatsappNumber?: string
  department: {
    name: string
  }
}

export default function ReportPage() {
  const [makers, setMakers] = useState<AssignmentMaker[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reportedUserId: '',
    reporterName: '',
    reporterEmail: '',
    reporterPhone: ''
  })

  useEffect(() => {
    fetchMakers()
  }, [])

  const fetchMakers = async () => {
    try {
      const response = await fetch('/api/makers')
      if (response.ok) {
        const data = await response.json()
        setMakers(data || [])
      } else {
        setMakers([])
      }
    } catch (error) {
      console.error('Failed to load assignment makers:', error)
      setMakers([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.reporterName) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Report submitted successfully! Admin will review it shortly.')
        setFormData({
          title: '',
          description: '',
          reportedUserId: '',
          reporterName: '',
          reporterEmail: '',
          reporterPhone: ''
        })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit report')
      }
    } catch (error) {
      toast.error('Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sapphire-50 via-sapphire-100 to-sapphire-200">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-sapphire-600 hover:text-sapphire-700">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-sapphire-900">Report an Issue</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Warning Notice */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Report Guidelines
                </h3>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• Only report genuine issues or concerns</li>
                  <li>• Provide detailed information to help us investigate</li>
                  <li>• False reports may result in restrictions</li>
                  <li>• Admin will review and respond within 24-48 hours</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reporter Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-sapphire-900 mb-4">Your Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sapphire-700 mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sapphire-400" />
                    <input
                      type="text"
                      value={formData.reporterName}
                      onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sapphire-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sapphire-400" />
                    <input
                      type="tel"
                      value={formData.reporterPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, reporterPhone: e.target.value }))}
                      className="input-field pl-10"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-sapphire-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sapphire-400" />
                    <input
                      type="email"
                      value={formData.reporterEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, reporterEmail: e.target.value }))}
                      className="input-field pl-10"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Report Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-sapphire-900 mb-4">Report Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sapphire-700 mb-2">
                    Assignment Maker (Optional)
                  </label>
                  <select
                    value={formData.reportedUserId}
                    onChange={(e) => setFormData(prev => ({ ...prev, reportedUserId: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select assignment maker (if applicable)</option>
                    {(makers || []).map(maker => (
                      <option key={maker.id} value={maker.id}>
                        {maker.name} - {maker.department?.name} - {maker.email}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-sapphire-500 mt-1">
                    Leave blank if reporting a general platform issue. Select a specific assignment maker if your report is about their work or behavior.
                  </p>
                </div>

                {/* Show selected maker details */}
                {formData.reportedUserId && (
                  <div className="bg-gradient-to-r from-sapphire-50 to-sapphire-100 border border-sapphire-200 rounded-lg p-4">
                    {(() => {
                      const selectedMaker = makers.find(m => m.id === formData.reportedUserId)
                      if (!selectedMaker) return null
                      
                      return (
                        <div>
                          <h4 className="font-semibold text-sapphire-900 mb-2">Selected Assignment Maker</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm text-sapphire-800">
                            <div><strong>Name:</strong> {selectedMaker.name}</div>
                            <div><strong>Email:</strong> {selectedMaker.email}</div>
                            <div><strong>Department:</strong> {selectedMaker.department?.name}</div>
                            <div><strong>Phone:</strong> {selectedMaker.phone}</div>
                          </div>
                          {(selectedMaker.telegramUsername || selectedMaker.whatsappNumber) && (
                            <div className="mt-2 pt-2 border-t border-sapphire-200">
                              <p className="text-xs font-semibold text-sapphire-900 mb-1">Contact Methods:</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedMaker.telegramUsername && (
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    📱 @{selectedMaker.telegramUsername}
                                  </span>
                                )}
                                {selectedMaker.whatsappNumber && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                    💬 {selectedMaker.whatsappNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-sapphire-700 mb-2">
                    Issue Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sapphire-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field"
                    rows={6}
                    placeholder="Please provide detailed information about the issue, including what happened, when it occurred, and any relevant context..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Contact Information */}
          <div className="card bg-sapphire-50 border-sapphire-200">
            <h3 className="text-lg font-semibold text-sapphire-900 mb-3">
              Need Immediate Help?
            </h3>
            <p className="text-sapphire-700 mb-3">
              For urgent issues, you can also contact our support team directly:
            </p>
            <div className="space-y-2 text-sm text-sapphire-600">
              <div>📧 Email: support@assignmentplatform.com</div>
              <div>📱 Phone: +251-XXX-XXXX</div>
              <div>💬 Telegram: @AssignmentSupport</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}