import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/libs/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
        order_id, 
        status_code, 
        gross_amount, 
        signature_key, 
        transaction_status,
        fraud_status 
    } = body

    // 1. Verify Signature Key for Security
    // hash = sha512(order_id + status_code + gross_amount + ServerKey)
    const serverKey = process.env.MIDTRANS_SERVER_KEY as string
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex')

    if (hash !== signature_key) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 403 })
    }

    // 2. Map Midtrans status to our DB status
    let paymentStatus = 'pending'
    let transactionStatus = 'menunggu_pembayaran'

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'challenge') {
        paymentStatus = 'challenge'
        transactionStatus = 'menunggu_pembayaran'
      } else if (fraud_status === 'accept') {
        paymentStatus = 'settlement'
        transactionStatus = 'berhasil'
      }
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      paymentStatus = 'failure'
      transactionStatus = 'batal'
    } else if (transaction_status === 'pending') {
      paymentStatus = 'pending'
      transactionStatus = 'menunggu_pembayaran'
    }

    // 3. Update Transaction in DB
    await prisma.transaction.update({
      where: { id: order_id },
      data: {
        transactionPaymentStatus: paymentStatus,
        transactionStatus: transactionStatus,
        transactionUpdatedAt: new Date()
      }
    })

    // 4. Handle Seat Reservations if payment failed/expired (Release them)
    if (transactionStatus === 'batal') {
        // Find tickets in this transaction
        const tickets = await prisma.ticket.findMany({
            where: { ticketTransactionId: order_id }
        })
        
        // Mark reservations as canceled to release the seats
        for (const ticket of tickets) {
            await prisma.seatReservation.updateMany({
                where: { 
                    scheduleId: ticket.ticketScheduleId,
                    seatId: ticket.ticketSeatId 
                },
                data: {
                    reservationStatus: 'batal'
                }
            })
        }
    }

    return NextResponse.json({ message: 'OK' })
  } catch (error) {
    console.error('Midtrans Webhook Error:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
