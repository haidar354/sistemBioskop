// Next Imports
import { getServerSession } from 'next-auth'

// Component Imports
import KasirDashboard from '@/views/apps/kasir'

// Libs & Actions
import { authOptions } from '@/libs/auth'
import { getSchedules } from '@/app/server/cinemaActions'

const KasirApp = async () => {
  // 1. Get current staff session
  const session = await getServerSession(authOptions)
  const staffId = session?.user?.id || 'unknown'
  
  // 2. Fetch all schedules and filter for today
  const allSchedules = await getSchedules()
  const today = new Date().toISOString().split('T')[0]
  const todaySchedules = allSchedules.filter((s: any) => 
    new Date(s.scheduleDate).toISOString().split('T')[0] === today
  )

  return <KasirDashboard staffId={staffId} todaySchedules={todaySchedules} />
}

export default KasirApp
