"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Brain, Activity, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/collaboration", label: "Agent Collab", icon: Users },
  { href: "/production", label: "Production", icon: Activity },
  { href: "/memory", label: "Memory", icon: Brain },
  { href: "/history", label: "History", icon: Clock },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-6 py-3 flex items-center gap-8">
      <div className="flex items-center gap-2 pr-6 border-r border-white/10">
        <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
        <span className="font-heading font-bold text-white tracking-wider text-lg">ForgeMind</span>
      </div>
      
      <div className="flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors text-sm font-medium ${
                isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
