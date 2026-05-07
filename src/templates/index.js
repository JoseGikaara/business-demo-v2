import barber from './barber'
import clinic from './clinic'
import gym from './gym'
import lawyer from './lawyer'
import restaurant from './restaurant'
import salon from './salon'

const templates = {
  barber,
  salon,
  restaurant,
  clinic,
  gym,
  lawyer,
  other: {
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=600&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
      'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&q=80',
    after: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80',
    beforeLabel: 'Before Our Service',
    afterLabel: 'After Our Service',
    marqueeWords: ['Professional Service', 'Expert Team', 'Customer First', 'Quality Guaranteed', 'Fast Response', 'Trusted by Many'],
    chatbotQA: [
      { q: 'How do I get started?', a: 'Send us a WhatsApp message and we will guide you through the process step by step.' },
      { q: 'What payment methods do you accept?', a: 'M-Pesa, cash, and bank transfer all accepted.' },
      { q: 'Do you offer a free consultation?', a: 'Yes! First consultation is free. WhatsApp us to schedule.' },
      { q: 'What areas do you serve?', a: 'We serve Nairobi and surrounding areas. WhatsApp us your location to confirm.' },
    ],
  },
}

const aliases = {
  barber: 'barber',
  barbershop: 'barber',
  salon: 'salon',
  restaurant: 'restaurant',
  clinic: 'clinic',
  gym: 'gym',
  lawyer: 'lawyer',
}

export function getTemplate(category) {
  if (!category) return templates.other
  const key = category.toString().toLowerCase().trim()
  return templates[aliases[key]] || templates.other
}
