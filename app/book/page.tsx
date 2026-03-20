"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, CreditCard, Package as PackageIcon, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { PackageSelector, type Package } from "@/components/book/package-selector"
import { TimeSlotPicker, type TimeSlot } from "@/components/book/time-slot-picker"
import { siteConfig } from "@/lib/site-config"

const STEPS = ["Package", "Time", "Review"] as const
type Step = (typeof STEPS)[number]

export default function BookPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPackage = searchParams.get("package")

  const [step, setStep] = useState<Step>("Package")
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [loadingPkgs, setLoadingPkgs] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase
      .from("packages")
      .select("id, title, description, duration_minutes, price_cents")
      .eq("active", true)
      .order("price_cents")
      .then(({ data }) => {
        if (data) {
          setPackages(data)
          if (preselectedPackage) {
            const match = data.find(
              (p) => p.title.toLowerCase().replace(/\s+/g, "-") === preselectedPackage
            )
            if (match) setSelectedPkgId(match.id)
          }
        }
        setLoadingPkgs(false)
      })
  }, [supabase, preselectedPackage])

  useEffect(() => {
    if (!selectedPkgId) return
    setLoadingSlots(true)
    setSelectedSlotId(null)

    const now = new Date().toISOString()
    const weekLater = new Date(Date.now() + 7 * 86400000).toISOString()

    supabase
      .from("time_slots")
      .select("id, start_time, end_time, max_capacity")
      .eq("package_id", selectedPkgId)
      .gte("start_time", now)
      .lte("start_time", weekLater)
      .order("start_time")
      .then(async ({ data: slotsData }) => {
        if (!slotsData) {
          setSlots([])
          setLoadingSlots(false)
          return
        }

        const slotsWithBookings: TimeSlot[] = await Promise.all(
          slotsData.map(async (s) => {
            const { count } = await supabase
              .from("bookings")
              .select("*", { count: "exact", head: true })
              .eq("time_slot_id", s.id)
              .neq("status", "cancelled")
            return { ...s, booked_count: count ?? 0 }
          })
        )

        setSlots(slotsWithBookings)
        setLoadingSlots(false)
      })
  }, [supabase, selectedPkgId])

  const selectedPkg = packages.find((p) => p.id === selectedPkgId)
  const selectedSlot = slots.find((s) => s.id === selectedSlotId)

  const stepIndex = STEPS.indexOf(step)

  function goNext() {
    if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1])
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setStep(STEPS[stepIndex - 1])
    }
  }

  function handleCheckout() {
    if (!selectedPkgId || !selectedSlotId) return
    const params = new URLSearchParams({
      package: selectedPkgId,
      slot: selectedSlotId,
    })
    router.push(`/checkout?${params.toString()}`)
  }

  const canProceed =
    (step === "Package" && selectedPkgId) ||
    (step === "Time" && selectedSlotId) ||
    step === "Review"

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-1 inline size-3.5" />
            {siteConfig.name}
          </Link>
          <h1 className="font-serif text-lg font-semibold">Book a Class</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Steps indicator */}
        <div className="mb-10 flex items-center justify-center gap-1">
          {STEPS.map((s, i) => {
            const active = i === stepIndex
            const completed = i < stepIndex
            const Icon = i === 0 ? PackageIcon : i === 1 ? Calendar : CreditCard
            return (
              <div key={s} className="flex items-center gap-1">
                <div className="flex items-center gap-2">
                  <div className={`flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : completed
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="size-4" />
                  </div>
                  <span className={`hidden text-sm font-medium sm:inline ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-2 h-px w-8 sm:w-16 ${
                    completed ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        {step === "Package" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-3xl font-semibold">Choose your class</h2>
              <p className="mt-1 text-muted-foreground">Select the type of session you&apos;d like to book</p>
            </div>
            {loadingPkgs ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : (
              <PackageSelector
                packages={packages}
                selectedId={selectedPkgId}
                onSelect={setSelectedPkgId}
              />
            )}
          </div>
        )}

        {step === "Time" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-3xl font-semibold">Pick a time</h2>
              <p className="mt-1 text-muted-foreground">
                Available slots for <span className="font-medium text-foreground">{selectedPkg?.title}</span>
              </p>
            </div>
            <TimeSlotPicker
              slots={slots}
              selectedId={selectedSlotId}
              onSelect={setSelectedSlotId}
              loading={loadingSlots}
            />
          </div>
        )}

        {step === "Review" && selectedPkg && selectedSlot && (
          <div className="mx-auto max-w-lg space-y-6">
            <div>
              <h2 className="font-serif text-3xl font-semibold">Review your booking</h2>
              <p className="mt-1 text-muted-foreground">Confirm the details and proceed to payment</p>
            </div>

            <div className="divide-y rounded-xl border">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">{selectedPkg.title}</p>
                </div>
                <span className="text-lg font-semibold">${(selectedPkg.price_cents / 100).toFixed(0)}</span>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-muted-foreground">Date &amp; Time</p>
                <p className="font-medium">
                  {new Date(selectedSlot.start_time).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedSlot.start_time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  {" – "}
                  {new Date(selectedSlot.end_time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{selectedPkg.duration_minutes} minutes</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          {step === "Review" ? (
            <Button onClick={handleCheckout} className="gap-2" size="lg">
              Proceed to Checkout
              <CreditCard className="size-4" />
            </Button>
          ) : (
            <Button onClick={goNext} disabled={!canProceed} className="gap-2">
              Continue
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
