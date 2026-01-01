'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Mail, Lock, User, ArrowLeft, Eye, EyeOff, Sparkles, Upload, CreditCard, Phone } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    telegramUsername: '',
    whatsappNumber: '',
    departmentId: '',
    paymentMethod: '',
    paymentScreenshot: null as File | null
  })

  const [departments, setDepartments] = useState([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments...')
      const response = await fetch('/api/departments')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Departments fetched:', data)
      setDepartments(data || [])
      
      if (!data || data.length === 0) {
        toast.error('No departments available. Please contact support.')
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error)
      toast.error('Failed to load departments. Please refresh the page.')
      setDepartments([])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      setFormData(prev => ({ ...prev, paymentScreenshot: file }))
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.departmentId) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate contact methods
    if ((!formData.telegramUsername || formData.telegramUsername.length < 3) && 
        (!formData.whatsappNumber || formData.whatsappNumber.length < 8)) {
      toast.error('Either Telegram username (min 3 characters) or WhatsApp number is required')
      return
    }

    setStep(2)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    if (!formData.paymentScreenshot) {
      toast.error('Please upload payment screenshot')
      return
    }

    setLoading(true)

    try {
      // Create FormData for file upload
      const uploadData = new FormData()
      uploadData.append('email', formData.email)
      uploadData.append('password', formData.password)
      uploadData.append('name', formData.name)
      uploadData.append('phone', formData.phone)
      uploadData.append('telegramUsername', formData.telegramUsername || '')
      uploadData.append('whatsappNumber', formData.whatsappNumber || '')
      uploadData.append('departmentId', formData.departmentId)
      uploadData.append('paymentMethod', formData.paymentMethod)
      uploadData.append('paymentScreenshot', formData.paymentScreenshot)

      console.log('Submitting registration...')
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: uploadData
      })

      const data = await response.json()
      console.log('Registration response:', data)

      if (response.ok) {
        toast.success(data.message || 'Registration successful! Please wait for admin approval.')
        // Clear form data
        setFormData({
          email: '',
          password: '',
          name: '',
          phone: '',
          telegramUsername: '',
          whatsappNumber: '',
          departmentId: '',
          paymentMethod: '',
          paymentScreenshot: null
        })
        setPreviewUrl(null)
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/auth/signin?message=registration-success')
        }, 2000)
      } else {
        toast.error(data.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const getAccountNumber = () => {
    if (formData.paymentMethod === 'CBE') {
      return '1000472733617'
    } else if (formData.paymentMethod === 'Telebirr') {
      return '0922486497'
    }
    return ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sapphire-50 via-sapphire-100 to-sapphire-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sapphire-300/30 to-sapphire-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-sapphire-400/20 to-sapphire-600/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Login */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            href="/auth/signin"
            className="inline-flex items-center space-x-2 text-sapphire-600 hover:text-sapphire-800 mb-8 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Sign In</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-gradient-to-br from-sapphire-500 to-sapphire-600 rounded-2xl shadow-2xl">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-sapphire-800 mb-3">
              Join Our Platform
            </h1>
            <p className="text-sapphire-600">
              Step {step} of 2: {step === 1 ? 'Basic Information' : 'Payment & Verification'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sapphire-600">Progress</span>
              <span className="text-sm font-medium text-sapphire-600">{step}/2</span>
            </div>
            <div className="w-full bg-sapphire-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-sapphire-500 to-sapphire-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {step === 1 ? (
            /* Step 1: Basic Information */
            <form onSubmit={handleBasicInfo} className="space-y-6">
              <div>
                <label className="block text-sapphire-700 text-sm font-semibold mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sapphire-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field pl-10"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sapphire-700 text-sm font-semibold mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sapphire-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sapphire-700 text-sm font-semibold mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sapphire-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sapphire-400 hover:text-sapphire-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sapphire-700 text-sm font-semibold mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sapphire-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-field pl-10"
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sapphire-700 text-sm font-semibold mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    className="input-field"
                    placeholder="WhatsApp number (for solution delivery)"
                  />
                </div>
                <div>
                  <label className="block text-sapphire-700 text-sm font-semibold mb-2">
                    Telegram Username
                  </label>
                  <input
                    type="text"
                    value={formData.telegramUsername}
                    onChange={(e) => setFormData(prev => ({ ...prev, telegramUsername: e.target.value }))}
                    className="input-field"
                    placeholder="@username (for solution delivery)"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-sapphire-50 to-sapphire-100 border border-sapphire-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-sapphire-600 mt-0.5">📱</div>
                  <div>
                    <p className="text-sapphire-800 text-sm font-semibold mb-1">
                      Communication Required
                    </p>
                    <p className="text-sapphire-700 text-sm">
                      <strong>Telegram username OR WhatsApp number is mandatory</strong> - Assignment solutions will be delivered through these channels.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sapphire-700 text-sm font-semibold mb-2">
                  Department *
                </label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Continue to Payment
              </button>
            </form>
          ) : (
            /* Step 2: Payment */
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <p className="text-yellow-800 text-sm font-medium">
                    <strong>Registration Fee: 300 Birr</strong>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sapphire-700 text-sm font-semibold mb-3">
                  Select Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'CBE' }))}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.paymentMethod === 'CBE'
                        ? 'border-sapphire-500 bg-sapphire-50'
                        : 'border-sapphire-200 hover:border-sapphire-300'
                    }`}
                  >
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 text-sapphire-600" />
                      <p className="font-semibold text-sapphire-800">CBE Bank</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'Telebirr' }))}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.paymentMethod === 'Telebirr'
                        ? 'border-sapphire-500 bg-sapphire-50'
                        : 'border-sapphire-200 hover:border-sapphire-300'
                    }`}
                  >
                    <div className="text-center">
                      <Phone className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="font-semibold text-sapphire-800">Telebirr</p>
                    </div>
                  </button>
                </div>
              </div>

              {formData.paymentMethod && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-50 to-sapphire-50 border border-green-200 rounded-xl p-4"
                >
                  <h3 className="font-semibold text-green-800 mb-2">
                    Payment Instructions
                  </h3>
                  <p className="text-green-700 text-sm mb-3">
                    Send <strong>300 Birr</strong> to the following {formData.paymentMethod} account:
                  </p>
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-lg font-mono font-bold text-center text-sapphire-800">
                      {getAccountNumber()}
                    </p>
                  </div>
                  <p className="text-green-700 text-sm mt-3">
                    After payment, upload a screenshot below for verification.
                  </p>
                </motion.div>
              )}

              <div>
                <label className="block text-sapphire-700 text-sm font-semibold mb-2">
                  Payment Screenshot *
                </label>
                <div className="border-2 border-dashed border-sapphire-300 rounded-xl p-6 text-center hover:border-sapphire-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer">
                    {previewUrl ? (
                      <div className="space-y-3">
                        <img
                          src={previewUrl}
                          alt="Payment screenshot"
                          className="max-w-full h-32 object-contain mx-auto rounded-lg"
                        />
                        <p className="text-sm text-green-600 font-medium">
                          Screenshot uploaded successfully
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-12 h-12 text-sapphire-400 mx-auto" />
                        <div>
                          <p className="text-sapphire-600 font-medium">
                            Upload Payment Screenshot
                          </p>
                          <p className="text-sm text-sapphire-500">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-sapphire-300 rounded-xl text-sapphire-700 font-semibold hover:bg-sapphire-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Registering...</span>
                    </div>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}