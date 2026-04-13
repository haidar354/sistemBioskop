'use client'

// React Imports
import React from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'
import ReactPlayer from 'react-player'
import { format } from 'date-fns'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Styled Components
const HeroWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  paddingTop: '100px',
  paddingBottom: '60px',
  backgroundColor: theme.palette.background.default,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'var(--film-bg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(30px) brightness(0.3)',
    opacity: 0.6,
    zIndex: 0
  }
}))

const FilmDetailView = ({ film }: { film: any }) => {
  return (
    <div className='flex flex-col'>
      {/* Hero Section */}
      <HeroWrapper style={{ '--film-bg': `url(${film.filmPoster})` } as any}>
        <div className={classnames('relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start', frontCommonStyles.layoutSpacing)}>
          <img 
            src={film.filmPoster} 
            alt={film.filmTitle} 
            className='bs-[450px] is-[300px] object-cover rounded-xl shadow-2xl border-4 border-white/10'
          />
          <div className='flex flex-col gap-6 text-center md:text-left flex-1'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-3 justify-center md:justify-start'>
                <Chip label={film.filmAgeRating} color='warning' variant='filled' className='font-bold' />
                <Typography variant='h6' color='primary' className='font-medium'>{film.filmGenre}</Typography>
              </div>
              <Typography variant='h2' className='font-black text-white leading-tight'>
                {film.filmTitle}
              </Typography>
              <Typography variant='h5' className='text-white/80 font-medium'>
                {film.filmDuration} Menit • {film.filmDirector}
              </Typography>
            </div>
            
            <div className='flex flex-wrap gap-4 justify-center md:justify-start'>
              <Button variant='contained' size='large' startIcon={<i className='tabler-player-play' />}>
                Trailer
              </Button>
              <Button variant='tonal' color='secondary' size='large' startIcon={<i className='tabler-share' />}>
                Bagikan
              </Button>
            </div>

            <Card className='bg-black/40 backdrop-blur-md border-white/10'>
              <CardContent>
                <Typography variant='h6' className='mbe-2 text-primary'>Sinopsis</Typography>
                <Typography className='text-white/90 leading-relaxed'>
                  {film.filmSynopsis || 'Belum ada sinopsis untuk film ini.'}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </HeroWrapper>

      {/* Booking Section */}
      <div className={classnames('pbs-[60px] pbe-[100px]', frontCommonStyles.layoutSpacing)}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            <Typography variant='h4' className='font-bold mbe-6 flex items-center gap-3'>
              <i className='tabler-calendar-event text-primary text-3xl' />
              Jadwal Penayangan Hari Ini
            </Typography>
            
            {film.schedules.length === 0 ? (
                <Alert severity="info">Tidak ada jadwal tayang tersedia untuk saat ini.</Alert>
            ) : (
                <div className='flex flex-col gap-8'>
                    {/* Group by Studio */}
                    {Array.from(new Set(film.schedules.map((s: any) => s.studioId))).map((studioId: any) => {
                        const studioSchedules = film.schedules.filter((s: any) => s.studioId === studioId)
                        const studioName = studioSchedules[0].studio.studioName
                        const studioType = studioSchedules[0].studio.studioType

                        return (
                            <Card key={studioId} variant='outlined' className='overflow-hidden border-primary/20 bg-primary/5'>
                                <div className='p-4 bg-primary/10 flex justify-between items-center'>
                                    <Typography variant='h6 font-bold'>{studioName}</Typography>
                                    <Chip label={studioType.toUpperCase()} size='small' color='primary' variant='tonal' />
                                </div>
                                <CardContent className='flex flex-wrap gap-4'>
                                    {studioSchedules.map((s: any) => (
                                        <Button 
                                            key={s.id} 
                                            component={Link}
                                            href={`/apps/booking/${s.id}`}
                                            variant='tonal' 
                                            className='flex flex-col p-4 is-[100px] border border-primary/30 hover:bg-primary hover:text-white transition-all'
                                        >
                                            <Typography className='font-black text-lg'>{format(new Date(s.scheduleTimeStart), 'HH:mm')}</Typography>
                                            <Typography variant='caption font-bold'>Rp {s.schedulePriceRegular / 1000}K</Typography>
                                        </Button>
                                    ))}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant='h4' className='font-bold mbe-6 flex items-center gap-3'>
              <i className='tabler-video text-primary text-3xl' />
              Trailer
            </Typography>
            <Card className='overflow-hidden border-2 border-primary/20 aspect-video'>
                {film.filmTrailerUrl ? (
                    <ReactPlayer 
                        url={film.filmTrailerUrl} 
                        width='100%' 
                        height='100%' 
                        controls
                    />
                ) : (
                    <div className='bs-full flex items-center justify-center bg-backgroundPaper'>
                        <Typography color='textSecondary'>Trailer belum tersedia</Typography>
                    </div>
                )}
            </Card>
            
            <div className='mbs-8'>
                <Typography variant='h6' className='mbe-4 font-bold'>Pemeran Utama</Typography>
                <Typography className='leading-relaxed font-medium text-textSecondary'>
                    {film.filmCast || 'Informasi pemeran belum tersedia.'}
                </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default FilmDetailView
