"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What should I wear?",
    answer:
      "Wear comfortable, form-fitting clothing that allows you to move freely — think leggings, a fitted top, and grip socks. Avoid anything too loose as it can get in the way of your form and your instructor's ability to correct alignment.",
  },
  {
    question: "Do I need any prior experience?",
    answer:
      "Not at all. Our classes cater to every level, from complete beginners to seasoned practitioners. Your instructor will offer modifications throughout the session so you can work at a pace that suits you.",
  },
  {
    question: "What equipment is provided?",
    answer:
      "Everything you need is here — reformers, mats, props, and accessories are all provided. Just bring yourself (and a water bottle). If you prefer your own grip socks, feel free to bring those too.",
  },
]

export function NewToPilates() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const content = sectionRef.current!.querySelector(".ntp-content")

      gsap.fromTo(
        content,
        { scale: 0.3, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none play reverse",
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="new-to-pilates" className="w-full border-y">
      <div className="px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
        <div className="ntp-content mx-auto max-w-2xl text-center">
          <h2 className="inline-block rounded-xl border px-6 py-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            New to Pilates?
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            Everyone starts somewhere. Pilates is for every body — regardless of
            age, fitness level, or flexibility. Our studio is a judgement-free
            zone where the only thing that matters is showing up and moving with
            intention.
          </p>

          <Accordion type="single" collapsible className="mt-10 w-full text-left">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10">
            <Button size="lg" className="gap-3 px-8 py-6 text-lg md:text-xl" asChild>
              <Link href="/book">
                Book Your First Class
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
