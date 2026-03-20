"use client"

import { useEffect, useRef } from "react"
import { Star } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import CountUp from "@/components/count-up"
import { siteConfig } from "@/lib/site-config"

const topRow = siteConfig.reviews.topRow.map((r) => ({
  ...r,
  company: siteConfig.reviewSource,
  date: r.date,
}))

const bottomRow = siteConfig.reviews.bottomRow.map((r) => ({
  ...r,
  company: siteConfig.reviewSource,
  date: r.date,
}))

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

type Review = { name: string; initials: string; date: string; company: string; text: string }

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="w-[320px] shrink-0 md:w-[360px]">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="text-xs font-semibold">
                {review.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold leading-tight text-foreground">
                {review.name}
              </p>
              <p className="text-xs text-muted-foreground">{review.date}</p>
            </div>
          </div>
          <GoogleLogo />
        </div>
        <Stars />
        <p className="text-sm leading-relaxed text-muted-foreground">
          {review.text}
        </p>
      </CardContent>
    </Card>
  )
}

function Marquee({
  reviews,
  direction = "left",
}: {
  reviews: Review[]
  direction?: "left" | "right"
}) {
  return (
    <div className="marquee-row group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div
        className={`flex shrink-0 gap-4 py-2 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        } group-hover:[animation-play-state:paused]`}
      >
        {reviews.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>
      <div
        aria-hidden
        className={`flex shrink-0 gap-4 py-2 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        } group-hover:[animation-play-state:paused]`}
      >
        {reviews.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>
    </div>
  )
}

function CelebrateFigureLeft() {
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
      <circle cx="60" cy="30" r="14" />
      <path d="M60 44 L60 55" />
      <path d="M35 60 L85 60" />
      <path d="M48 60 C46 100, 48 140, 52 170" />
      <path d="M72 60 C74 100, 72 140, 62 170" />
      {/* Left arm — raised up */}
      <path d="M35 60 C28 45, 22 30, 18 10" />
      {/* Right arm — raised up */}
      <path d="M85 60 C88 45, 85 30, 80 10" />
      <path d="M52 170 C55 175, 59 175, 62 170" />
      <path d="M52 170 C48 205, 42 245, 38 280" />
      <path d="M38 280 L30 285" />
      <path d="M62 170 C66 205, 72 245, 78 280" />
      <path d="M78 280 L86 285" />
    </svg>
  )
}

function CelebrateFigureRight() {
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
      <circle cx="60" cy="30" r="14" />
      <path d="M60 44 L60 55" />
      <path d="M35 60 L85 60" />
      <path d="M48 60 C46 100, 48 140, 52 170" />
      <path d="M72 60 C74 100, 72 140, 62 170" />
      {/* Left arm — raised up and out */}
      <path d="M35 60 C25 42, 15 25, 5 8" />
      {/* Right arm — raised up and out */}
      <path d="M85 60 C95 42, 105 25, 115 8" />
      <path d="M52 170 C55 175, 59 175, 62 170" />
      <path d="M52 170 C48 205, 42 245, 38 280" />
      <path d="M38 280 L30 285" />
      <path d="M62 170 C66 205, 72 245, 78 280" />
      <path d="M78 280 L86 285" />
    </svg>
  )
}

export function Reviews() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!sectionRef.current || !leftRef.current || !rightRef.current) return

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
        leftRef.current,
        { xPercent: -200, opacity: 0 },
        { xPercent: 0, opacity: 1, ease: "none" },
        0
      )

      tl.fromTo(
        rightRef.current,
        { xPercent: 200, opacity: 0 },
        { xPercent: 0, opacity: 1, ease: "none" },
        0
      )

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
          }
        )
      }

      if (marqueeRef.current) {
        const rows = marqueeRef.current.querySelectorAll(".marquee-row")
        gsap.fromTo(
          rows,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: marqueeRef.current,
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
    <section ref={sectionRef} id="reviews" className="relative w-full overflow-hidden">
      <div
        ref={leftRef}
        className="pointer-events-none absolute right-[14%] top-1/2 -translate-y-1/2 text-primary opacity-15"
        aria-hidden="true"
      >
        <CelebrateFigureLeft />
      </div>
      <div
        ref={rightRef}
        className="pointer-events-none absolute right-[3%] top-1/2 -translate-y-1/2 text-primary opacity-15"
        aria-hidden="true"
      >
        <CelebrateFigureRight />
      </div>

      <div className="relative z-10 px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
        <h2 ref={titleRef} className="font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground opacity-0 sm:text-5xl md:text-6xl">
          What Our Members Say
        </h2>
        <p className="mt-4 text-lg font-semibold text-primary md:text-xl">
          <CountUp to={siteConfig.reviewCount} duration={2.5} separator="," />+ five star reviews
        </p>
      </div>

      <div ref={marqueeRef} className="relative z-10 flex flex-col gap-4 pb-20 md:pb-28 lg:pb-32">
        <Marquee reviews={topRow} direction="left" />
        <Marquee reviews={bottomRow} direction="right" />
      </div>
    </section>
  )
}
