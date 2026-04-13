'use server'

import { revalidatePath } from 'next/cache'
import fs from 'fs/promises'
import path from 'path'
import prisma from '@/libs/prisma'
import { FilmAgeRating, FilmStatus } from '@prisma/client'

// Helper to save file
const saveFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const filePath = path.join(process.cwd(), 'public/images/posters', fileName)
  
  await fs.writeFile(filePath, buffer)
  
  return `/images/posters/${fileName}`
}

// FILMS ACTIONS
export const getFilms = async () => {
  try {
    return await prisma.film.findMany({
      orderBy: { filmCreatedAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching films:', error)
    return []
  }
}

export const addFilm = async (formData: FormData) => {
  try {
    const title = formData.get('filmTitle') as string
    const genre = formData.get('filmGenre') as string
    const duration = parseInt(formData.get('filmDuration') as string)
    const ageRating = formData.get('filmAgeRating') as FilmAgeRating
    const status = formData.get('filmStatus') as FilmStatus
    const synopsis = formData.get('filmSynopsis') as string
    const director = formData.get('filmDirector') as string
    const cast = formData.get('filmCast') as string
    
    // Handle Poster (File or URL)
    let posterUrl = formData.get('filmPosterUrl') as string
    const posterFile = formData.get('filmPosterFile') as File | null

    if (posterFile && posterFile.size > 0 && posterFile.name !== 'undefined') {
      posterUrl = await saveFile(posterFile)
    }

    const film = await prisma.film.create({
      data: {
        filmTitle: title,
        filmGenre: genre,
        filmDuration: duration,
        filmAgeRating: ageRating,
        filmStatus: status,
        filmSynopsis: synopsis,
        filmDirector: director,
        filmCast: cast,
        filmPoster: posterUrl,
        filmScore: 0 // Default
      }
    })

    revalidatePath('/')
    return { success: true, data: film }
  } catch (error) {
    console.error('Error adding film:', error)
    return { success: false, error: 'Gagal menambah film' }
  }
}

export const updateFilm = async (id: string, formData: FormData) => {
  try {
    const title = formData.get('filmTitle') as string
    const genre = formData.get('filmGenre') as string
    const duration = parseInt(formData.get('filmDuration') as string)
    const ageRating = formData.get('filmAgeRating') as FilmAgeRating
    const status = formData.get('filmStatus') as FilmStatus
    const synopsis = formData.get('filmSynopsis') as string
    const director = formData.get('filmDirector') as string
    const cast = formData.get('filmCast') as string
    
    let posterUrl = formData.get('filmPosterUrl') as string
    const posterFile = formData.get('filmPosterFile') as File | null

    if (posterFile && posterFile.size > 0 && posterFile.name !== 'undefined') {
      posterUrl = await saveFile(posterFile)
    }

    const film = await prisma.film.update({
      where: { id },
      data: {
        filmTitle: title,
        filmGenre: genre,
        filmDuration: duration,
        filmAgeRating: ageRating,
        filmStatus: status,
        filmSynopsis: synopsis,
        filmDirector: director,
        filmCast: cast,
        filmPoster: posterUrl
      }
    })

    revalidatePath('/')
    return { success: true, data: film }
  } catch (error) {
    console.error('Error updating film:', error)
    return { success: false, error: 'Gagal memperbarui film' }
  }
}

export const deleteFilm = async (id: string) => {
  try {
    // Optional: Delete local file if it exists
    const film = await prisma.film.findUnique({ where: { id } })
    if (film?.filmPoster?.startsWith('/images/posters/')) {
      const filePath = path.join(process.cwd(), 'public', film.filmPoster)
      await fs.unlink(filePath).catch(() => console.log('File poster tidak ditemukan, abaikan.'))
    }

    await prisma.film.delete({ where: { id } })
    
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting film:', error)
    return { success: false, error: 'Gagal menghapus film' }
  }
}

// STUDIOS ACTIONS
export const getStudios = async () => {
  try {
    return await prisma.studio.findMany({
      include: { seats: true },
      orderBy: { studioName: 'asc' }
    })
  } catch (error) {
    console.error('Error fetching studios:', error)
    return []
  }
}

export const addStudio = async (data: any) => {
  try {
    const studio = await prisma.studio.create({
      data: {
        studioName: data.studioName,
        studioType: data.studioType,
        studioCapacity: 0, // Calculated later from seats
        studioTotalRows: data.studioTotalRows,
        studioTotalColumns: data.studioTotalColumns,
      }
    })

    // Generate initial seats
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const seatsData = []
    for (let r = 0; r < data.studioTotalRows; r++) {
      for (let c = 1; c <= data.studioTotalColumns; c++) {
        seatsData.push({
          studioId: studio.id,
          seatCode: `${rows[r]}${c}`,
          seatRow: r + 1,
          seatColumn: c,
        })
      }
    }

    await prisma.seat.createMany({ data: seatsData })
    await prisma.studio.update({
      where: { id: studio.id },
      data: { studioCapacity: seatsData.length }
    })

    revalidatePath('/')
    return { success: true, data: studio }
  } catch (error) {
    console.error('Error adding studio:', error)
    return { success: false, error: 'Gagal menambah studio' }
  }
}

// SCHEDULES ACTIONS
export const getSchedules = async () => {
  try {
    return await prisma.schedule.findMany({
      include: {
        film: true,
        studio: true
      },
      orderBy: { scheduleTimeStart: 'asc' }
    })
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return []
  }
}

export const addSchedule = async (data: any) => {
  try {
    const startTime = new Date(data.scheduleTimeStart)
    const endTime = new Date(data.scheduleTimeEnd)

    // Check for overlap in same studio
    const existing = await prisma.schedule.findFirst({
      where: {
        studioId: data.studioId,
        scheduleStatus: 'aktif',
        OR: [
          {
            AND: [
              { scheduleTimeStart: { lte: startTime } },
              { scheduleTimeEnd: { gt: startTime } }
            ]
          },
          {
            AND: [
              { scheduleTimeStart: { lt: endTime } },
              { scheduleTimeEnd: { gte: endTime } }
            ]
          }
        ]
      }
    })

    if (existing) {
      return { success: false, error: 'Jadwal bentrok dengan penayangan lain di studio ini.' }
    }

    const schedule = await prisma.schedule.create({
      data: {
        filmId: data.filmId,
        studioId: data.studioId,
        scheduleDate: new Date(data.scheduleDate),
        scheduleTimeStart: startTime,
        scheduleTimeEnd: endTime,
        schedulePriceRegular: data.schedulePriceRegular,
        schedulePriceVip: data.schedulePriceVip || data.schedulePriceRegular + 20000,
        schedulePriceCouple: data.schedulePriceCouple || (data.schedulePriceRegular * 2) + 10000,
      }
    })

    revalidatePath('/')
    return { success: true, data: schedule }
  } catch (error) {
    console.error('Error adding schedule:', error)
    return { success: false, error: 'Gagal menambah jadwal' }
  }
}

// KASIR ACTIONS (Verification)
export const verifyTicket = async (barcode: string, staffId: string) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketBarcodeCode: barcode },
      include: {
        schedule: { include: { film: true, studio: true } },
        seat: true
      }
    })

    if (!ticket) {
      return { success: false, error: 'Tiket tidak ditemukan!' }
    }

    if (ticket.ticketScanStatus === 'sudah') {
      return { success: false, error: 'Tiket sudah pernah dipindai sebelumnya.' }
    }

    if (ticket.ticketScanStatus === 'batal') {
      return { success: false, error: 'Tiket sudah dibatalkan.' }
    }

    // Update status to 'sudah'
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        ticketScanStatus: 'sudah',
        ticketScannedAt: new Date(),
        ticketScannedByStaffId: staffId
      }
    })

    return { 
      success: true, 
      data: {
        filmTitle: ticket.schedule.film.filmTitle,
        studioName: ticket.schedule.studio.studioName,
        seatCode: ticket.seat.seatCode,
        scannedAt: updatedTicket.ticketScannedAt
      } 
    }
  } catch (error) {
    console.error('Error verifying ticket:', error)
    return { success: false, error: 'Terjadi kesalahan sistem.' }
  }
}

