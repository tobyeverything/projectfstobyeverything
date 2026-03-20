import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { OurServicesContent } from "@/components/our-services-content"
import { Footer } from "@/components/footer"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `What We Offer | ${siteConfig.name}`,
  description: `Explore our Pilates services — reformer, mat, private, duet, and group classes. Find the session that fits your goals.`,
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <OurServicesContent />
      <Footer />
    </>
  )
}
