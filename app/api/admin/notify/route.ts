import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendBookingCancellation, sendBookingReschedule } from "@/lib/email"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { data: role } = await supabase.rpc("get_my_role")
  if (role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  const { type, bookingId, newSlotId } = await request.json()

  const { data: booking } = await supabase.rpc("get_booking_details", { b_id: bookingId })

  if (!booking?.[0]) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  const b = booking[0]
  const start = new Date(b.start_time)
  const details = {
    customerEmail: b.email,
    customerName: b.full_name,
    packageTitle: b.title,
    date: start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    time: `${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} – ${new Date(b.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`,
    duration: b.duration_minutes,
  }

  if (type === "cancel") {
    await sendBookingCancellation(details)
  } else if (type === "reschedule" && newSlotId) {
    const { data: newSlot } = await supabase
      .from("time_slots")
      .select("start_time, end_time")
      .eq("id", newSlotId)
      .single()

    if (newSlot) {
      const ns = new Date(newSlot.start_time)
      await sendBookingReschedule(
        details,
        ns.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
        `${ns.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} – ${new Date(newSlot.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
      )
    }
  }

  return NextResponse.json({ sent: true })
}
