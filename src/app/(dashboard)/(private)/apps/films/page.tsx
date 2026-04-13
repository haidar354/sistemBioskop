// Component Imports
import FilmList from '@/views/apps/films'

// Server Action Imports
import { getFilms } from '@/app/server/cinemaActions'

const FilmApp = async () => {
  // Fetch films data
  const data = await getFilms()

  return <FilmList filmData={data} />
}

export default FilmApp
