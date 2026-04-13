'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Server Actions
import { addFilm, updateFilm } from '@/app/server/cinemaActions'

type Props = {
  open: boolean
  handleClose: () => void
  filmData?: any
  onSuccess: () => void
}

const AddFilmDrawer = ({ open, handleClose, filmData, onSuccess }: Props) => {
  // States
  const [formData, setFormData] = useState({
    title: filmData?.filmTitle || '',
    genre: filmData?.filmGenre || '',
    duration: filmData?.filmDuration || 120,
    ageRating: filmData?.filmAgeRating || 'SU',
    status: filmData?.filmStatus || 'segera',
    director: filmData?.filmDirector || '',
    cast: filmData?.filmCast || '',
    synopsis: filmData?.filmSynopsis || '',
    posterUrl: filmData?.filmPoster || ''
  })
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleReset = () => {
    setFormData({
      title: '',
      genre: '',
      duration: 120,
      ageRating: 'SU',
      status: 'segera',
      director: '',
      cast: '',
      synopsis: '',
      posterUrl: ''
    })
    setPosterFile(null)
    handleClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append('filmTitle', formData.title)
    data.append('filmGenre', formData.genre)
    data.append('filmDuration', formData.duration.toString())
    data.append('filmAgeRating', formData.ageRating)
    data.append('filmStatus', formData.status)
    data.append('filmDirector', formData.director)
    data.append('filmCast', formData.cast)
    data.append('filmSynopsis', formData.synopsis)
    data.append('filmPosterUrl', formData.posterUrl)
    
    if (posterFile) {
      data.append('filmPosterFile', posterFile)
    }

    const res = filmData 
      ? await updateFilm(filmData.id, data)
      : await addFilm(data)

    if (res.success) {
      onSuccess()
      handleReset()
    } else {
      alert(res.error)
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
        <Typography variant='h5'>{filmData ? 'Edit Film' : 'Tambah Film Baru'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-6'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <CustomTextField
            fullWidth
            label='Judul Film'
            placeholder='Masukkan judul film'
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <CustomTextField
            fullWidth
            label='Genre'
            placeholder='Action, Drama, dll.'
            value={formData.genre}
            onChange={e => setFormData({ ...formData, genre: e.target.value })}
            required
          />
          <div className='flex gap-4'>
            <CustomTextField
              fullWidth
              type='number'
              label='Durasi (Menit)'
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              required
            />
            <CustomTextField
              select
              fullWidth
              label='Rating Usia'
              value={formData.ageRating}
              onChange={e => setFormData({ ...formData, ageRating: e.target.value })}
            >
              <MenuItem value='SU'>SU</MenuItem>
              <MenuItem value='R13'>R13</MenuItem>
              <MenuItem value='D17'>D17</MenuItem>
              <MenuItem value='D21'>D21</MenuItem>
            </CustomTextField>
          </div>
          <CustomTextField
            select
            fullWidth
            label='Status Film'
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          >
            <MenuItem value='tayang'>Sedang Tayang</MenuItem>
            <MenuItem value='segera'>Segera Datang</MenuItem>
            <MenuItem value='selesai'>Selesai</MenuItem>
          </CustomTextField>
          <CustomTextField
            fullWidth
            label='Sutradara'
            value={formData.director}
            onChange={e => setFormData({ ...formData, director: e.target.value })}
          />
          <CustomTextField
            fullWidth
            multiline
            rows={2}
            label='Pemeran (Cast)'
            value={formData.cast}
            onChange={e => setFormData({ ...formData, cast: e.target.value })}
          />
          <CustomTextField
            fullWidth
            multiline
            rows={3}
            label='Sinopsis'
            value={formData.synopsis}
            onChange={e => setFormData({ ...formData, synopsis: e.target.value })}
          />
          
          <Divider sx={{ my: 2 }}>Poster Film</Divider>
          
          <CustomTextField
            fullWidth
            label='URL Poster Eksternal'
            placeholder='https://example.com/poster.jpg'
            value={formData.posterUrl}
            onChange={e => setFormData({ ...formData, posterUrl: e.target.value })}
          />
          
          <Typography variant='caption' color='textSecondary' className='text-center'>
            Atau Unggah File Lokal
          </Typography>
          
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setPosterFile(e.target.files?.[0] || null)}
          />

          <div className='flex items-center gap-4 mt-4'>
            <Button variant='contained' type='submit' disabled={loading} fullWidth>
              {loading ? 'Menyimpan...' : (filmData ? 'Simpan Perubahan' : 'Tambah Film')}
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

export default AddFilmDrawer
