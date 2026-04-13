// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import FilmListTable from './FilmListTable'

const FilmList = ({ filmData }: { filmData: any[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FilmListTable filmData={filmData} />
      </Grid>
    </Grid>
  )
}

export default FilmList
