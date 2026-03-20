import Link from "next/link"
import { MapPin, Phone, Clock, MessageCircle, Instagram, Facebook } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

const quickLinks = [
  { label: "About", href: "/#about" },
  { label: "What We Offer", href: "/services" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Book a Class", href: "/#book" },
  { label: "New to Pilates?", href: "/#new-to-pilates" },
]

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted">
      <div className="px-6 py-16 md:px-10 md:py-20 lg:px-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {siteConfig.name.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-primary">{siteConfig.name.split(" ").at(-1)}</span>
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline} A studio where discipline meets flow —
              designed for anyone ready to invest in how their body feels.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Opening Hours
            </h3>
            <div className="flex flex-col gap-2.5">
              {siteConfig.hours.map((item) => (
                <div key={item.day} className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {item.day}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3" />
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Location */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Find Us
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {siteConfig.address}
              </a>
              <a
                href={siteConfig.phoneHref}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="size-4 shrink-0" />
                {siteConfig.phone}
              </a>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <MessageCircle className="size-4 shrink-0" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="mt-12 overflow-hidden rounded-xl border">
          <iframe
            src={siteConfig.googleMapsEmbedUrl}
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${siteConfig.name} studio location`}
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
