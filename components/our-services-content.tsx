"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Dumbbell, CircleDot, User, Users, UsersRound, Clock, Check, ArrowRight, type LucideIcon } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { siteConfig } from "@/lib/site-config"

const iconMap: Record<string, LucideIcon> = {
  Dumbbell,
  CircleDot,
  User,
  Users,
  UsersRound,
}

export function OurServicesContent() {
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const items = headerRef.current.querySelectorAll(".services-header-item")
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
              start: "top bottom",
              toggleActions: "play reverse play reverse",
            },
          }
        )
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".service-card")
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
              start: "top bottom",
              toggleActions: "play reverse play reverse",
            },
          }
        )
      }

      requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="min-h-screen w-full">
      <div className="relative w-full overflow-hidden bg-muted">
        <div className="relative z-10 px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
          <div ref={headerRef} className="max-w-2xl">
            <h1 className="services-header-item font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground opacity-0 sm:text-5xl md:text-6xl">
              What We Offer
            </h1>
            <p className="services-header-item mt-6 text-base leading-relaxed text-muted-foreground opacity-0 md:text-lg">
              From reformer to mat, private to group — find the session that fits your goals and schedule.
            </p>
          </div>

          <div
            ref={cardsRef}
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {siteConfig.services.map((service) => {
              const Icon = iconMap[service.icon] ?? Dumbbell
              return (
                <div key={service.title} className="service-card opacity-0">
                  <Card className="group h-full overflow-hidden border bg-background transition-shadow hover:shadow-lg">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted/60">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.style.display = "none" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="size-16 text-primary/20" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <Badge className="gap-1.5 bg-white/90 text-foreground backdrop-blur-sm hover:bg-white/90">
                          <Clock className="size-3" />
                          {service.duration}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="flex flex-col gap-3 pt-5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="size-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold leading-snug text-foreground">
                          {service.title}
                        </h2>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                      <ul className="flex flex-col gap-1.5 pt-1">
                        {service.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="size-3.5 shrink-0 text-primary" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                      <Button className="mt-2 w-full gap-2" asChild>
                        <Link href="/#book">
                          Book Now
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
