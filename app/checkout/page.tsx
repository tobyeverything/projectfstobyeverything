"use client"

import { Suspense, useEffect, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Loader2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>}>
      <CheckoutPageInner />
    </Suspense>
  )
}

function CheckoutPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package")
  const slotId = searchParams.get("slot")
  const cancelled = searchParams.get("cancelled")

  const [pkg, setPkg] = useState<any>(null)
  const [slot, setSlot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!packageId || !slotId) {
      router.push("/book")
      return
    }

    Promise.all([
      supabase.from("packages").select("*").eq("id", packageId).single(),
      supabase.from("time_slots").select("*").eq("id", slotId).single(),
    ]).then(([pkgRes, slotRes]) => {
      setPkg(pkgRes.data)
      setSlot(slotRes.data)
      setLoading(false)
    })
  }, [supabase, packageId, slotId, router])

  async function handlePay() {
    setPaying(true)
    setError(null)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, slotId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong")
        setPaying(false)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setError("Network error. Please try again.")
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!pkg || !slot) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Booking details not found.</p>
      </div>
    )
  }

  const startTime = new Date(slot.start_time)
  const endTime = new Date(slot.end_time)

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/book" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-1 inline size-3.5" />
            Back to booking
          </Link>
          <h1 className="font-serif text-lg font-semibold">Checkout</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12">
        {cancelled && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <AlertCircle className="size-5 text-destructive" />
            <p className="text-sm text-destructive">Payment was cancelled. You can try again below.</p>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-semibold">Complete your booking</h2>
          <p className="text-muted-foreground">Review the details below and pay to confirm your spot</p>
        </div>

        <div className="mt-8 divide-y rounded-xl border">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm text-muted-foreground">Class</p>
              <p className="text-lg font-semibold">{pkg.title}</p>
              <p className="text-sm text-muted-foreground">{pkg.duration_minutes} minutes</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${(pkg.price_cents / 100).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">USD</p>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">
              {startTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="font-medium">
              {startTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
              {" – "}
              {endTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <AlertCircle className="size-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          onClick={handlePay}
          disabled={paying}
          size="lg"
          className="mt-8 w-full gap-2 py-6 text-base"
        >
          {paying ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <CreditCard className="size-4" />
              Pay ${(pkg.price_cents / 100).toFixed(2)}
            </>
          )}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Secure payment processed by Stripe. By completing this purchase you agree to our terms.
        </p>
      </div>
    </div>
  )
}
