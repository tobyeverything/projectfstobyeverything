"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Search, MessageCircle, CalendarCheck, ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TiltedCard from "@/components/tilted-card"
import { siteConfig } from "@/lib/site-config"

const steps = [
  {
    number: "01",
    title: "Choose Your Class",
    description:
      "Browse our class types — from beginner mat work to advanced reformer sessions — and pick the one that fits your goals.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select a Time Slot",
    description:
      "View available dates and times on our live timetable. Pick a slot that works for your schedule.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Pay & Confirm",
    description:
      "Complete your booking with a secure online payment. You'll receive instant confirmation — no back-and-forth needed.",
    icon: MessageCircle,
  },
]

export function HowToBook() {
  const sectionRef = useRef<HTMLElement>(null)
  const figureRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const svg = svgRef.current
    if (!sectionRef.current || !figureRef.current || !svg) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          end: "top 35%",
          scrub: 1,
        },
      })

      const leftArm = svg.querySelector(".scratch-arm")
      const qMark = svg.querySelector(".q-mark")

      tl.fromTo(
        figureRef.current,
        { scale: 0.1, opacity: 0 },
        { scale: 1, opacity: 1, ease: "none", duration: 0.4 },
        0
      )

      tl.fromTo(
        leftArm,
        { attr: { d: "M35 96 C28 115, 22 132, 15 148" } },
        { attr: { d: "M35 96 C25 80, 35 60, 52 50" }, ease: "none", duration: 0.6 },
        0.4
      )

      tl.fromTo(
        qMark,
        { attr: { y: 40 }, opacity: 0 },
        { attr: { y: 28 }, opacity: 1, ease: "none", duration: 0.6 },
        0.4
      )

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".step-card")
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
          }
        )
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              toggleActions: "play reverse play reverse",
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="book" className="w-full bg-muted">
      <div className="px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
        <div className="flex items-center gap-3 md:gap-5">
          <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            How to Book a Class
          </h2>
          <div
            ref={figureRef}
            className="inline-block origin-center text-primary"
            aria-hidden="true"
          >
            <svg
              ref={svgRef}
              viewBox="0 0 140 160"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-20 w-auto sm:h-24 md:h-28 lg:h-32"
            >
              <text
                className="q-mark"
                x="70"
                y="28"
                textAnchor="middle"
                fontSize="40"
                fontWeight="700"
                fontFamily="serif"
                fill="currentColor"
                stroke="none"
                opacity="0"
              >
                ?
              </text>
              <circle cx="70" cy="55" r="18" />
              <path d="M70 73 L70 88" />
              <path d="M35 96 L105 96" />
              <path d="M55 96 C53 115, 55 135, 57 155" />
              <path d="M85 96 C87 115, 85 135, 83 155" />
              <path className="scratch-arm" d="M35 96 C28 115, 22 132, 15 148" />
              <path d="M105 96 C115 112, 122 125, 130 135" />
              <path d="M130 135 C133 132, 135 128, 132 125" />
            </svg>
          </div>
        </div>

        <div ref={cardsRef} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="step-card opacity-0">
              <TiltedCard showTooltip captionText={step.title}>
                <Card className="h-full border-none bg-background [transform-style:preserve-3d]">
                  <CardContent className="flex flex-col gap-4 [transform-style:preserve-3d]">
                    <div data-depth="2" className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <step.icon className="size-6 text-primary" />
                    </div>
                    <span data-depth="1" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Step {step.number}
                    </span>
                    <h3 data-depth="1" className="w-fit rounded-md border border-border/50 bg-muted/50 px-2 py-1 text-xl font-semibold leading-snug text-foreground">
                      {step.title}
                    </h3>
                    <p data-depth="1" className="text-base leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </TiltedCard>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="mt-10 flex justify-center opacity-0">
          <Button
            size="lg"
            className="gap-3 px-8 py-6 text-lg font-semibold md:text-xl"
            asChild
          >
            <Link href="/book">
              Book a Class Now
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
