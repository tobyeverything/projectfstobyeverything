import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-8 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-semibold">You&apos;re booked!</h1>
          <p className="text-muted-foreground">
            Your class has been confirmed. We&apos;ll see you at {siteConfig.name}.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/book">Book another class</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
