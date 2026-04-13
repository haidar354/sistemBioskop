// Component Imports
import LandingPageWrapper from '@/views'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getFilmsForLanding } from '@/app/server/cinemaActions'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()
  const filmData = await getFilmsForLanding()

  return <LandingPageWrapper mode={mode} filmData={filmData} />
}

export default LandingPage
