'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Send, ArrowLeft, FileText, User, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

interface Department {
  id: string
  name: string
  serviceFee: number
}

interface AssignmentMaker {
  id: string
  name: string
  phone: string
  telegramUsername: string
  whatsappNumber: string
  department: Department
}

export default function RequestPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [makers, setMakers] = useState<AssignmentMaker[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedMaker, setSelectedMaker] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    comments: '',
    submitterName: '',
    submitterPhone: '',
    submitterEmail: '',
    submitterTelegram: '',
    submitterWhatsApp: ''
  })

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments()
  }, [])

  // Fetch makers when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchMakers(selectedDepartment)
    } else {
      setMakers([])
      setSelectedMaker('')
    }
  }, [selectedDepartment])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      const data = await response.json()
      setDepartments(data)
    } catch (error) {
      toast.error('Failed to load departments')
    }
  }

  const fetchMakers = async (departmentId: string) => {
    try {
      const response = await fetch(`/api/makers?departmentId=${departmentId}`)
      const data = await response.json()
      setMakers(data)
    } catch (error) {
      toast.error('Failed to load assignment makers')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles])
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedMaker) {
      toast.error('Please select an assignment maker')
      return
    }

    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value)
      })
      
      submitData.append('departmentId', selectedDepartment)
      submitData.append('assignedToId', selectedMaker)
      
      // Add files
      files.forEach(file => {
        submitData.append('files', file)
      })

      const response = await fetch('/api/assignments', {
        method: 'POST',
        body: submitData
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Assignment submitted successfully!')
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          comments: '',
          submitterName: '',
          submitterPhone: '',
          submitterEmail: '',
          submitterTelegram: '',
          submitterWhatsApp: ''
        })
        setFiles([])
        setSelectedDepartment('')
        setSelectedMaker('')
        
        // Show assignment code
        toast.success(`Assignment Code: ${result.code}`, { duration: 8000 })
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to submit assignment')
      }
    } catch (error) {
      toast.error('Failed to submit assignment')
    } finally {
      setLoading(false)
    }
  }

  const selectedMakerData = makers.find(m => m.id === selectedMaker)

  return (
    <div className="min-h-screen bg-academic-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-academic-900">Submit Assignment</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Progress Steps */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <span className="text-sm font-medium text-academic-900">Select Department</span>
                </div>
                <div className="w-8 h-px bg-academic-300"></div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    selectedDepartment ? 'bg-primary-600 text-white' : 'bg-academic-200 text-academic-500'
                  }`}>2</div>
                  <span className={`text-sm font-medium ${
                    selectedDepartment ? 'text-academic-900' : 'text-academic-500'
                  }`}>Choose Maker</span>
                </div>
                <div className="w-8 h-px bg-academic-300"></div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    selectedMaker ? 'bg-primary-600 text-white' : 'bg-academic-200 text-academic-500'
                  }`}>3</div>
                  <span className={`text-sm font-medium ${
                    selectedMaker ? 'text-academic-900' : 'text-academic-500'
                  }`}>Submit Details</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department Selection */}
            <div className="card">
              <h2 className="text-xl font-semibold text-academic-900 mb-4">Select Department</h2>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Choose a department...</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} - {dept.serviceFee} Birr
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Maker Selection */}
            {selectedDepartment && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-academic-900 mb-4">Choose Assignment Maker</h2>
                {makers.length > 0 ? (
                  <div className="space-y-4">
                    <select
                      value={selectedMaker}
                      onChange={(e) => setSelectedMaker(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select an assignment maker...</option>
                      {makers.map(maker => (
                        <option key={maker.id} value={maker.id}>
                          {maker.name} - {maker.department.serviceFee} Birr
                        </option>
                      ))}
                    </select>
                    
                    {/* Show selected maker details */}
                    {selectedMaker && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-3">Selected Assignment Maker</h3>
                        {makers.filter(m => m.id === selectedMaker).map(maker => (
                          <div key={maker.id} className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                              <div><strong>Name:</strong> {maker.name}</div>
                              <div><strong>Service Fee:</strong> {maker.department.serviceFee} Birr</div>
                              <div><strong>Phone:</strong> {maker.phone}</div>
                              <div><strong>Department:</strong> {maker.department.name}</div>
                            </div>
                            
                            <div className="border-t border-blue-200 pt-3">
                              <p className="text-sm font-semibold text-blue-900 mb-2">📱 Solution Delivery Channels:</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                {maker.telegramUsername && (
                                  <div className="flex items-center space-x-2 bg-blue-100 rounded-lg p-2">
                                    <span className="text-blue-600">📱</span>
                                    <span><strong>Telegram:</strong> @{maker.telegramUsername}</span>
                                  </div>
                                )}
                                {maker.whatsappNumber && (
                                  <div className="flex items-center space-x-2 bg-green-100 rounded-lg p-2">
                                    <span className="text-green-600">💬</span>
                                    <span><strong>WhatsApp:</strong> {maker.whatsappNumber}</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-blue-700 mt-2 italic">
                                * Your completed assignment will be delivered through one of these channels
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-yellow-600 mb-2">⚠️ No assignment makers available</div>
                    <p className="text-sm text-yellow-700">
                      No approved assignment makers found for this department. 
                      Please try another department or contact admin.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Assignment Details */}
            {selectedMaker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                {/* Contact Information */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-academic-900 mb-4">Your Contact Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-academic-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.submitterName}
                        onChange={(e) => setFormData(prev => ({ ...prev, submitterName: e.target.value }))}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-academic-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.submitterPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, submitterPhone: e.target.value }))}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-academic-700 mb-2">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.submitterEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, submitterEmail: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-academic-700 mb-2">
                        Telegram Username *
                      </label>
                      <input
                        type="text"
                        value={formData.submitterTelegram}
                        onChange={(e) => setFormData(prev => ({ ...prev, submitterTelegram: e.target.value }))}
                        className="input-field"
                        placeholder="@username (for communication)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-academic-700 mb-2">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.submitterWhatsApp}
                        onChange={(e) => setFormData(prev => ({ ...prev, submitterWhatsApp: e.target.value }))}
                        className="input-field"
                        placeholder="WhatsApp number (for communication)"
                      />
                    </div>
                    <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-blue-600 mt-0.5">📱</div>
                        <div>
                          <p className="text-blue-900 text-sm font-semibold mb-1">
                            Communication Required
                          </p>
                          <p className="text-blue-800 text-sm">
                            <strong>Telegram username OR WhatsApp number is mandatory</strong> - The assignment maker will use these to communicate with you about your assignment progress and delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-academic-900 mb-4">Assignment Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-academic-700 mb-2">
                        Assignment Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="input-field"
                        placeholder="Enter assignment title..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-academic-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="input-field"
                        rows={4}
                        placeholder="Describe your assignment requirements..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-academic-700 mb-2">
                        Additional Comments
                      </label>
                      <textarea
                        value={formData.comments}
                        onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                        className="input-field"
                        rows={3}
                        placeholder="Any additional instructions or comments..."
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-academic-900 mb-4">Upload Files</h2>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-academic-300 hover:border-academic-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 text-academic-400 mx-auto mb-4" />
                    <p className="text-academic-600 mb-2">
                      {isDragActive
                        ? 'Drop the files here...'
                        : 'Drag & drop files here, or click to select files'
                      }
                    </p>
                    <p className="text-sm text-academic-500">Maximum file size: 10MB</p>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h3 className="font-medium text-academic-900">Uploaded Files:</h3>
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-academic-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-academic-500" />
                            <span className="text-sm text-academic-700">{file.name}</span>
                            <span className="text-xs text-academic-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Maker Summary */}
                {selectedMakerData && (
                  <div className="card bg-primary-50 border-primary-200">
                    <h2 className="text-xl font-semibold text-primary-900 mb-4">Assignment Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-primary-700">Assignment Maker:</span>
                        <span className="font-medium text-primary-900">{selectedMakerData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-700">Department:</span>
                        <span className="font-medium text-primary-900">{selectedMakerData.department.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-700">Service Fee:</span>
                        <span className="font-medium text-primary-900">{selectedMakerData.department.serviceFee} Birr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-700">Contact:</span>
                        <span className="font-medium text-primary-900">{selectedMakerData.phone}</span>
                      </div>
                    </div>
                  </div>
                )}

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
                        <span>Submit Assignment</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </main>
    </div>
  )
}