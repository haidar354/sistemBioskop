'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Config Imports
import { i18n } from '@configs/i18n'

const LangRedirect = () => {
  const pathname = usePathname()

  // Redirect to the same pathname to strip any potential legacy locale prefix 
  // or just handle missing locales by staying on the same path (since everything is root now)
  redirect(pathname)
}

export default LangRedirect
