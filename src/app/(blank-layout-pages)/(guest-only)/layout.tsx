// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// HOC Imports
import GuestOnlyRoute from '@/hocs/GuestOnlyRoute'

const Layout = async ({ children }: ChildrenType) => {
  const { children: childrenContent } = { children }

  return <GuestOnlyRoute>{childrenContent}</GuestOnlyRoute>
}

export default Layout
