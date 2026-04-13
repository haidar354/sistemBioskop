// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import StudioListTable from './StudioListTable'

const StudioList = ({ studioData }: { studioData: any[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <StudioListTable studioData={studioData} />
      </Grid>
    </Grid>
  )
}

export default StudioList
