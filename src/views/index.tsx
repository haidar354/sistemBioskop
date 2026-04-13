'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import HeroSection from './front-pages/landing-page/HeroSection'
import FilmSection from './front-pages/landing-page/FilmSection'
import Faqs from './front-pages/landing-page/Faqs'
import ContactUs from './front-pages/landing-page/ContactUs'
import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode, filmData }: { mode: SystemMode; filmData: any[] }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='bg-backgroundPaper'>
      <HeroSection mode={mode} />
      <FilmSection filmData={filmData} />
      <Faqs />
      <ContactUs />
    </div>
  )
}

export default LandingPageWrapper
