// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'

// Styled Components for Seat
const SeatWrapper = styled('div')<{ status: 'available' | 'selected' | 'reserved' }>(({ theme, status }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: status === 'reserved' ? 'not-allowed' : 'pointer',
  fontSize: '10px',
  fontWeight: 'bold',
  transition: 'all 0.2s ease',
  border: '2px solid',
  
  ...(status === 'available' && {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  }),
  
  ...(status === 'selected' && {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    boxShadow: theme.shadows[3]
  }),
  
  ...(status === 'reserved' && {
    borderColor: theme.palette.action.disabledBackground,
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled
  })
}))

const SeatSelection = ({ bookingData, selectedSeats, setSelectedSeats }: any) => {
  const { studio, reservations, schedulePriceRegular } = bookingData
  const { seats, studioTotalRows, studioTotalColumns } = studio

  const toggleSeat = (seat: any) => {
    const isReserved = reservations.some((r: any) => r.seatId === seat.id)
    if (isReserved) return

    const isSelected = selectedSeats.find((s: any) => s.id === seat.id)
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s: any) => s.id !== seat.id))
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const getSeatStatus = (seat: any) => {
    const isReserved = reservations.some((r: any) => r.seatId === seat.id)
    if (isReserved) return 'reserved'
    
    const isSelected = selectedSeats.find((s: any) => s.id === seat.id)
    if (isSelected) return 'selected'
    
    return 'available'
  }

  // Group seats by row for easier rendering
  const rows = Array.from(new Set(seats.map((s: any) => s.seatRow)))

  return (
    <div className='flex flex-col items-center gap-10 pbs-10'>
      {/* Screen Indicator */}
      <div className='is-full flex flex-col items-center gap-2'>
        <div className='is-2/3 bs-[8px] bg-primary/20 rounded-full shadow-[0_0_20px_rgba(var(--mui-palette-primary-mainChannel),0.5)]' />
        <Typography variant='caption' className='font-bold uppercase tracking-widest text-textSecondary'>LAYAR BIOSKOP</Typography>
      </div>

      {/* Seat Grid */}
      <div className='flex flex-col gap-3 min-is-fit overflow-x-auto p-4'>
        {rows.map((row: any) => (
          <div key={row} className='flex items-center gap-4'>
            <Typography variant='body2' className='is-[20px] font-bold text-center'>{row}</Typography>
            <div className='flex gap-2'>
              {seats.filter((s: any) => s.seatRow === row).map((seat: any) => (
                <SeatWrapper 
                  key={seat.id} 
                  status={getSeatStatus(seat)}
                  onClick={() => toggleSeat(seat)}
                >
                  {seat.seatColumn}
                </SeatWrapper>
              ))}
            </div>
            <Typography variant='body2' className='is-[20px] font-bold text-center'>{row}</Typography>
          </div>
        ))}
      </div>

      {/* Legend & Summary */}
      <div className='is-full flex flex-col md:flex-row gap-8 justify-between items-center bg-actionHover p-6 rounded-xl border border-divider'>
        <div className='flex gap-6 items-center'>
            <div className='flex items-center gap-2'>
                <SeatWrapper status='available' />
                <Typography variant='body2'>Tersedia</Typography>
            </div>
            <div className='flex items-center gap-2'>
                <SeatWrapper status='selected' />
                <Typography variant='body2'>Pilihan</Typography>
            </div>
            <div className='flex items-center gap-2'>
                <SeatWrapper status='reserved' />
                <Typography variant='body2'>Terisi</Typography>
            </div>
        </div>

        <Divider orientation='vertical' flexItem className='hidden md:block' />

        <div className='flex items-center gap-8'>
            <div className='flex flex-col items-end'>
                <Typography variant='caption' color='textSecondary'>Total Kursi: {selectedSeats.length}</Typography>
                <Typography variant='h5' color='primary' className='font-black'>
                    Rp {(selectedSeats.length * schedulePriceRegular).toLocaleString('id-ID')}
                </Typography>
            </div>
        </div>
      </div>
      
      {selectedSeats.length > 0 && (
          <div className='flex flex-wrap gap-2 justify-center'>
              {selectedSeats.map((s: any) => (
                  <Chip 
                    key={s.id} 
                    label={`${s.seatRow}${s.seatColumn}`} 
                    color='primary' 
                    onDelete={() => toggleSeat(s)} 
                    variant='tonal'
                  />
              ))}
          </div>
      )}
    </div>
  )
}

export default SeatSelection
