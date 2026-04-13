// Component Imports
import LandingPageWrapper from '@/views'
import FrontLayout from '@components/layout/front-pages'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getFilmsForLanding } from '@/app/server/cinemaActions'

// Context Imports
import { IntersectionProvider } from '@/contexts/intersectionContext'

const HomePage = async () => {
  // Vars
  const mode = await getServerMode()
  const filmData = await getFilmsForLanding()

  return (
    <IntersectionProvider>
      <FrontLayout>
        <LandingPageWrapper mode={mode} filmData={filmData} />
      </FrontLayout>
    </IntersectionProvider>
  )
}

export default HomePage
