'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

interface SignOutButtonProps {
  className?: string
  children?: React.ReactNode
  showIcon?: boolean
}

export function SignOutButton({ className = '', children, showIcon = true }: SignOutButtonProps) {
  const router = useRouter()

  const handleSignOut = () => {
    router.push('/auth/signout')
  }

  return (
    <button
      onClick={handleSignOut}
      className={`flex items-center space-x-2 transition-colors ${className}`}
    >
      {showIcon && <LogOut className="w-5 h-5" />}
      <span>{children || 'Sign Out'}</span>
    </button>
  )
}