import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { sendBookingConfirmation } from "@/lib/email"

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any
    const bookingId = session.metadata?.booking_id

    if (bookingId) {
      const supabase = await createClient()
      await supabase.rpc("confirm_booking", {
        booking_id: bookingId,
        payment_id: session.payment_intent ?? "",
      })

      const { data: booking } = await supabase
        .rpc("get_booking_details", { b_id: bookingId })

      if (booking?.[0]) {
        const b = booking[0]
        const start = new Date(b.start_time)
        await sendBookingConfirmation({
          customerEmail: b.email,
          customerName: b.full_name,
          packageTitle: b.title,
          date: start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
          time: `${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} – ${new Date(b.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`,
          duration: b.duration_minutes,
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
