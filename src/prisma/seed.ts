import { PrismaClient, UserRole, UserStatus, FilmAgeRating, FilmStatus, StudioType, StudioStatus, SeatType, SeatStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Sedang memulai seeding...')

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  const admin = await prisma.user.upsert({
    where: { userEmail: 'admin@bioskop.com' },
    update: {},
    create: {
      userName: 'Super Admin',
      userEmail: 'admin@bioskop.com',
      userPassword: adminPassword,
      userRole: UserRole.admin,
      userStatus: UserStatus.aktif,
      userEmailVerified: true,
    },
  })
  console.log('Admin user created:', admin.userEmail)

  // 2. Create Staff/Kasir User
  const staffPassword = await bcrypt.hash('Staff@123', 10)
  const staff = await prisma.user.upsert({
    where: { userEmail: 'staff@bioskop.com' },
    update: {},
    create: {
      userName: 'Kasir Utama',
      userEmail: 'staff@bioskop.com',
      userPassword: staffPassword,
      userRole: UserRole.kasir,
      userStatus: UserStatus.aktif,
      userEmailVerified: true,
    },
  })
  console.log('Staff user created:', staff.userEmail)

  // 3. Create a Demo Film
  const film = await prisma.film.create({
    data: {
      filmTitle: 'The Crimson Red Action',
      filmGenre: 'Action, Thriller',
      filmDuration: 120,
      filmAgeRating: FilmAgeRating.D17,
      filmScore: 8.5,
      filmPoster: 'https://placehold.co/600x400/C62828/FFFFFF?text=Crimson+Red',
      filmSynopsis: 'Sebuah petualangan dramatis di dunia sinema premium.',
      filmStatus: FilmStatus.tayang,
      filmDirector: 'Antigravity Director',
      filmCast: 'Actor A, Actress B',
    },
  })
  console.log('Demo film created:', film.filmTitle)

  // 4. Create a Demo Studio & Seats
  const studio = await prisma.studio.create({
    data: {
      studioName: 'Studio 1 IMAX',
      studioType: StudioType.imax,
      studioCapacity: 20,
      studioTotalRows: 4,
      studioTotalColumns: 5,
      studioStatus: StudioStatus.aktif,
    },
  })

  // Create Seats for the studio (4 rows A-D, 5 columns 1-5)
  const rows = ['A', 'B', 'C', 'D']
  for (let r = 0; r < rows.length; r++) {
    for (let c = 1; c <= 5; c++) {
      await prisma.seat.create({
        data: {
          studioId: studio.id,
          seatCode: `${rows[r]}${c}`,
          seatRow: r + 1,
          seatColumn: c,
          seatType: SeatType.reguler,
          seatStatus: SeatStatus.aktif,
        },
      })
    }
  }
  console.log('Demo studio and 20 seats created.')

  console.log('Seeding selesai!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
