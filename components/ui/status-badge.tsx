import { cn } from '@/lib/utils'
import { ASSIGNMENT_STATUS, STATUS_COLORS } from '@/lib/constants'

interface StatusBadgeProps {
  status: keyof typeof ASSIGNMENT_STATUS
  isApproved?: boolean
  className?: string
}

export function StatusBadge({ status, isApproved, className }: StatusBadgeProps) {
  const getStatusText = () => {
    if (status === 'COMPLETED') return 'Completed'
    if (status === 'REJECTED') return 'Rejected'
    if (status === 'IN_PROGRESS' && isApproved) return 'Approved - In Progress'
    if (status === 'PENDING' && isApproved) return 'Approved - Ready to Start'
    return 'Pending Admin Approval'
  }

  const getStatusColor = () => {
    if (status === 'COMPLETED') return 'text-green-600 bg-green-100'
    if (status === 'REJECTED') return 'text-red-600 bg-red-100'
    if (status === 'IN_PROGRESS' && isApproved) return 'text-blue-600 bg-blue-100'
    return 'text-yellow-600 bg-yellow-100'
  }

  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      getStatusColor(),
      className
    )}>
      {getStatusText()}
    </span>
  )
}

interface ApprovalBadgeProps {
  isApproved: boolean
  className?: string
}

export function ApprovalBadge({ isApproved, className }: ApprovalBadgeProps) {
  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      isApproved 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800',
      className
    )}>
      {isApproved ? 'Approved' : 'Pending'}
    </span>
  )
}

interface PaymentBadgeProps {
  isPaid: boolean
  className?: string
}

export function PaymentBadge({ isPaid, className }: PaymentBadgeProps) {
  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      isPaid 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800',
      className
    )}>
      {isPaid ? 'Fee Paid' : 'Fee Pending'}
    </span>
  )
}