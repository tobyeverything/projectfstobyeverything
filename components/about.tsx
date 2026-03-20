"use client"

import { useEffect, useRef } from "react"
import { Heart, Users, Sparkles } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import TiltedCard from "@/components/tilted-card"
import { siteConfig } from "@/lib/site-config"

const values = [
  {
    icon: Sparkles,
    title: "Intentional Movement",
    description:
      "Every exercise is purposeful. We focus on quality over quantity — building strength, flexibility, and body awareness through controlled, mindful movement.",
  },
  {
    icon: Heart,
    title: "Expert Instructors",
    description:
      "Our certified instructors bring years of experience and a genuine passion for the craft. They'll guide your form, push your limits, and meet you where you are.",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    description:
      "We keep our classes intimate so every session feels personal. No crowds, no distractions — just focused work and a community that shows up for each other.",
  },
]

function FigureLeft() {
  return (
    <svg
      viewBox="0 0 120 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-72 w-auto md:h-96 lg:h-[28rem]"
    >
      <circle cx="55" cy="30" r="14" />
      <path d="M55 44 L55 55" />
      <path d="M30 60 L80 60" />
      <path d="M42 60 C40 100, 42 140, 50 170" />
      <path d="M68 60 C70 100, 68 140, 60 170" />
      <path d="M80 60 C95 48, 105 38, 115 30" />
      <path d="M30 60 C22 80, 25 105, 32 125" />
      <path d="M50 170 C53 175, 57 175, 60 170" />
      <path d="M50 170 C45 205, 35 245, 25 280" />
      <path d="M25 280 L15 285" />
      <path d="M60 170 C68 205, 78 245, 92 275" />
      <path d="M92 275 L102 280" />
    </svg>
  )
}

function FigureRight() {
  return (
    <svg
      viewBox="0 0 120 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-72 w-auto md:h-96 lg:h-[28rem]"
    >
      <circle cx="65" cy="30" r="14" />
      <path d="M65 44 L65 55" />
      <path d="M40 60 L90 60" />
      <path d="M52 60 C50 100, 52 140, 55 170" />
      <path d="M78 60 C80 100, 78 140, 65 170" />
      <path d="M40 60 C25 48, 15 38, 5 30" />
      <path d="M90 60 C98 80, 95 105, 88 125" />
      <path d="M55 170 C58 175, 62 175, 65 170" />
      <path d="M65 170 C70 205, 80 245, 95 280" />
      <path d="M95 280 L105 285" />
      <path d="M55 170 C48 205, 38 245, 25 275" />
      <path d="M25 275 L15 280" />
    </svg>
  )
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftFigureRef = useRef<HTMLDivElement>(null)
  const rightFigureRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!sectionRef.current || !leftFigureRef.current || !rightFigureRef.current)
      return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          end: "top 40%",
          scrub: 1,
        },
      })

      tl.fromTo(
        leftFigureRef.current,
        { xPercent: -200, opacity: 0 },
        { xPercent: 0, opacity: 1, ease: "none" },
        0
      )

      tl.fromTo(
        rightFigureRef.current,
        { xPercent: 200, opacity: 0 },
        { xPercent: 0, opacity: 1, ease: "none" },
        0
      )

      if (headerRef.current) {
        const items = headerRef.current.querySelectorAll(".about-header-item")
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
          }
        )
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".about-card")
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
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden bg-muted"
    >
      <div
        ref={leftFigureRef}
        className="pointer-events-none absolute right-[14%] top-1/2 -translate-y-1/2 text-primary opacity-15"
        aria-hidden="true"
      >
        <FigureLeft />
      </div>
      <div
        ref={rightFigureRef}
        className="pointer-events-none absolute right-[3%] top-1/2 -translate-y-1/2 text-primary opacity-15"
        aria-hidden="true"
      >
        <FigureRight />
      </div>

      <div className="relative z-10 px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
        <div ref={headerRef} className="max-w-2xl">
          <Badge
            variant="secondary"
            className="about-header-item mb-4 text-xs uppercase tracking-widest opacity-0"
          >
            About Us
          </Badge>
          <h2 className="about-header-item font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground opacity-0 sm:text-5xl md:text-6xl">
            Movement with purpose
          </h2>
          <p className="about-header-item mt-6 text-base leading-relaxed text-muted-foreground opacity-0 md:text-lg">
            {siteConfig.about}
          </p>
        </div>

        <Separator className="my-12 bg-border/60 md:my-16" />

        <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="about-card opacity-0">
              <TiltedCard showTooltip captionText={value.title}>
                <Card className="h-full border-none bg-background [transform-style:preserve-3d]">
                  <CardContent className="flex flex-col gap-4 [transform-style:preserve-3d]">
                    <div data-depth="2" className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <value.icon className="size-6 text-primary" />
                    </div>
                    <h3 data-depth="1" className="w-fit rounded-md border border-border/50 bg-muted/50 px-2 py-1 text-xl font-semibold leading-snug text-foreground">
                      {value.title}
                    </h3>
                    <p data-depth="1" className="text-base leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </TiltedCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
