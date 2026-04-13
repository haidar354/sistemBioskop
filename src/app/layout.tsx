// Next Imports
import { headers } from 'next/headers'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import Providers from '@components/Providers'

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Sistem Tiket Bioskop - Ocean Blue',
  description: 'Pesan tiket bioskop pilihan Anda dengan mudah, cepat, dan aman.'
}

const RootLayout = async ({ children }: ChildrenType) => {
  // Vars
  const headersList = await headers()
  const systemMode = await getSystemMode()
  const direction = i18n.langDirection['id']

  return (
    <TranslationWrapper headersList={headersList} lang='id'>
      <html id='__next' lang='id' dir={direction} suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
          <Providers direction={direction}>
            {children}
          </Providers>
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
