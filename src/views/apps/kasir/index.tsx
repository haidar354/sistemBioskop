// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

// Component Imports
import TicketScanner from './TicketScanner'

// Utils
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const KasirDashboard = ({ staffId, todaySchedules }: { staffId: string, todaySchedules: any[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5}>
        <TicketScanner staffId={staffId} />
      </Grid>
      
      <Grid item xs={12} md={7}>
        <Card>
          <CardHeader 
            title='Jadwal Tayang Hari Ini' 
            subheader={format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
            avatar={<i className='tabler-calendar-time text-2xl text-warning' />}
          />
          <Divider />
          <CardContent>
            {todaySchedules.length === 0 ? (
              <Typography className='text-center py-10'>Tidak ada jadwal penayangan untuk hari ini.</Typography>
            ) : (
              <div className='flex flex-col gap-4'>
                {todaySchedules.map((schedule: any) => (
                  <div key={schedule.id} className='flex items-center justify-between p-4 border rounded-lg bg-actionHover'>
                    <div className='flex flex-col gap-1'>
                      <Typography color='text.primary' className='font-bold'>{schedule.film.filmTitle}</Typography>
                      <Typography variant='body2'>{schedule.studio.studioName} ({schedule.studio.studioType?.toUpperCase()})</Typography>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      <Chip 
                        label={`${format(new Date(schedule.scheduleTimeStart), 'HH:mm')} - ${format(new Date(schedule.scheduleTimeEnd), 'HH:mm')}`} 
                        color='primary' 
                        variant='tonal'
                      />
                      <Typography variant='caption'>Rp {schedule.schedulePriceRegular.toLocaleString('id-ID')}</Typography>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default KasirDashboard
