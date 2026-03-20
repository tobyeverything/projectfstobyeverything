"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Clock, Package, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

interface Booking {
  id: string
  status: string
  created_at: string
  package: { title: string; duration_minutes: number }
  time_slot: { start_time: string; end_time: string }
}

export default function MyBookingsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("bookings")
        .select(`
          id, status, created_at,
          package:packages!bookings_package_id_fkey(title, duration_minutes),
          time_slot:time_slots!bookings_time_slot_id_fkey(start_time, end_time)
        `)
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })

      if (data) {
        setBookings(data.map((b: any) => ({
          ...b,
          package: b.package,
          time_slot: b.time_slot,
        })))
      }
      setLoading(false)
    }

    fetch()
  }, [supabase])

  const upcoming = bookings.filter(
    (b) => b.status !== "cancelled" && new Date(b.time_slot.start_time) > new Date()
  )
  const past = bookings.filter(
    (b) => b.status === "cancelled" || new Date(b.time_slot.start_time) <= new Date()
  )

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-1 inline size-3.5" />
            {siteConfig.name}
          </Link>
          <h1 className="font-serif text-lg font-semibold">My Bookings</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {bookings.length === 0 ? (
          <div className="py-20 text-center">
            <CalendarDays className="mx-auto size-12 text-muted-foreground/30" />
            <h2 className="mt-4 font-serif text-2xl font-semibold">No bookings yet</h2>
            <p className="mt-2 text-muted-foreground">Book your first class to get started</p>
            <Button className="mt-6" asChild>
              <Link href="/book">Book a Class</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {upcoming.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold">Upcoming</h2>
                <div className="space-y-3">
                  {upcoming.map((booking) => {
                    const start = new Date(booking.time_slot.start_time)
                    const end = new Date(booking.time_slot.end_time)
                    return (
                      <div key={booking.id} className="rounded-xl border bg-card p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <Package className="size-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold">{booking.package.title}</span>
                              <span className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                                booking.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                              )}>
                                {booking.status === "paid" ? "Confirmed" : booking.status}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <CalendarDays className="size-3.5" />
                                {start.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="size-3.5" />
                                {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                                {" – "}
                                {end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold text-muted-foreground">Past / Cancelled</h2>
                <div className="space-y-3">
                  {past.map((booking) => {
                    const start = new Date(booking.time_slot.start_time)
                    return (
                      <div key={booking.id} className="rounded-xl border bg-card/50 p-5 opacity-60">
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Package className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                            <span className="font-medium">{booking.package.title}</span>
                            <p className="text-sm text-muted-foreground">
                              {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              {" · "}
                              {booking.status === "cancelled" ? "Cancelled" : "Completed"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button asChild>
                <Link href="/book">Book another class</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
