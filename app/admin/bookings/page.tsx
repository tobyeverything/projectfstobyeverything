"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Loader2, CalendarDays, Clock, User, ArrowRight, X, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Booking {
  id: string
  status: string
  created_at: string
  customer: { full_name: string; email: string }
  package: { id: string; title: string; duration_minutes: number }
  time_slot: { id: string; start_time: string; end_time: string }
}

interface AvailableSlot {
  id: string
  start_time: string
  end_time: string
  max_capacity: number
  booked_count: number
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function formatDateKey(d: Date) {
  return d.toISOString().split("T")[0]
}

function getNext14Days() {
  const days: Date[] = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
}

export default function AdminBookingsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()))
  const days = useMemo(() => getNext14Days(), [])

  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [reschedulePackageId, setReschedulePackageId] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [rescheduling, setRescheduling] = useState(false)

  const fetchBookings = useCallback(async () => {
    const { data } = await supabase
      .from("bookings")
      .select(`
        id, status, created_at,
        customer:profiles!bookings_customer_id_fkey(full_name, email),
        package:packages!bookings_package_id_fkey(id, title, duration_minutes),
        time_slot:time_slots!bookings_time_slot_id_fkey(id, start_time, end_time)
      `)
      .neq("status", "cancelled")
      .order("created_at", { ascending: false })

    if (data) {
      setBookings(data.map((b: any) => ({
        ...b,
        customer: b.customer,
        package: b.package,
        time_slot: b.time_slot,
      })))
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const filteredBookings = bookings.filter((b) => {
    const slotDate = new Date(b.time_slot.start_time).toISOString().split("T")[0]
    return slotDate === selectedDate
  })

  async function openReschedule(booking: Booking) {
    setRescheduleId(booking.id)
    setReschedulePackageId(booking.package.id)
    setLoadingSlots(true)

    const now = new Date().toISOString()
    const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString()

    const { data: slots } = await supabase
      .from("time_slots")
      .select("id, start_time, end_time, max_capacity")
      .eq("package_id", booking.package.id)
      .gte("start_time", now)
      .lte("start_time", twoWeeks)
      .order("start_time")

    if (slots) {
      const withCounts = await Promise.all(
        slots.map(async (s) => {
          const { count } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("time_slot_id", s.id)
            .neq("status", "cancelled")
          return { ...s, booked_count: count ?? 0 }
        })
      )
      setAvailableSlots(withCounts.filter((s) => s.booked_count < s.max_capacity && s.id !== booking.time_slot.id))
    }
    setLoadingSlots(false)
  }

  async function handleReschedule(newSlotId: string) {
    if (!rescheduleId) return
    setRescheduling(true)

    fetch("/api/admin/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reschedule", bookingId: rescheduleId, newSlotId }),
    }).catch(() => {})

    await supabase
      .from("bookings")
      .update({ time_slot_id: newSlotId })
      .eq("id", rescheduleId)

    setRescheduleId(null)
    setAvailableSlots([])
    setRescheduling(false)
    await fetchBookings()
  }

  async function handleCancel(bookingId: string) {
    fetch("/api/admin/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cancel", bookingId }),
    }).catch(() => {})

    await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId)
    await fetchBookings()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Bookings</h1>
        <p className="mt-1 text-muted-foreground">{bookings.length} total active bookings</p>
      </div>

      {/* Date picker */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => {
          const key = formatDateKey(day)
          const isSelected = key === selectedDate
          const isToday = key === formatDateKey(new Date())
          const dayBookings = bookings.filter(
            (b) => new Date(b.time_slot.start_time).toISOString().split("T")[0] === key
          )
          return (
            <button
              key={key}
              onClick={() => setSelectedDate(key)}
              className={cn(
                "flex min-w-[4.5rem] flex-col items-center rounded-xl border-2 px-3 py-2.5 transition-all",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
              )}
            >
              <span className="text-xs font-medium text-muted-foreground">
                {isToday ? "Today" : dayNames[day.getDay()]}
              </span>
              <span className="text-lg font-semibold">{day.getDate()}</span>
              {dayBookings.length > 0 && (
                <span className="mt-0.5 rounded-full bg-primary/10 px-1.5 text-[10px] font-medium text-primary">
                  {dayBookings.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Reschedule modal */}
      {rescheduleId && (
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Reschedule to a new time</h3>
            <Button variant="ghost" size="sm" onClick={() => { setRescheduleId(null); setAvailableSlots([]) }}>
              <X className="size-4" />
            </Button>
          </div>
          {loadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No other available slots for this package.</p>
          ) : (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {availableSlots.map((slot) => {
                const start = new Date(slot.start_time)
                return (
                  <button
                    key={slot.id}
                    disabled={rescheduling}
                    onClick={() => handleReschedule(slot.id)}
                    className="flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div>
                      <p className="font-medium">
                        {start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </p>
                      <p className="text-muted-foreground">
                        {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        {" – "}
                        {new Date(slot.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Bookings for selected date */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 py-12 text-center">
          <CalendarDays className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">No bookings for this date</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings
            .sort((a, b) => new Date(a.time_slot.start_time).getTime() - new Date(b.time_slot.start_time).getTime())
            .map((booking) => {
              const start = new Date(booking.time_slot.start_time)
              const end = new Date(booking.time_slot.end_time)
              return (
                <div
                  key={booking.id}
                  className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="size-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{booking.package.title}</span>
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-medium",
                          booking.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        )}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        {" – "}
                        {end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        <span className="mx-1.5">·</span>
                        {booking.package.duration_minutes} min
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <User className="size-3" />
                        {booking.customer.full_name || booking.customer.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => openReschedule(booking)}
                    >
                      <CalendarDays className="size-3.5" />
                      Reschedule
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive gap-1.5"
                      onClick={() => handleCancel(booking.id)}
                    >
                      <X className="size-3.5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
