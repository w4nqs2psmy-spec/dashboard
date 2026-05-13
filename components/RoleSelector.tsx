'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Role } from '@/types'

const roles: { value: Role; label: string; path: string; icon: string }[] = [
  { value: 'teacher', label: 'Opettaja', path: '/opettaja', icon: '📋' },
  { value: 'student', label: 'Opiskelija', path: '/opiskelija', icon: '📚' },
  { value: 'guardian', label: 'Huoltaja', path: '/huoltaja', icon: '🏠' },
]

export default function RoleSelector() {
  const router = useRouter()
  const pathname = usePathname()

  const currentRole = roles.find(r => pathname.startsWith(r.path))

  return (
    <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1">
      {roles.map(role => {
        const isActive = currentRole?.value === role.value
        return (
          <button
            key={role.value}
            onClick={() => router.push(role.path)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <span>{role.icon}</span>
            <span>{role.label}</span>
          </button>
        )
      })}
    </div>
  )
}
