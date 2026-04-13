// Component Imports
import ScheduleList from '@/views/apps/schedules'

// Server Action Imports
import { getSchedules, getFilms, getStudios } from '@/app/server/cinemaActions'

const ScheduleApp = async () => {
  // Fetch required data in parallel
  const [schedules, films, studios] = await Promise.all([
    getSchedules(),
    getFilms(),
    getStudios()
  ])

  return (
    <ScheduleList 
        scheduleData={schedules} 
        films={films} 
        studios={studios} 
    />
  )
}

export default ScheduleApp
