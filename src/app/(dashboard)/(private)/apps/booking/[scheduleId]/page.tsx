// Component Imports
import BookingWizard from '@/views/apps/booking/BookingWizard'

// Server Action Imports
import { getBookingData } from '@/app/server/cinemaActions'

const BookingPage = async ({ params }: { params: { scheduleId: string } }) => {
  const { scheduleId } = params

  // Fetch data for the schedule
  const bookingData = await getBookingData(scheduleId)

  if (!bookingData) {
    return <div className='p-20 text-center'>Jadwal penayangan tidak ditemukan</div>
  }

  return <BookingWizard bookingData={bookingData} />
}

export default BookingPage
