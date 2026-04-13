'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Server Actions
import { verifyTicket } from '@/app/server/cinemaActions'

const TicketScanner = ({ staffId }: { staffId: string }) => {
  // States
  const [barcode, setBarcode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode) return

    setLoading(true)
    setError('')
    setResult(null)

    const res = await verifyTicket(barcode, staffId)

    if (res.success) {
      setResult(res.data)
      setBarcode('') // Clear for next scan
    } else {
      setError(res.error || 'Verifikasi gagal')
    }
    setLoading(false)
  }

  return (
    <Card className='border-2 border-primary'>
      <CardHeader 
        title='Scan Barcode Tiket' 
        subheader='Masukkan kode atau scan barcode tiket penonton'
        avatar={<i className='tabler-scan text-3xl text-primary' />}
      />
      <Divider />
      <CardContent className='flex flex-col gap-6 p-10'>
        <form onSubmit={handleScan} className='flex gap-4'>
          <CustomTextField
            fullWidth
            size='medium'
            placeholder='Masukkan Kode Tiket (e.g. TKT-XXXXX)'
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <Button 
            variant='contained' 
            type='submit' 
            disabled={loading || !barcode}
            startIcon={<i className='tabler-barcode' />}
          >
            {loading ? 'Memvalidasi...' : 'Verifikasi'}
          </Button>
        </form>

        {error && (
          <Alert severity='error' variant='filled'>
            {error}
          </Alert>
        )}

        {result && (
          <Alert 
            severity='success' 
            variant='tonal'
            icon={<i className='tabler-circle-check text-2xl' />}
            className='p-6'
          >
            <Typography variant='h5' className='mbe-2 font-bold'>TIKET VALID!</Typography>
            <Divider className='mbe-3' />
            <div className='flex flex-col gap-1'>
              <Typography><strong>Film:</strong> {result.filmTitle}</Typography>
              <Typography><strong>Studio:</strong> {result.studioName}</Typography>
              <Typography><strong>Nomor Kursi:</strong> <span className='text-xl text-primary font-black'>{result.seatCode}</span></Typography>
              <Typography variant='caption' className='mbs-2'>
                Diverifikasi pada: {new Date(result.scannedAt).toLocaleString('id-ID')}
              </Typography>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default TicketScanner
