'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'
import Script from 'next/script'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

// Component Imports
import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from '@components/stepper-dot'
import DirectionalIcon from '@components/DirectionalIcon'
import SeatSelection from './steps/SeatSelection'
import SnackSelection from './steps/SnackSelection'
import BookingReview from './steps/BookingReview'

// Type Imports
import type { StepperProps } from '@mui/material/Stepper'

// Server Actions
import { getSnacks, finalizeBooking, getSnapToken } from '@/app/server/cinemaActions'

const steps = [
  {
    title: 'Pilih Kursi',
    subtitle: 'Tentukan posisi menonton ideal Anda'
  },
  {
    title: 'Snack & Minuman',
    subtitle: 'Lengkapi pengalaman menonton Anda'
  },
  {
    title: 'Konfirmasi',
    subtitle: 'Cek kembali pesanan Anda'
  }
]

const BookingWizard = ({ bookingData }: { bookingData: any }) => {
  // States
  const [activeStep, setActiveStep] = useState(0)
  const [selectedSeats, setSelectedSeats] = useState<any[]>([])
  const [selectedSnacks, setSelectedSnacks] = useState<any[]>([])
  const [snacks, setSnacks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Hooks
  const { data: session }: any = useSession()
  const router = useRouter()

  // Fetch snacks on mount
  useEffect(() => {
    const fetchSnacks = async () => {
      const data = await getSnacks()
      setSnacks(data)
    }
    fetchSnacks()
  }, [])

  const handleNext = () => {
    if (activeStep === 0 && selectedSeats.length === 0) {
      toast.error('Silakan pilih setidaknya satu kursi.')
      return
    }
    setActiveStep(prev => prev + 1)
  }

  const handleFinalize = async () => {
    if (!session?.user?.id) {
      toast.error('Anda harus login untuk melakukan pemesanan.')
      return
    }

    setLoading(true)
    
    // Calculate totals
    const ticketTotal = selectedSeats.length * bookingData.schedulePriceRegular
    const snackTotal = selectedSnacks.reduce((acc: number, s: any) => acc + (s.snackPrice * s.quantity), 0)
    
    const res = await finalizeBooking({
      scheduleId: bookingData.id,
      userId: session.user.id,
      selectedSeats,
      selectedSnacks,
      totalAmount: ticketTotal + snackTotal
    })

    if (res.success) {
      const transactionId = (res.data as any).id
      
      // Get Snap Token from Midtrans
      const snapRes = await getSnapToken(transactionId)
      
      if (snapRes.success && snapRes.token) {
        // @ts-ignore
        window.snap.pay(snapRes.token, {
          onSuccess: function(result: any) {
            toast.success('Pembayaran Berhasil!')
            router.push(`/front-pages/booking/success/${transactionId}`)
          },
          onPending: function(result: any) {
            toast.info('Menunggu Pembayaran...')
            router.push(`/front-pages/booking/success/${transactionId}`)
          },
          onError: function(result: any) {
            toast.error('Pembayaran Gagal!')
          },
          onClose: function() {
            toast.warning('Anda menutup jendela pembayaran sebelum selesai.')
          }
        })
      } else {
        toast.error('Gagal mendapatkan token pembayaran Midtrans')
      }
    } else {
      toast.error(res.error || 'Gagal memproses pesanan')
    }
    setLoading(false)
  }

  const handleBack = () => setActiveStep(prev => prev - 1)

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SeatSelection 
            bookingData={bookingData} 
            selectedSeats={selectedSeats} 
            setSelectedSeats={setSelectedSeats} 
          />
        )
      case 1:
        return (
          <SnackSelection 
            snacks={snacks} 
            selectedSnacks={selectedSnacks} 
            setSelectedSnacks={setSelectedSnacks} 
          />
        )
      case 2:
        return (
          <BookingReview 
            bookingData={bookingData} 
            selectedSeats={selectedSeats} 
            selectedSnacks={selectedSnacks} 
          />
        )
      default:
        return 'Unknown step'
    }
  }

  return (
    <>
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <Card>
      <CardContent className='pbs-12'>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel slots={{ stepIcon: StepperCustomDot }}>
                  <div className='step-label'>
                    <Typography className='step-number'>{`0${index + 1}`}</Typography>
                    <div>
                      <Typography className='step-title' color='text.primary'>{step.title}</Typography>
                      <Typography className='step-subtitle'>{step.subtitle}</Typography>
                    </div>
                  </div>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </StepperWrapper>
      </CardContent>
      
      <Divider />

      <CardContent>
        {renderStepContent(activeStep)}
        
        <div className='flex justify-between mbs-10'>
          <Button
            variant='tonal'
            color='secondary'
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
          >
            Kembali
          </Button>
          <Button
            variant='contained'
            disabled={loading}
            onClick={activeStep === steps.length - 1 ? handleFinalize : handleNext}
            endIcon={loading ? <CircularProgress size={20} color='inherit' /> : (activeStep === steps.length - 1 ? <i className='tabler-check' /> : <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />)}
          >
            {activeStep === steps.length - 1 ? (loading ? 'Memproses...' : 'Konfirmasi & Bayar') : 'Lanjut'}
          </Button>
        </div>
      </CardContent>
    </Card>
    </>
  )
}

export default BookingWizard
