'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const [userType, setUserType] = useState<'user' | 'admin'>('user')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    if (error) {
      const errorMessages: Record<string, string> = {
        'CredentialsSignin': 'Invalid email or password',
        'Account pending admin approval': 'Your account is pending admin approval',
        'Payment pending admin approval': 'Your payment is pending admin approval',
        'Configuration': 'Server configuration error',
        'AccessDenied': 'Access denied',
        'Verification': 'Verification failed'
      }
      
      const message = errorMessages[error] || 'Authentication failed'
      toast.error(message)
    }
  }, [error])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        userType,
        redirect: false
      })

      if (result?.error) {
        toast.error(result.error)
      } else if (result?.ok) {
        // Get the session to check user role
        const session = await getSession()
        toast.success('Login successful!')
        
        // Redirect based on user role
        if (session?.user?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sapphire-50 via-sapphire-100 to-sapphire-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sapphire-300/30 to-sapphire-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-sapphire-400/20 to-sapphire-600/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-sapphire-600 hover:text-sapphire-800 mb-8 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
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
              Welcome Back!
            </h1>
            <p className="text-sapphire-600">
              Sign in to your account
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm font-medium">
                  Authentication failed. Please try again.
                </p>
              </div>
            </motion.div>
          )}

          {/* User Type Toggle */}
          <div className="flex bg-sapphire-100 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setUserType('user')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                userType === 'user'
                  ? 'bg-white text-sapphire-600 shadow-md'
                  : 'text-sapphire-600 hover:text-sapphire-800'
              }`}
            >
              Assignment Maker
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                userType === 'admin'
                  ? 'bg-white text-sapphire-600 shadow-md'
                  : 'text-sapphire-600 hover:text-sapphire-800'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sapphire-700 text-sm font-semibold mb-2">
                Email Address
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
                Password
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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          {userType === 'user' && (
            <div className="text-center mt-8">
              <Link
                href="/auth/register"
                className="text-sapphire-600 hover:text-sapphire-800 transition-colors font-medium"
              >
                Don't have an account? Register here
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}