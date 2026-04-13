'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Server Actions
import { addSchedule } from '@/app/server/cinemaActions'

type Props = {
  open: boolean
  handleClose: () => void
  onSuccess: () => void
  films: any[]
  studios: any[]
}

const AddScheduleDrawer = ({ open, handleClose, onSuccess, films, studios }: Props) => {
  // States
  const [formData, setFormData] = useState({
    filmId: '',
    studioId: '',
    scheduleDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    price: 35000
  })
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Calculate End Time automatically
  useEffect(() => {
    if (formData.filmId && formData.startTime) {
      const selectedFilm = films.find(f => f.id === formData.filmId)
      if (selectedFilm) {
        const [hours, minutes] = formData.startTime.split(':').map(Number)
        const date = new Date()
        date.setHours(hours, minutes, 0)
        
        // Add duration + 30 mins break
        date.setMinutes(date.getMinutes() + selectedFilm.filmDuration + 30)
        
        const endH = date.getHours().toString().padStart(2, '0')
        const endM = date.getMinutes().toString().padStart(2, '0')
        setEndTime(`${endH}:${endM}`)
      }
    }
  }, [formData.filmId, formData.startTime, films])

  const handleReset = () => {
    setFormData({
      filmId: '',
      studioId: '',
      scheduleDate: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      price: 35000
    })
    setEndTime('')
    setError('')
    handleClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const startDateTime = new Date(`${formData.scheduleDate}T${formData.startTime}:00`)
    const endDateTime = new Date(`${formData.scheduleDate}T${endTime}:00`)

    const res = await addSchedule({
      filmId: formData.filmId,
      studioId: formData.studioId,
      scheduleDate: formData.scheduleDate,
      scheduleTimeStart: startDateTime.toISOString(),
      scheduleTimeEnd: endDateTime.toISOString(),
      schedulePriceRegular: formData.price
    })

    if (res.success) {
      onSuccess()
      handleReset()
    } else {
      setError(res.error || 'Terjadi kesalahan')
    }
    setLoading(false)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between p-6'>
        <Typography variant='h5'>Buat Jadwal Baru</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-6'>
        {error && <Alert severity='error' className='mbe-4'>{error}</Alert>}
        
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <CustomTextField
            select
            fullWidth
            label='Pilih Film'
            value={formData.filmId}
            onChange={e => setFormData({ ...formData, filmId: e.target.value })}
            required
          >
            {films.map(film => (
              <MenuItem key={film.id} value={film.id}>
                {film.filmTitle} ({film.filmDuration}m)
              </MenuItem>
            ))}
          </CustomTextField>

          <CustomTextField
            select
            fullWidth
            label='Pilih Studio'
            value={formData.studioId}
            onChange={e => setFormData({ ...formData, studioId: e.target.value })}
            required
          >
            {studios.map(studio => (
              <MenuItem key={studio.id} value={studio.id}>
                {studio.studioName} ({studio.studioType.toUpperCase()})
              </MenuItem>
            ))}
          </CustomTextField>

          <CustomTextField
            fullWidth
            type='date'
            label='Tanggal Penayangan'
            value={formData.scheduleDate}
            onChange={e => setFormData({ ...formData, scheduleDate: e.target.value })}
            required
          />

          <div className='flex gap-4'>
            <CustomTextField
              fullWidth
              type='time'
              label='Waktu Mulai'
              value={formData.startTime}
              onChange={e => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <CustomTextField
              fullWidth
              label='Waktu Selesai (+Jeda)'
              value={endTime}
              disabled
              helperText="Otomatis (+30m jeda)"
            />
          </div>

          <CustomTextField
            fullWidth
            type='number'
            label='Harga Tiket (Regular)'
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
            required
            InputProps={{
              startAdornment: <Typography className='mie-2'>Rp</Typography>
            }}
          />

          <div className='flex items-center gap-4 mt-4'>
            <Button variant='contained' type='submit' disabled={loading || !endTime} fullWidth>
              {loading ? 'Validasi Jadwal...' : 'Buat Jadwal'}
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleReset} fullWidth>
              Batal
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddScheduleDrawer
