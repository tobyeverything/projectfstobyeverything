"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimeSlot {
  id: string
  package_id: string
  start_time: string
  end_time: string
  max_capacity: number
  package_title?: string
}

interface Pkg {
  id: string
  title: string
  duration_minutes: number
}

export default function TimetablePage() {
  const supabase = useMemo(() => createClient(), [])
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [packages, setPackages] = useState<Pkg[]>([])
  const [loading, setLoading] = useState(true)

  const [newPackageId, setNewPackageId] = useState("")
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("09:00")
  const [newCapacity, setNewCapacity] = useState("10")
  const [creating, setCreating] = useState(false)

  const fetchSlots = useCallback(async () => {
    const { data } = await supabase
      .from("time_slots")
      .select("id, package_id, start_time, end_time, max_capacity")
      .order("start_time", { ascending: true })

    if (data) {
      const { data: pkgs } = await supabase
        .from("packages")
        .select("id, title")

      const pkgMap = new Map(pkgs?.map((p) => [p.id, p.title]) ?? [])
      setSlots(data.map((s) => ({ ...s, package_title: pkgMap.get(s.package_id) ?? "Unknown" })))
    }
  }, [supabase])

  useEffect(() => {
    Promise.all([
      fetchSlots(),
      supabase.from("packages").select("id, title, duration_minutes").eq("active", true).then(({ data }) => {
        if (data) {
          setPackages(data)
          if (data.length > 0) setNewPackageId(data[0].id)
        }
      }),
    ]).then(() => setLoading(false))
  }, [supabase, fetchSlots])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newPackageId || !newDate || !newTime) return
    setCreating(true)

    const pkg = packages.find((p) => p.id === newPackageId)
    const start = new Date(`${newDate}T${newTime}:00`)
    const end = new Date(start.getTime() + (pkg?.duration_minutes ?? 60) * 60000)

    await supabase.from("time_slots").insert({
      package_id: newPackageId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      max_capacity: parseInt(newCapacity) || 10,
    })

    await fetchSlots()
    setCreating(false)
  }

  async function handleDelete(id: string) {
    await supabase.from("time_slots").delete().eq("id", id)
    setSlots((prev) => prev.filter((s) => s.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Timetable</h1>
        <p className="mt-1 text-muted-foreground">Manage available time slots for classes</p>
      </div>

      <form onSubmit={handleCreate} className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 font-medium">Add new slot</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5">
            <Label>Package</Label>
            <select
              value={newPackageId}
              onChange={(e) => setNewPackageId(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {packages.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Start Time</Label>
            <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Capacity</Label>
            <Input type="number" min="1" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} required />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={creating} className="w-full gap-2">
              {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Add Slot
            </Button>
          </div>
        </div>
      </form>

      <div className="rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Package</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Capacity</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No time slots yet. Add one above.
                  </td>
                </tr>
              ) : (
                slots.map((slot) => (
                  <tr key={slot.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{slot.package_title}</td>
                    <td className="px-4 py-3">
                      {new Date(slot.start_time).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(slot.start_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      {" – "}
                      {new Date(slot.end_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-4 py-3">{slot.max_capacity}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(slot.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
