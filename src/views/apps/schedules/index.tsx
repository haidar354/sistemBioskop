// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ScheduleListTable from './ScheduleListTable'

const ScheduleList = ({ scheduleData, films, studios }: { scheduleData: any[], films: any[], studios: any[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ScheduleListTable scheduleData={scheduleData} films={films} studios={studios} />
      </Grid>
    </Grid>
  )
}

export default ScheduleList
