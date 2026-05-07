// src/lib/whatsapp.js
// Builds pre-written outreach messages with the demo URL baked in

const FEATURE_BULLETS = [
  '📅 *Online Booking* — customers book themselves, 24/7, no missed calls',
  '⭐ *Customer Reviews* — show your best reviews before they even walk in',
  '📢 *Broadcast Messaging* — send promotions straight to your customer list',
  '🎁 *Loyalty & Referrals* — turn one customer into five automatically',
  '🗺️ *Google Maps* — customers find you, get directions, and arrive',
  '📊 *Business Dashboard* — see revenue, bookings, and engagement in one place',
]

const CATEGORY_OPENERS = {
  salon: "imagine a customer searching *\"best salon near me\"* at 9pm — your site comes up, they see your work, read 5-star reviews, and book a slot. All while you're asleep.",
  restaurant: "imagine someone hungry, searching nearby restaurants — they land on your page, see the menu, read reviews, and call to reserve. Done.",
  clinic: "patients today search before they visit. A professional site with your services and booking form builds trust before they even walk through the door.",
  gym: "fitness clients want to see the vibe before they commit. A demo site with your classes, pricing, and reviews closes them before the first call.",
  hardware: "contractors and homeowners search for hardware suppliers online. Your site puts your stock, location, and contact front and centre.",
  default: "customers today search online before they visit anywhere. A professional website means they find you, trust you, and reach out — before your competitor.",
}

export function buildWhatsAppMessage(business, shortUrl) {
  const opener = CATEGORY_OPENERS[business.category] || CATEGORY_OPENERS.default
  const features = FEATURE_BULLETS.slice(0, 4).join('\n')
  const name = business.name || 'your business'

  const message = `Hi! 👋

I built a *free demo website* for *${name}* — take a look:
👉 ${shortUrl}

Here's the thing: ${opener}

Your demo already includes:
${features}

The *Business Dashboard* alone can help you:
• Track which customers keep coming back
• Send promotions to your whole customer list in one tap
• See exactly how your business is performing week by week

This is what growing businesses in Nairobi are using right now. I can have your real site live in 24 hours.

Interested? Just reply *YES* and I'll walk you through it. 🚀`

  return message
}

export function buildWhatsAppLink(phoneNumber, business, shortUrl) {
  // phoneNumber should be digits only e.g. 254712345678
  const digits = (phoneNumber || '').replace(/\D/g, '')
  if (!digits) return null
  const message = buildWhatsAppMessage(business, shortUrl)
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function copyMessageToClipboard(business, shortUrl) {
  const msg = buildWhatsAppMessage(business, shortUrl)
  return navigator.clipboard.writeText(msg)
}
