'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'
import { format } from 'date-fns'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Styled Components
const TicketCard = styled(Card)(({ theme }) => ({
  border: '2px dashed ' + theme.palette.divider,
  position: 'relative',
  overflow: 'visible',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '40px',
    height: '40px',
    backgroundColor: theme.palette.background.default,
    borderRadius: '50%',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1
  },
  '&::before': { left: '-22px' },
  '&::after': { right: '-22px' }
}))

const TicketSuccessView = ({ transaction }: { transaction: any }) => {
  const isSuccess = transaction.transactionPaymentStatus === 'settlement' || transaction.transactionPaymentStatus === 'capture'
  const isPending = transaction.transactionPaymentStatus === 'pending'

  return (
    <div className={classnames('pbs-[100px] pbe-[100px] flex flex-col items-center gap-10', frontCommonStyles.layoutSpacing)}>
      <div className='flex flex-col items-center text-center gap-4'>
        {isSuccess ? (
            <div className='flex flex-col items-center gap-4'>
                <div className='bs-[80px] is-[80px] bg-success rounded-full flex items-center justify-center shadow-lg shadow-success/30'>
                    <i className='tabler-check text-white text-5xl' />
                </div>
                <Typography variant='h3' className='font-black'>Pembayaran Berhasil!</Typography>
                <Typography color='textSecondary'>Tiket Anda sudah aktif dan siap digunakan. Sampai jumpa di bioskop!</Typography>
            </div>
        ) : isPending ? (
            <div className='flex flex-col items-center gap-4'>
                <div className='bs-[80px] is-[80px] bg-warning rounded-full flex items-center justify-center shadow-lg shadow-warning/30'>
                    <i className='tabler-clock text-white text-5xl' />
                </div>
                <Typography variant='h3' className='font-black'>Menunggu Pembayaran</Typography>
                <Typography color='textSecondary'>Silakan selesaikan pembayaran Anda di aplikasi Midtrans agar tiket dapat diterbitkan.</Typography>
            </div>
        ) : (
            <div className='flex flex-col items-center gap-4'>
                <div className='bs-[80px] is-[80px] bg-error rounded-full flex items-center justify-center shadow-lg shadow-error/30'>
                    <i className='tabler-x text-white text-5xl' />
                </div>
                <Typography variant='h3' className='font-black'>Gagal / Kadaluarsa</Typography>
            </div>
        )}
      </div>

      <Grid container spacing={6} className='max-is-[800px]'>
        {transaction.tickets.map((ticket: any, index: number) => (
          <Grid item xs={12} key={index}>
            <TicketCard variant='outlined' className='bg-backgroundPaper'>
              <CardContent className='flex flex-col md:flex-row gap-6 p-8'>
                {/* Left Side: Film Info */}
                <div className='flex-1 flex flex-col gap-4'>
                  <div className='flex flex-col gap-1'>
                    <Typography variant='h5' className='font-black text-primary'>{ticket.schedule.film.filmTitle}</Typography>
                    <Typography variant='body2' color='textSecondary'>{transaction.user.userName} • {ticket.schedule.studio.studioName}</Typography>
                  </div>
                  
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <Typography variant='caption' color='textSecondary'>TANGGAL</Typography>
                        <Typography className='font-bold'>{format(new Date(ticket.schedule.scheduleTimeStart), 'dd MMM yyyy')}</Typography>
                    </div>
                    <div>
                        <Typography variant='caption' color='textSecondary'>WAKTU</Typography>
                        <Typography className='font-bold'>{format(new Date(ticket.schedule.scheduleTimeStart), 'HH:mm')}</Typography>
                    </div>
                    <div>
                        <Typography variant='caption' color='textSecondary'>KURSI</Typography>
                        <Typography variant='h5' className='font-black text-primary'>{ticket.seat.seatRow}{ticket.seat.seatColumn}</Typography>
                    </div>
                    <div>
                        <Typography variant='caption' color='textSecondary'>TIPE</Typography>
                        <Typography className='font-bold capitalize'>{ticket.schedule.studio.studioType}</Typography>
                    </div>
                  </div>
                </div>

                <Divider orientation='vertical' flexItem className='hidden md:block' />
                <Divider className='md:hidden' />

                {/* Right Side: Barcode */}
                <div className='is-[200px] flex flex-col items-center justify-center gap-3 mli-auto'>
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticketBarcodeCode}`} 
                        alt='barcode' 
                        className='bs-[120px] is-[120px] p-2 bg-white rounded'
                    />
                    <Typography className='font-mono font-bold tracking-widest'>{ticket.ticketBarcodeCode}</Typography>
                    <Chip label="E-TICKET" size="small" variant="tonal" color="primary" />
                </div>
              </CardContent>
            </TicketCard>
          </Grid>
        ))}
      </Grid>

      <div className='flex gap-4'>
        <Button variant='contained' size='large' onClick={() => window.print()}>
            Cetak Tiket (PDF)
        </Button>
        <Button variant='tonal' color='secondary' size='large' href='/'>
            Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
}

export default TicketSuccessView
