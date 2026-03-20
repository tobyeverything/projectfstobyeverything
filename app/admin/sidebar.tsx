"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Package, Users, LayoutDashboard, ArrowLeft, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/timetable", label: "Timetable", icon: CalendarDays },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-muted/30 md:block">
      <div className="flex h-full flex-col">
        <div className="border-b px-6 py-5">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-1 inline size-3.5" />
            Back to site
          </Link>
          <h2 className="mt-2 font-serif text-xl font-semibold">{siteConfig.name}</h2>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
