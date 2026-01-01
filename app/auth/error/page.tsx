'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const errorMessages: Record<string, string> = {
  'Configuration': 'There is a problem with the server configuration.',
  'AccessDenied': 'You do not have permission to sign in.',
  'Verification': 'The verification token has expired or has already been used.',
  'Default': 'An error occurred during authentication.',
  'Account pending admin approval': 'Your account is pending admin approval. Please wait for approval before signing in.',
  'Payment pending admin approval': 'Your payment is pending admin approval. Please wait for payment verification before signing in.'
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const errorMessage = error ? (errorMessages[error] || errorMessages['Default']) : errorMessages['Default']

  return (
    <div className="min-h-screen bg-gradient-to-br from-sapphire-50 via-sapphire-100 to-sapphire-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass text-center"
        >
          {/* Header */}
          <div className="mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-2xl">
                <AlertCircle className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-sapphire-800 mb-3">
              Authentication Error
            </h1>
            <p className="text-sapphire-600">
              {errorMessage}
            </p>
          </div>

          {/* Error Details */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <p className="text-red-800 text-sm">
                <strong>Error Code:</strong> {error}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="w-full bg-gradient-to-r from-sapphire-500 to-sapphire-600 text-white px-6 py-3 rounded-xl hover:from-sapphire-600 hover:to-sapphire-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </Link>
            
            <Link
              href="/"
              className="w-full bg-sapphire-100 text-sapphire-700 px-6 py-3 rounded-xl hover:bg-sapphire-200 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-sapphire-200">
            <p className="text-sm text-sapphire-500">
              If you continue to experience issues, please contact support.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}