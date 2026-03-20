"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Package {
  id: string
  title: string
  description: string
  duration_minutes: number
  price_cents: number
  active: boolean
}

export default function PackagesPage() {
  const supabase = useMemo(() => createClient(), [])
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)

  const [form, setForm] = useState({ title: "", description: "", duration_minutes: "60", price_cents: "0" })

  const fetchPackages = useCallback(async () => {
    const { data } = await supabase
      .from("packages")
      .select("id, title, description, duration_minutes, price_cents, active")
      .order("created_at")
    if (data) setPackages(data)
  }, [supabase])

  useEffect(() => {
    fetchPackages().then(() => setLoading(false))
  }, [fetchPackages])

  function startEdit(pkg: Package) {
    setEditingId(pkg.id)
    setForm({
      title: pkg.title,
      description: pkg.description,
      duration_minutes: String(pkg.duration_minutes),
      price_cents: String(pkg.price_cents),
    })
  }

  function startNew() {
    setShowNew(true)
    setEditingId(null)
    setForm({ title: "", description: "", duration_minutes: "60", price_cents: "0" })
  }

  async function handleSave() {
    const data = {
      title: form.title,
      description: form.description,
      duration_minutes: parseInt(form.duration_minutes) || 60,
      price_cents: parseInt(form.price_cents) || 0,
    }

    if (editingId) {
      await supabase.from("packages").update(data).eq("id", editingId)
    } else {
      await supabase.from("packages").insert({ ...data, active: true })
    }

    setEditingId(null)
    setShowNew(false)
    await fetchPackages()
  }

  async function handleToggleActive(id: string, active: boolean) {
    await supabase.from("packages").update({ active: !active }).eq("id", id)
    await fetchPackages()
  }

  async function handleDelete(id: string) {
    await supabase.from("packages").delete().eq("id", id)
    await fetchPackages()
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Packages</h1>
          <p className="mt-1 text-muted-foreground">Manage class types and pricing</p>
        </div>
        <Button onClick={startNew} className="gap-2">
          <Plus className="size-4" />
          New Package
        </Button>
      </div>

      {showNew && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-medium">New Package</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Duration (min)</Label>
              <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Price (cents)</Label>
              <Input type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Check className="size-4" />
              Create
            </Button>
            <Button variant="ghost" onClick={() => setShowNew(false)}>
              <X className="size-4" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Duration</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} className="border-b last:border-0">
                  {editingId === pkg.id ? (
                    <>
                      <td className="px-4 py-3">
                        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-8" />
                      </td>
                      <td className="px-4 py-3">
                        <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} className="h-8 w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <Input type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: e.target.value })} className="h-8 w-24" />
                      </td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" onClick={handleSave} className="gap-1">
                            <Check className="size-3.5" />
                            Save
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <p className="font-medium">{pkg.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{pkg.description}</p>
                      </td>
                      <td className="px-4 py-3">{pkg.duration_minutes} min</td>
                      <td className="px-4 py-3 font-medium">${(pkg.price_cents / 100).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(pkg.id, pkg.active)}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            pkg.active
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {pkg.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => startEdit(pkg)}>
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(pkg.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
