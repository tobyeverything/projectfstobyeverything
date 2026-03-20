import { createClient } from "@/lib/supabase/server"
import { CalendarDays, Package, Users, DollarSign } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: customersCount },
    { count: bookingsCount },
    { count: packagesCount },
    { count: slotsCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "paid"),
    supabase.from("packages").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("time_slots").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    { label: "Customers", value: customersCount ?? 0, icon: Users, href: "/admin/customers" },
    { label: "Paid Bookings", value: bookingsCount ?? 0, icon: DollarSign, href: "/admin/customers" },
    { label: "Active Packages", value: packagesCount ?? 0, icon: Package, href: "/admin/packages" },
    { label: "Time Slots", value: slotsCount ?? 0, icon: CalendarDays, href: "/admin/timetable" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of your studio</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
