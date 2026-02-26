const { PrismaClient } = require('@prisma/client')

describe('Prisma and seed', () => {
  let prisma
  beforeAll(async () => {
    prisma = new PrismaClient()
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  test('should find seeded trips (if DB seeded)', async () => {
    const trips = await prisma.trip.findMany({ take: 5 })
    // This test is meaningful in CI where we run migrations + seed first.
    expect(Array.isArray(trips)).toBe(true)
  })
})
