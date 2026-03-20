"use client"

import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ArrowUpRight } from "lucide-react"
import "./card-nav.css"

export interface CardNavItem {
  label: string
  href: string
  ariaLabel?: string
  bgColor?: string
  textColor?: string
}

interface CardNavProps {
  logo: ReactNode
  items: CardNavItem[]
  ctaLabel?: string
  ctaHref?: string
  onCtaClick?: () => void
  ease?: string
}

export function CardNav({
  logo,
  items,
  ctaLabel = "Get Started",
  ctaHref = "#",
  onCtaClick,
  ease = "power3.out",
}: CardNavProps) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const calculateHeight = () => {
    const navEl = navRef.current
    if (!navEl) return 260

    const isMobile = window.matchMedia("(max-width: 768px)").matches
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement | null
      if (contentEl) {
        const prevStyles = {
          visibility: contentEl.style.visibility,
          pointerEvents: contentEl.style.pointerEvents,
          position: contentEl.style.position,
          height: contentEl.style.height,
        }

        contentEl.style.visibility = "visible"
        contentEl.style.pointerEvents = "auto"
        contentEl.style.position = "static"
        contentEl.style.height = "auto"

        void contentEl.offsetHeight

        const topBar = 60
        const padding = 16
        const contentHeight = contentEl.scrollHeight

        contentEl.style.visibility = prevStyles.visibility
        contentEl.style.pointerEvents = prevStyles.pointerEvents
        contentEl.style.position = prevStyles.position
        contentEl.style.height = prevStyles.height

        const maxHeight = window.innerHeight - 24
        return Math.min(topBar + contentHeight + padding, maxHeight)
      }
    }
    return 260
  }

  const createTimeline = () => {
    const navEl = navRef.current
    if (!navEl) return null

    const cards = cardsRef.current.filter(Boolean)

    gsap.set(navEl, { height: 60, overflow: "hidden" })
    gsap.set(cards, { y: 50, opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    })

    tl.to(
      cards,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1"
    )

    return tl
  }

  useLayoutEffect(() => {
    const tl = createTimeline()
    tlRef.current = tl

    return () => {
      const tlToKill = tlRef.current
      if (tlToKill) {
        tlToKill.kill()
        tlRef.current = null
      }
      // Clear GSAP inline styles before unmount to prevent React "removeChild" conflicts
      if (navRef.current) {
        gsap.set(navRef.current, { clearProps: "height,overflow" })
      }
      cardsRef.current.forEach((el) => {
        if (el) gsap.set(el, { clearProps: "transform,opacity,y" })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items])

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return

      if (isExpanded) {
        const newHeight = calculateHeight()
        gsap.set(navRef.current, { height: newHeight })

        tlRef.current.kill()
        const newTl = createTimeline()
        if (newTl) {
          newTl.progress(1)
          tlRef.current = newTl
        }
      } else {
        tlRef.current.kill()
        const newTl = createTimeline()
        if (newTl) {
          tlRef.current = newTl
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded])

  const toggleMenu = () => {
    const tl = tlRef.current
    if (!tl) return
    if (!isExpanded) {
      setIsHamburgerOpen(true)
      setIsExpanded(true)
      tl.play(0)
    } else {
      setIsHamburgerOpen(false)
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false))
      tl.reverse()
    }
  }

  const handleLinkClick = () => {
    if (!isExpanded) return
    const tl = tlRef.current
    if (!tl) return
    setIsHamburgerOpen(false)
    tl.eventCallback("onReverseComplete", () => setIsExpanded(false))
    tl.reverse()
  }

  return (
    <div className="card-nav-container">
      <nav
        ref={navRef}
        className={`card-nav${isExpanded ? " open" : ""}`}
      >
        <div className="card-nav-top">
          <button
            className={`hamburger-menu${isHamburgerOpen ? " open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <div className="card-nav-logo">{logo}</div>

          {onCtaClick ? (
            <button
              className="card-nav-cta-button"
              onClick={() => {
                handleLinkClick()
                onCtaClick()
              }}
            >
              {ctaLabel}
            </button>
          ) : (
            <Link href={ctaHref} className="card-nav-cta-button" onClick={handleLinkClick}>
              {ctaLabel}
            </Link>
          )}
        </div>

        <div className="card-nav-content">
          {items.map((item, idx) => {
            const isHashLink = item.href.startsWith("#") || item.href.startsWith("/#")
            const LinkEl = isHashLink ? Link : "a"

            return (
              <div
                key={idx}
                ref={(el) => { cardsRef.current[idx] = el }}
                className="nav-card"
                style={{
                  backgroundColor: item.bgColor ?? "var(--muted)",
                  color: item.textColor ?? "var(--foreground)",
                }}
              >
                <LinkEl
                  href={item.href}
                  className="nav-card-link"
                  aria-label={item.ariaLabel ?? item.label}
                  onClick={isHashLink ? handleLinkClick : undefined}
                >
                  <span className="nav-card-label">{item.label}</span>
                  <ArrowUpRight size={18} className="nav-card-icon" aria-hidden />
                </LinkEl>
              </div>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
