"use client"

import { Clock, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Package {
  id: string
  title: string
  description: string
  duration_minutes: number
  price_cents: number
}

interface PackageSelectorProps {
  packages: Package[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PackageSelector({ packages, selectedId, onSelect }: PackageSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => {
        const selected = selectedId === pkg.id
        return (
          <button
            key={pkg.id}
            onClick={() => onSelect(pkg.id)}
            className={cn(
              "group relative flex flex-col rounded-xl border-2 p-5 text-left transition-all duration-200",
              selected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/40 hover:shadow-sm"
            )}
          >
            <div className={cn(
              "absolute right-3 top-3 flex size-6 items-center justify-center rounded-full border-2 transition-colors",
              selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
            )}>
              {selected && <Check className="size-3.5" />}
            </div>

            <h3 className="font-serif text-xl font-semibold">{pkg.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{pkg.description}</p>

            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-3.5" />
                {pkg.duration_minutes} min
              </span>
              <span className="text-lg font-semibold">
                ${(pkg.price_cents / 100).toFixed(0)}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
