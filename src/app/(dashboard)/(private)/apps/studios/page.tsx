// Component Imports
import StudioList from '@/views/apps/studios'

// Server Action Imports
import { getStudios } from '@/app/server/cinemaActions'

const StudioApp = async () => {
  // Fetch studios data
  const data = await getStudios()

  return <StudioList studioData={data} />
}

export default StudioApp
