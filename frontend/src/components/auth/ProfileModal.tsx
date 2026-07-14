'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'

interface ProfileModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ProfileModal({ open, setOpen }: ProfileModalProps) {
  const { data: session } = useSession()
  const user = session?.user as {
    name?: string | null
    email?: string | null
    image?: string | null
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-sm p-0 overflow-hidden border-0"
        style={{
          background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
          borderRadius: '1.25rem',
          boxShadow:
            '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
        }}
      >
        {/* Decorative blurred background blobs */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            borderRadius: '1.25rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(109,40,217,0.45) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(236,72,153,0.35) 0%, transparent 70%)',
              filter: 'blur(25px)',
            }}
          />
        </div>

        {/* Header banner */}
        <div
          className="relative h-24 w-full flex-shrink-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(109,40,217,0.7) 0%, rgba(236,72,153,0.6) 100%)',
          }}
        />

        {/* Avatar — centred over the banner */}
        <div className="relative flex flex-col items-center px-8 pb-8" style={{ marginTop: '-48px' }}>
          <div
            style={{
              padding: '4px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              boxShadow: '0 0 0 4px rgba(255,255,255,0.06)',
            }}
          >
            <Avatar
              style={{
                width: '88px',
                height: '88px',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
              <AvatarFallback
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  color: '#fff',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Accessibility: hidden title / description for screen readers */}
          <DialogTitle className="sr-only">User Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Your account information
          </DialogDescription>

          {/* Name */}
          <h2
            className="mt-4 text-center text-xl font-bold leading-tight"
            style={{ color: '#f1f5f9' }}
          >
            {user?.name ?? 'Unknown User'}
          </h2>

          {/* Email */}
          <p
            className="mt-1 text-center text-sm"
            style={{ color: 'rgba(226,232,240,0.65)' }}
          >
            {user?.email ?? '—'}
          </p>

          {/* Divider */}
          <div
            className="my-5 w-full"
            style={{
              height: '1px',
              background: 'rgba(255,255,255,0.08)',
            }}
          />

          {/* Info card */}
          <div
            className="w-full rounded-xl px-4 py-3 space-y-3"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <ProfileField
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 16, height: 16, color: '#a78bfa' }}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
              label="Name"
              value={user?.name ?? '—'}
            />
            <ProfileField
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 16, height: 16, color: '#f472b6' }}
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              }
              label="Email"
              value={user?.email ?? '—'}
            />
          </div>

          {/* Close button */}
          <button
            id="profile-modal-close"
            onClick={() => setOpen(false)}
            className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 15px rgba(124,58,237,0.35)',
            }}
            onMouseOver={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = '0.88')
            }
            onMouseOut={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = '1')
            }
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p
          className="text-xs font-medium mb-0.5"
          style={{ color: 'rgba(226,232,240,0.45)' }}
        >
          {label}
        </p>
        <p
          className="text-sm font-medium truncate"
          style={{ color: '#e2e8f0' }}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
