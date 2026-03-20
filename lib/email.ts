import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "Studio <onboarding@resend.dev>"

interface BookingDetails {
  customerEmail: string
  customerName: string
  packageTitle: string
  date: string
  time: string
  duration: number
}

function baseTemplate(title: string, body: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
      <h1 style="font-size: 24px; font-weight: 600; color: #1a1a2e; margin: 0 0 24px;">${title}</h1>
      ${body}
      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
      <p style="font-size: 13px; color: #999; margin: 0;">
        This is an automated email. Please do not reply.
      </p>
    </div>
  `
}

function bookingCard(details: BookingDetails) {
  return `
    <div style="background: #f8f8fc; border-radius: 12px; padding: 20px; margin: 16px 0;">
      <p style="margin: 0 0 4px; font-size: 18px; font-weight: 600; color: #1a1a2e;">${details.packageTitle}</p>
      <p style="margin: 0 0 12px; font-size: 14px; color: #666;">${details.duration} minutes</p>
      <p style="margin: 0 0 4px; font-size: 14px; color: #444;">📅 ${details.date}</p>
      <p style="margin: 0; font-size: 14px; color: #444;">🕐 ${details.time}</p>
    </div>
  `
}

export async function sendBookingConfirmation(details: BookingDetails) {
  try {
    await resend.emails.send({
      from: FROM,
      to: details.customerEmail,
      subject: `Booking Confirmed – ${details.packageTitle}`,
      html: baseTemplate(
        "You're booked! ✓",
        `
          <p style="font-size: 15px; color: #444; line-height: 1.6; margin: 0 0 16px;">
            Hi ${details.customerName || "there"},<br/>Your class has been confirmed.
          </p>
          ${bookingCard(details)}
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            We look forward to seeing you. If you need to make changes, please contact us.
          </p>
        `
      ),
    })
  } catch (err) {
    console.error("Failed to send booking confirmation:", err)
  }
}

export async function sendBookingCancellation(details: BookingDetails) {
  try {
    await resend.emails.send({
      from: FROM,
      to: details.customerEmail,
      subject: `Booking Cancelled – ${details.packageTitle}`,
      html: baseTemplate(
        "Booking Cancelled",
        `
          <p style="font-size: 15px; color: #444; line-height: 1.6; margin: 0 0 16px;">
            Hi ${details.customerName || "there"},<br/>Your booking has been cancelled.
          </p>
          ${bookingCard(details)}
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            If this was a mistake or you'd like to rebook, visit our website.
          </p>
        `
      ),
    })
  } catch (err) {
    console.error("Failed to send cancellation email:", err)
  }
}

export async function sendBookingReschedule(
  details: BookingDetails,
  newDate: string,
  newTime: string
) {
  try {
    await resend.emails.send({
      from: FROM,
      to: details.customerEmail,
      subject: `Booking Rescheduled – ${details.packageTitle}`,
      html: baseTemplate(
        "Booking Rescheduled",
        `
          <p style="font-size: 15px; color: #444; line-height: 1.6; margin: 0 0 16px;">
            Hi ${details.customerName || "there"},<br/>Your booking has been moved to a new time.
          </p>
          <p style="font-size: 13px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 8px;">New Time</p>
          <div style="background: #f8f8fc; border-radius: 12px; padding: 20px; margin: 0 0 16px;">
            <p style="margin: 0 0 4px; font-size: 18px; font-weight: 600; color: #1a1a2e;">${details.packageTitle}</p>
            <p style="margin: 0 0 4px; font-size: 14px; color: #444;">📅 ${newDate}</p>
            <p style="margin: 0; font-size: 14px; color: #444;">🕐 ${newTime}</p>
          </div>
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            If you have any questions, please contact us.
          </p>
        `
      ),
    })
  } catch (err) {
    console.error("Failed to send reschedule email:", err)
  }
}
