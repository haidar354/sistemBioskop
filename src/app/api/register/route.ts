import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient, UserRole, UserStatus } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json()

    // 1. Validasi Input Dasar
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: ['Nama, Email, dan Password wajib diisi'] },
        { status: 400 }
      )
    }

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { userEmail: email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: ['Email sudah digunakan oleh akun lain'] },
        { status: 400 }
      )
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Create User & UserDetail (Transaction)
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          userName: name,
          userEmail: email,
          userPassword: hashedPassword,
          userPhone: phone || null,
          userRole: UserRole.customer, // Default role
          userStatus: UserStatus.aktif,
          userEmailVerified: false, // Menunggu verifikasi
        },
      })

      await tx.userDetail.create({
        data: {
          userId: user.id,
          userDetailPoints: 0,
          userDetailMemberTier: 'bronze',
        },
      })

      return user
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userPassword: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      { 
        message: 'Registrasi berhasil!', 
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration Error:', error)
    return NextResponse.json(
      { message: ['Terjadi kesalahan saat pendaftaran'] },
      { status: 500 }
    )
  }
}
