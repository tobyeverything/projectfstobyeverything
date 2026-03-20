"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Clock, Users, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface TimeSlot {
  id: string
  start_time: string
  end_time: string
  max_capacity: number
  booked_count: number
}

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  selectedId: string | null
  onSelect: (id: string) => void
  loading?: boolean
}

function getNext7Days() {
  const days: Date[] = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
}

function formatDateKey(d: Date) {
  return d.toISOString().split("T")[0]
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function TimeSlotPicker({ slots, selectedId, onSelect, loading }: TimeSlotPickerProps) {
  const days = useMemo(() => getNext7Days(), [])
  const [selectedDate, setSelectedDate] = useState<string>(formatDateKey(days[0]))

  const filteredSlots = useMemo(() => {
    return slots.filter((s) => {
      const slotDate = new Date(s.start_time).toISOString().split("T")[0]
      return slotDate === selectedDate
    })
  }, [slots, selectedDate])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => {
          const key = formatDateKey(day)
          const isSelected = key === selectedDate
          const isToday = key === formatDateKey(new Date())
          return (
            <button
              key={key}
              onClick={() => setSelectedDate(key)}
              className={cn(
                "flex min-w-[4.5rem] flex-col items-center rounded-xl border-2 px-3 py-2.5 transition-all",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
              )}
            >
              <span className="text-xs font-medium text-muted-foreground">
                {isToday ? "Today" : dayNames[day.getDay()]}
              </span>
              <span className="text-lg font-semibold">{day.getDate()}</span>
              <span className="text-xs text-muted-foreground">{monthNames[day.getMonth()]}</span>
            </button>
          )
        })}
      </div>

      {filteredSlots.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 py-12 text-center">
          <p className="text-muted-foreground">No available slots for this date</p>
          <p className="mt-1 text-sm text-muted-foreground/60">Try selecting a different day</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSlots.map((slot) => {
            const selected = selectedId === slot.id
            const full = slot.booked_count >= slot.max_capacity
            const spotsLeft = slot.max_capacity - slot.booked_count
            const startTime = new Date(slot.start_time).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
            const endTime = new Date(slot.end_time).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })

            return (
              <button
                key={slot.id}
                onClick={() => !full && onSelect(slot.id)}
                disabled={full}
                className={cn(
                  "relative flex items-center gap-4 rounded-xl border-2 px-4 py-3 text-left transition-all",
                  full
                    ? "cursor-not-allowed border-muted bg-muted/50 opacity-60"
                    : selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-muted-foreground" />
                    <span className="font-medium">{startTime} – {endTime}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="size-3" />
                    {full ? "Full" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}
                  </div>
                </div>

                <div className={cn(
                  "flex size-6 items-center justify-center rounded-full border-2 transition-colors",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                )}>
                  {selected && <Check className="size-3.5" />}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
