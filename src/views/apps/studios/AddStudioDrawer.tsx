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
import { addStudio } from '@/app/server/cinemaActions'

type Props = {
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}

const AddStudioDrawer = ({ open, handleClose, onSuccess }: Props) => {
  // States
  const [formData, setFormData] = useState({
    studioName: '',
    studioType: 'reguler',
    studioTotalRows: 8,
    studioTotalColumns: 10
  })
  const [loading, setLoading] = useState(false)

  const handleReset = () => {
    setFormData({
      studioName: '',
      studioType: 'reguler',
      studioTotalRows: 8,
      studioTotalColumns: 10
    })
    handleClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await addStudio(formData)

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
        <Typography variant='h5'>Tambah Studio Baru</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-6'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <CustomTextField
            fullWidth
            label='Nama Studio'
            placeholder='Contoh: Studio 1 IMAX'
            value={formData.studioName}
            onChange={e => setFormData({ ...formData, studioName: e.target.value })}
            required
          />
          <CustomTextField
            select
            fullWidth
            label='Tipe Studio'
            value={formData.studioType}
            onChange={e => setFormData({ ...formData, studioType: e.target.value })}
          >
            <MenuItem value='reguler'>Regular</MenuItem>
            <MenuItem value='imax'>IMAX</MenuItem>
            <MenuItem value='fourDX'>4DX</MenuItem>
            <MenuItem value='dolby'>Dolby Atmos</MenuItem>
          </CustomTextField>
          
          <div className='flex gap-4'>
            <CustomTextField
              fullWidth
              type='number'
              label='Jumlah Baris (A-Z)'
              value={formData.studioTotalRows}
              onChange={e => setFormData({ ...formData, studioTotalRows: parseInt(e.target.value) })}
              required
              helperText="Max 10 (A-J)"
            />
            <CustomTextField
              fullWidth
              type='number'
              label='Jumlah Kolom'
              value={formData.studioTotalColumns}
              onChange={e => setFormData({ ...formData, studioTotalColumns: parseInt(e.target.value) })}
              required
            />
          </div>

          <Typography variant='caption' color='textSecondary'>
            Total Kapasitas: {(formData.studioTotalRows * formData.studioTotalColumns) || 0} Kursi
          </Typography>

          <div className='flex items-center gap-4 mt-4'>
            <Button variant='contained' type='submit' disabled={loading} fullWidth>
              {loading ? 'Memproses...' : 'Tambah Studio'}
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

export default AddStudioDrawer
