// Component Imports
import TicketSuccessView from '@/views/front-pages/booking/TicketSuccessView'

// Server Action Imports
import { getTransactionDetail } from '@/app/server/cinemaActions'

const BookingSuccessPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params
  
  // Fetch transaction details
  const transaction = await getTransactionDetail(id)

  if (!transaction) {
    return <div className='p-20 text-center'>Transaksi tidak ditemukan</div>
  }

  return <TicketSuccessView transaction={transaction} />
}

export default BookingSuccessPage
