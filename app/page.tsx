'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users, ArrowRight, CheckCircle, Star, Zap, Shield, Award, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [userType, setUserType] = useState<'maker' | 'seeker' | null>(null)

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Get your assignments completed in record time with our efficient system"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Secure",
      description: "Your data and payments are protected with enterprise-grade security"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Top Quality",
      description: "Work with verified experts who deliver exceptional results"
    }
  ]

  const stats = [
    { number: "1000+", label: "Happy Students" },
    { number: "50+", label: "Expert Makers" },
    { number: "98%", label: "Success Rate" },
    { number: "24/7", label: "Support" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">AssignmentPro</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link 
                href="/auth/signin"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-gray-700 hover:bg-white/30 rounded-xl transition-all duration-300 font-semibold border border-white/30 hover:shadow-lg"
              >
                Maker Login
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl animate-bounce-gentle">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            <span className="gradient-text">Professional</span>
            <br />
            <span className="text-gray-800">Academic Services</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with verified assignment makers for your projects, research, and academic needs. 
            Experience quality, speed, and reliability like never before.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="card-glass">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              How can we help you today?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Service Seeker */}
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${
                  userType === 'seeker' 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/25' 
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-xl hover:shadow-2xl'
                }`}
                onClick={() => setUserType('seeker')}
              >
                <div className="p-8 relative z-10">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                      userType === 'seeker' ? 'bg-white/20' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      <Users className={`w-8 h-8 ${userType === 'seeker' ? 'text-white' : 'text-white'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 ${
                      userType === 'seeker' ? 'text-white' : 'text-gray-800'
                    }`}>
                      I need assignment help
                    </h3>
                    <p className={`text-lg leading-relaxed ${
                      userType === 'seeker' ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      Submit your assignment, project, or research work to our professional makers
                    </p>
                  </div>
                </div>
                {userType === 'seeker' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 shimmer"></div>
                )}
              </motion.div>

              {/* Assignment Maker */}
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${
                  userType === 'maker' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-500/25' 
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-xl hover:shadow-2xl'
                }`}
                onClick={() => setUserType('maker')}
              >
                <div className="p-8 relative z-10">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                      userType === 'maker' ? 'bg-white/20' : 'bg-gradient-to-br from-purple-500 to-pink-600'
                    }`}>
                      <BookOpen className={`w-8 h-8 ${userType === 'maker' ? 'text-white' : 'text-white'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 ${
                      userType === 'maker' ? 'text-white' : 'text-gray-800'
                    }`}>
                      I'm an Assignment Maker
                    </h3>
                    <p className={`text-lg leading-relaxed ${
                      userType === 'maker' ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      Join our platform as a professional assignment maker and earn money
                    </p>
                  </div>
                </div>
                {userType === 'maker' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 shimmer"></div>
                )}
              </motion.div>
            </div>

            {/* Action Button */}
            {userType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-12"
              >
                <Link
                  href={userType === 'seeker' ? '/request' : '/auth/signin'}
                  className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-glow transform hover:-translate-y-1"
                >
                  {userType === 'seeker' ? 'Submit Assignment' : 'Login / Register'}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              whileHover={{ y: -10 }}
              className="card group"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-glow transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}