// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'

const SnackSelection = ({ snacks, selectedSnacks, setSelectedSnacks }: any) => {
  const updateQuantity = (snack: any, delta: number) => {
    const existing = selectedSnacks.find((s: any) => s.id === snack.id)
    
    if (existing) {
      const newQty = existing.quantity + delta
      if (newQty <= 0) {
        setSelectedSnacks(selectedSnacks.filter((s: any) => s.id !== snack.id))
      } else {
        setSelectedSnacks(
          selectedSnacks.map((s: any) => 
            s.id === snack.id ? { ...s, quantity: newQty } : s
          )
        )
      }
    } else if (delta > 0) {
      setSelectedSnacks([...selectedSnacks, { ...snack, quantity: 1 }])
    }
  }

  const getQty = (snackId: string) => {
    return selectedSnacks.find((s: any) => s.id === snackId)?.quantity || 0
  }

  return (
    <div className='flex flex-col gap-6 pbs-6'>
      <div className='flex flex-col gap-2'>
        <Typography variant='h5' className='font-bold'>Lengkapi dengan Snack & Minuman</Typography>
        <Typography color='textSecondary'>Pilih camilan favorit Anda untuk menemani waktu nonton</Typography>
      </div>

      <Grid container spacing={6}>
        {snacks.map((snack: any) => (
          <Grid item xs={12} sm={6} md={4} key={snack.id}>
            <Card variant='outlined' className='transition-all hover:border-primary/50'>
              <CardContent className='flex gap-4 items-center'>
                <Avatar 
                    src={snack.snackPhoto || '/images/avatars/1.png'} 
                    variant='rounded' 
                    className='bs-[80px] is-[80px]'
                />
                <div className='flex flex-col flex-1 overflow-hidden'>
                  <Typography className='font-bold truncate' color='text.primary'>{snack.snackName}</Typography>
                  <Typography variant='body2' color='textSecondary' className='truncate mbe-2'>
                    {snack.snackDescription}
                  </Typography>
                  <Typography color='primary' className='font-black'>
                    Rp {snack.snackPrice.toLocaleString('id-ID')}
                  </Typography>
                </div>
                
                <div className='flex flex-col items-center gap-1'>
                    <IconButton size='small' color='primary' onClick={() => updateQuantity(snack, 1)}>
                        <i className='tabler-circle-plus text-2xl' />
                    </IconButton>
                    <Typography className='font-bold'>{getQty(snack.id)}</Typography>
                    <IconButton 
                        size='small' 
                        disabled={getQty(snack.id) === 0}
                        onClick={() => updateQuantity(snack, -1)}
                    >
                        <i className='tabler-circle-minus text-2xl' />
                    </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {selectedSnacks.length > 0 && (
          <Card className='bg-primary/5 border border-primary/20 mbs-6'>
              <CardContent className='flex justify-between items-center'>
                  <Typography className='font-bold'>Total {selectedSnacks.reduce((acc: number, s: any) => acc + s.quantity, 0)} Item Snack dipilih</Typography>
                  <Typography variant='h5' color='primary' className='font-black'>
                    Rp {selectedSnacks.reduce((acc: number, s: any) => acc + (s.snackPrice * s.quantity), 0).toLocaleString('id-ID')}
                  </Typography>
              </CardContent>
          </Card>
      )}
    </div>
  )
}

export default SnackSelection
