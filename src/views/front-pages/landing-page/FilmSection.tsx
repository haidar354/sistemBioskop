// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
    '& .buy-button': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
}))

const BuyButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: 20,
  left: '10%',
  width: '80%',
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'all 0.3s ease'
}))

const FilmSection = ({ filmData }: { filmData: any[] }) => {
  return (
    <section id='films' className='pbs-[100px] pbe-[50px]'>
      <div className={classnames('flex flex-col gap-12', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col items-center gap-4 text-center'>
            <Chip label='Now Playing' variant='tonal' color='primary' size='small' />
            <Typography variant='h3' className='font-extrabold'>
                Sedang Tayang di Bioskop
            </Typography>
            <Typography className='max-is-[600px]'>
                Nikmati pengalaman menonton film terbaik dengan teknologi studio terkini dan kenyamanan kursi premium kami.
            </Typography>
        </div>

        <Grid container spacing={6}>
          {filmData.length === 0 ? (
            <Grid item xs={12}>
                <Typography className='text-center py-10 text-textSecondary'>
                    Belum ada film yang sedang tayang saat ini.
                </Typography>
            </Grid>
          ) : (
            filmData.map((film, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StyledCard className='h-full relative overflow-hidden'>
                  <div className='relative bs-[400px] overflow-hidden'>
                    <img 
                        src={film.filmPoster || '/images/avatars/1.png'} 
                        alt={film.filmTitle} 
                        className='is-full bs-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />
                    
                    <div className='absolute inset-x-4 top-4 flex justify-between items-start'>
                        <Chip 
                            label={film.filmAgeRating} 
                            color='warning' 
                            size='small' 
                            className='font-bold'
                        />
                    </div>

                    <BuyButton 
                        variant='contained' 
                        className='buy-button' 
                        href={`/front-pages/films/${film.id}`}
                    >
                        Beli Tiket
                    </BuyButton>
                  </div>
                  <CardContent className='flex flex-col gap-2'>
                    <Typography variant='h5' className='font-bold truncate'>
                        {film.filmTitle}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                        {film.filmGenre} • {film.filmDuration}m
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))
          )}
        </Grid>
      </div>
    </section>
  )
}

export default FilmSection
