const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.activity.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.destination.deleteMany()
  await prisma.operator.deleteMany()

  const nairobi = await prisma.destination.create({
    data: { name: 'Tarangire National Park', slug: 'tarangire', country: 'Tanzania' }
  })

  const operator = await prisma.operator.create({
    data: { name: 'African Victory Safari', email: 'info@africanvictory.tz', phone: '+255700000000' }
  })

  const trip1 = await prisma.trip.create({
    data: {
      title: 'Tarangire Wildlife Safari',
      slug: 'tarangire-wildlife-safari',
      summary: '3-day safari exploring Tarangire National Park.',
      description: 'Experience large elephant herds, baobab trees and abundant wildlife in Tarangire.',
      price: 450.0,
      duration: 3,
      destinationId: nairobi.id,
      operatorId: operator.id
    }
  })

  await prisma.activity.createMany({
    data: [
      { name: 'Game Drives', detail: 'Morning and evening game drives', tripId: trip1.id },
      { name: 'Bird Watching', detail: 'Guided birding walks', tripId: trip1.id }
    ]
  })

  const ngorongoro = await prisma.destination.create({
    data: { name: 'Ngorongoro Crater', slug: 'ngorongoro', country: 'Tanzania' }
  })

  const trip2 = await prisma.trip.create({
    data: {
      title: 'Ngorongoro Crater Day Trip',
      slug: 'ngorongoro-day-trip',
      summary: 'Day trip to the Ngorongoro Crater with game viewing and picnic lunch.',
      description: 'A fantastic day in the crater with high density of wildlife.',
      price: 200.0,
      duration: 1,
      destinationId: ngorongoro.id,
      operatorId: operator.id
    }
  })

  await prisma.activity.create({ name: 'Crater Visit', detail: 'Full day crater tour', tripId: trip2.id })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
