// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

// Utils Imports
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const BookingReview = ({ bookingData, selectedSeats, selectedSnacks }: any) => {
  const { film, studio, scheduleTimeStart, schedulePriceRegular } = bookingData

  // Price Calculations
  const ticketTotal = selectedSeats.length * schedulePriceRegular
  const snackTotal = selectedSnacks.reduce((acc: number, s: any) => acc + (s.snackPrice * s.quantity), 0)
  const grandTotal = ticketTotal + snackTotal

  return (
    <div className='flex flex-col gap-6 pbs-6'>
      <Typography variant='h5' className='font-bold'>Ringkasan Pesanan</Typography>
      
      <Grid container spacing={6}>
        <Grid item xs={12} md={7}>
          <div className='flex flex-col gap-6'>
            {/* Film Info */}
            <Card variant='outlined' className='bg-actionHover'>
                <CardContent className='flex gap-5'>
                    <img 
                        src={film.filmPoster} 
                        alt={film.filmTitle} 
                        className='bs-[120px] is-[90px] object-cover rounded shadow-md'
                    />
                    <div className='flex flex-col gap-1'>
                        <Typography variant='h6' className='font-bold' color='text.primary'>{film.filmTitle}</Typography>
                        <div className='flex gap-2 mbe-2'>
                            <Chip label={studio.studioName} size='small' color='primary' variant='tonal' />
                            <Chip label={studio.studioType.toUpperCase()} size='small' color='secondary' variant='tonal' />
                        </div>
                        <Typography variant='body2' className='flex items-center gap-2'>
                            <i className='tabler-calendar text-primary' />
                            {format(new Date(scheduleTimeStart), 'EEEE, dd MMMM yyyy (HH:mm)', { locale: id })}
                        </Typography>
                    </div>
                </CardContent>
            </Card>

            {/* Seats Info */}
            <div className='flex flex-col gap-3'>
                <Typography className='font-bold flex items-center gap-2'>
                    <i className='tabler-armchair text-primary' />
                    Kursi Dipilih ({selectedSeats.length})
                </Typography>
                <div className='flex flex-wrap gap-2'>
                    {selectedSeats.map((s: any) => (
                        <Chip key={s.id} label={`${s.seatRow}${s.seatColumn}`} variant='outlined' color='primary' className='font-bold' />
                    ))}
                </div>
            </div>

            {/* Snacks Info */}
            {selectedSnacks.length > 0 && (
                <div className='flex flex-col gap-3'>
                    <Typography className='font-bold flex items-center gap-2'>
                        <i className='tabler-popcorn text-primary' />
                        Snack & Minuman ({selectedSnacks.length})
                    </Typography>
                    <div className='flex flex-col gap-2'>
                        {selectedSnacks.map((s: any) => (
                            <div key={s.id} className='flex justify-between items-center bg-actionHover p-3 rounded'>
                                <Typography variant='body2'>{s.snackName} x {s.quantity}</Typography>
                                <Typography variant='body2' className='font-bold'>Rp {(s.snackPrice * s.quantity).toLocaleString('id-ID')}</Typography>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card className='border-2 border-primary'>
            <CardContent className='flex flex-col gap-4'>
              <Typography variant='h6' className='font-bold text-center'>Rincian Pembayaran</Typography>
              <Divider />
              
              <div className='flex justify-between'>
                <Typography>Total Tiket ({selectedSeats.length}x)</Typography>
                <Typography className='font-bold'>Rp {ticketTotal.toLocaleString('id-ID')}</Typography>
              </div>
              
              <div className='flex justify-between'>
                <Typography>Total Snack</Typography>
                <Typography className='font-bold'>Rp {snackTotal.toLocaleString('id-ID')}</Typography>
              </div>

              <div className='flex justify-between'>
                <Typography>Biaya Layanan</Typography>
                <Typography className='font-bold'>Rp 0</Typography>
              </div>
              
              <Divider className='mlb-2' />
              
              <div className='flex justify-between items-center'>
                <Typography variant='h6' className='font-black'>GRAND TOTAL</Typography>
                <Typography variant='h4' color='primary' className='font-black'>
                    Rp {grandTotal.toLocaleString('id-ID')}
                </Typography>
              </div>

              <Typography variant='caption' className='text-center mbs-4 italic' color='textSecondary'>
                *Setelah menekan tombol konfirmasi, tiket akan diproses.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default BookingReview
