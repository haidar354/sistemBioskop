// Next Imports
import { NextResponse } from 'next/server'

// Third-party Imports
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { userEmail: email },
    })

    // 2. Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json(
        { message: ['Email atau Password salah'] },
        { status: 401 }
      )
    }

    // 3. Jika user tidak aktif
    if (user.userStatus !== 'aktif') {
      return NextResponse.json(
        { message: ['Akun Anda sedang dinonaktifkan. Silakan hubungi admin.'] },
        { status: 403 }
      )
    }

    // 4. Verifikasi Password
    const isPasswordValid = await bcrypt.compare(password, user.userPassword)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: ['Email atau Password salah'] },
        { status: 401 }
      )
    }

    // 5. Kembalikan data user (tanpa password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userPassword: _, ...filteredUserData } = user

    return NextResponse.json({
      id: user.id,
      name: user.userName,
      email: user.userEmail,
      userRole: user.userRole,
      ...filteredUserData
    })
  } catch (error) {
    console.error('Login Error:', error)
    return NextResponse.json(
      { message: ['Terjadi kesalahan pada server'] },
      { status: 500 }
    )
  }
}
