"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { siteConfig } from "@/lib/site-config"
import { createClient } from "@/lib/supabase/client"
import { CardNav, type CardNavItem } from "@/components/card-nav"
import type { User } from "@supabase/supabase-js"

const baseItems: CardNavItem[] = [
  { label: "About", href: "/#about", ariaLabel: "About", bgColor: "var(--muted)", textColor: "var(--foreground)" },
  { label: "Reviews", href: "/#reviews", ariaLabel: "Reviews", bgColor: "var(--muted)", textColor: "var(--foreground)" },
  { label: "New to Pilates?", href: "/#new-to-pilates", ariaLabel: "New to Pilates", bgColor: "var(--muted)", textColor: "var(--foreground)" },
  { label: "What We Offer", href: "/services", ariaLabel: "What We Offer", bgColor: "var(--muted)", textColor: "var(--foreground)" },
]

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string>("customer")

  useEffect(() => {
    const supabase = createClient()

    function fetchRole() {
      supabase.rpc("get_my_role").then(({ data: r }) => {
        if (r) setRole(r)
      })
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchRole()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchRole()
      } else {
        setRole("customer")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const items: CardNavItem[] = [
    ...baseItems,
    ...(user
      ? [
          { label: "My Bookings", href: "/my-bookings", ariaLabel: "My Bookings", bgColor: "var(--secondary)", textColor: "var(--secondary-foreground)" },
          { label: "Book a Class", href: "/book", ariaLabel: "Book a Class", bgColor: "var(--primary)", textColor: "var(--primary-foreground)" },
          ...(role === "admin"
            ? [{ label: "Admin", href: "/admin", ariaLabel: "Admin Dashboard", bgColor: "var(--accent)", textColor: "var(--accent-foreground)" }]
            : []),
        ]
      : [
          { label: "Log In", href: "/login", ariaLabel: "Log in", bgColor: "var(--secondary)", textColor: "var(--secondary-foreground)" },
          { label: "Book a Class", href: "/#book", ariaLabel: "Book a Class", bgColor: "var(--primary)", textColor: "var(--primary-foreground)" },
        ]),
  ]

  const nameParts = siteConfig.name.split(" ")
  const last = nameParts.at(-1)
  const rest = nameParts.slice(0, -1).join(" ")

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <CardNav
      logo={
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {rest} <span className="text-primary">{last}</span>
          </span>
        </Link>
      }
      items={items}
      ctaLabel={user ? "Sign Out" : "Book Now"}
      ctaHref={user ? "#" : "/book"}
      onCtaClick={user ? handleSignOut : undefined}
    />
  )
}
