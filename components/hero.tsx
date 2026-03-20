"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

const words = siteConfig.tagline.split(" ").map((w) => (w.endsWith(".") ? w : `${w}.`))

function SplitWord({ word }: { word: string }) {
  return (
    <span className="hero-word inline-flex overflow-hidden">
      {word.split("").map((char, i) => (
        <span key={i} className="hero-char inline-block translate-y-full">
          {char}
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!wrapperRef.current || !headlineRef.current) return

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (prefersReduced) {
        gsap.set(".hero-char", { y: "0%" })
        return
      }

      const wordEls = headlineRef.current!.querySelectorAll(".hero-word")

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      })

      wordEls.forEach((wordEl, i) => {
        const chars = wordEl.querySelectorAll(".hero-char")
        tl.fromTo(
          chars,
          { y: "100%" },
          { y: "0%", stagger: 0.04, ease: "power3.out", duration: 0.5 },
          i * 0.3
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} className="relative h-[calc(100vh+500px)]">
    <section className="sticky top-0 flex h-screen w-full items-end overflow-hidden">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/hero-bg.png"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 flex w-full flex-col gap-6 px-6 pb-16 md:px-10 md:pb-20 lg:px-16 lg:pb-24">
        <h1
          ref={headlineRef}
          className="flex max-w-3xl flex-col text-5xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {words.map((word) => (
            <SplitWord key={word} word={word} />
          ))}
        </h1>
        <div>
          <Button size="lg" className="gap-3 px-8 py-6 text-lg md:text-xl" asChild>
            <Link href="/book">
              Book A Class Now
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
    </div>
  )
}
