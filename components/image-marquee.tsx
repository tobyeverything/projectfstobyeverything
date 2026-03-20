"use client"

/**
 * Image marquee — scrolls right-to-left, images only.
 */
const IMAGES = [
  "/marquee/marquee-1.png",
  "/marquee/marquee-2.png",
  "/marquee/marquee-3.png",
  "/marquee/marquee-4.png",
  "/marquee/marquee-5.png",
  "/marquee/marquee-6.png",
  "/marquee/marquee-7.png",
]

export function ImageMarquee() {
  return (
    <section className="relative overflow-hidden py-6 md:py-8" aria-hidden>
      <div className="marquee-row group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex shrink-0 gap-4 animate-marquee-left group-hover:[animation-play-state:paused]">
          {IMAGES.map((src, i) => (
            <div
              key={`a-${i}`}
              className="relative h-40 w-64 shrink-0 overflow-hidden rounded-lg md:h-48 md:w-72"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 gap-4 animate-marquee-left group-hover:[animation-play-state:paused]"
        >
          {IMAGES.map((src, i) => (
            <div
              key={`b-${i}`}
              className="relative h-40 w-64 shrink-0 overflow-hidden rounded-lg md:h-48 md:w-72"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