// CUSTOMER ACTIONS (Public)
export const getFilmsForLanding = async () => {
  try {
    return await prisma.film.findMany({
      where: { filmStatus: 'tayang' },
      orderBy: { filmCreatedAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching landing films:', error)
    return []
  }
}

export const getFilmDetailWithSchedules = async (id: string) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return await prisma.film.findUnique({
      where: { id },
      include: {
        schedules: {
          where: {
            scheduleStatus: 'aktif',
            scheduleDate: { gte: today }
          },
          include: { studio: true },
          orderBy: { scheduleTimeStart: 'asc' }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching film detail:', error)
    return null
  }
}

export const getBookingData = async (scheduleId: string) => {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        film: true,
        studio: {
          include: {
            seats: {
              orderBy: [
                { seatRow: 'asc' },
                { seatColumn: 'asc' }
              ]
            }
          }
        },
        reservations: {
          where: {
            reservationStatus: { in: ['dipesan', 'terkonfirmasi'] }
          }
        }
      }
    })

    return schedule
  } catch (error) {
    console.error('Error fetching booking data:', error)
    return null
  }
}

export const getSnacks = async () => {
  try {
    return await prisma.snack.findMany({
      where: { snackStatus: 'tersedia' }
    })
  } catch (error) {
    console.error('Error fetching snacks:', error)
    return []
  }
}

export const finalizeBooking = async (data: {
  scheduleId: string,
  userId: string,
  selectedSeats: any[],
  selectedSnacks: any[],
  totalAmount: number
}) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Transaction Header
      const transaction = await tx.transaction.create({
        data: {
          transactionUserId: data.userId,
          transactionStatus: 'menunggu_pembayaran',
          transactionTotalPrice: data.totalAmount,
          transactionPaymentMethod: 'midtrans',
          transactionPaymentStatus: 'pending'
        }
      })

      // 2. Create Seat Reservations & Tickets
      for (const seat of data.selectedSeats) {
        await tx.seatReservation.create({
          data: {
            scheduleId: data.scheduleId,
            seatId: seat.id,
            reservationStatus: 'dipesan',
            reservationExpiresAt: new Date(Date.now() + 15 * 60000)
          }
        })

        await tx.ticket.create({
          data: {
            ticketTransactionId: transaction.id,
            ticketScheduleId: data.scheduleId,
            ticketSeatId: seat.id,
            ticketBarcodeCode: `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            ticketScanStatus: 'belum',
            ticketPrice: 0
          }
        })
      }

      // 3. Create Snack Orders
      for (const snack of data.selectedSnacks) {
        await tx.snackOrder.create({
          data: {
            snackOrderTransactionId: transaction.id,
            snackOrderSnackId: snack.id,
            snackOrderQty: snack.quantity,
            snackOrderPrice: snack.snackPrice,
            snackSubtotal: snack.snackPrice * snack.quantity
          }
        })
      }

      return transaction
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Error in finalizeBooking:', error)
    return { success: false, error: 'Gagal memproses pesanan' }
  }
}

// PAYMENT ACTIONS (Midtrans)
import { snap } from '@/libs/midtrans'

export const getSnapToken = async (transactionId: string) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        user: true,
        tickets: { include: { schedule: { include: { film: true } } } },
        snackOrders: { include: { snack: true } }
      }
    })

    if (!transaction) return { success: false, error: 'Transaksi tidak ditemukan' }

    // Prepare item details
    const itemDetails: any[] = [
      ...transaction.tickets.map(t => ({
        id: t.id,
        price: t.schedule.schedulePriceRegular, // Need to make sure this matches totalPrice logic
        quantity: 1,
        name: `Tiket: ${t.schedule.film.filmTitle}`
      })),
      ...transaction.snackOrders.map(s => ({
        id: s.id,
        price: s.snackOrderPrice,
        quantity: s.snackOrderQty,
        name: s.snack.snackName
      }))
    ]

    const parameter = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.transactionTotalPrice
      },
      item_details: itemDetails,
      customer_details: {
        first_name: transaction.user.userName,
        email: transaction.user.userEmail,
        phone: transaction.user.userPhone
      }
    }

    const token = await snap.createTransactionToken(parameter)
    return { success: true, token }
  } catch (error) {
    console.error('Error getting snap token:', error)
    return { success: false, error: 'Gagal mendapatkan token pembayaran' }
  }
}

export const getTransactionDetail = async (id: string) => {
  try {
    return await prisma.transaction.findUnique({
      where: { id },
      include: {
        tickets: { include: { schedule: { include: { film: true, studio: true } }, seat: true } },
        snackOrders: { include: { snack: true } }
      }
    })
  } catch (error) {
    console.error('Error fetching transaction detail:', error)
    return null
  }
}
