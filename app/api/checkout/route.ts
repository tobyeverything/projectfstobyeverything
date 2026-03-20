import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { packageId, slotId } = await request.json()

    if (!packageId || !slotId) {
      return NextResponse.json({ error: "Missing packageId or slotId" }, { status: 400 })
    }

    const { data: pkg } = await supabase
      .from("packages")
      .select("*")
      .eq("id", packageId)
      .single()

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    const { data: slot } = await supabase
      .from("time_slots")
      .select("*")
      .eq("id", slotId)
      .single()

    if (!slot) {
      return NextResponse.json({ error: "Time slot not found" }, { status: 404 })
    }

    const { count } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("time_slot_id", slotId)
      .neq("status", "cancelled")

    if ((count ?? 0) >= slot.max_capacity) {
      return NextResponse.json({ error: "This slot is fully booked" }, { status: 409 })
    }

    const { data: booking } = await supabase
      .from("bookings")
      .insert({
        customer_id: user.id,
        package_id: packageId,
        time_slot_id: slotId,
        status: "pending",
      })
      .select("id")
      .single()

    if (!booking) {
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    const startTime = new Date(slot.start_time).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })

    const { origin } = new URL(request.url)

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${pkg.title} – ${startTime}`,
              description: pkg.description,
            },
            unit_amount: pkg.price_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        booking_id: booking.id,
        user_id: user.id,
      },
      success_url: `${origin}/checkout/success?booking=${booking.id}`,
      cancel_url: `${origin}/checkout?package=${packageId}&slot=${slotId}&cancelled=1`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: err.message ?? "Internal error" }, { status: 500 })
  }
}
