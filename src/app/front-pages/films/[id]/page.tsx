// Component Imports
import FilmDetailView from '@/views/front-pages/films/FilmDetailView'

// Server Action Imports
import { getFilmDetailWithSchedules } from '@/app/server/cinemaActions'
import { getServerMode } from '@core/utils/serverHelpers'

const FilmDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params
  
  // Fetch data
  const filmData = await getFilmDetailWithSchedules(id)
  const mode = await getServerMode()

  if (!filmData) {
    return <div className='p-20 text-center'>Film tidak ditemukan</div>
  }

  return <FilmDetailView film={filmData} mode={mode} />
}

export default FilmDetailPage
