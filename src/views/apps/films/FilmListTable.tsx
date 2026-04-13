'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import AddFilmDrawer from './AddFilmDrawer'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Server Actions
import { deleteFilm } from '@/app/server/cinemaActions'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const Icon = styled('i')({})

const columnHelper = createColumnHelper<any>()

const FilmListTable = ({ filmData }: { filmData: any[] }) => {
  // States
  const [addFilmOpen, setAddFilmOpen] = useState(false)
  const [selectedFilm, setSelectedFilm] = useState<any>(null)
  const [data, setData] = useState(filmData)

  const handleEdit = (film: any) => {
    setSelectedFilm(film)
    setAddFilmOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus film ini?')) {
      const res = await deleteFilm(id)
      if (res.success) {
        setData(data.filter(item => item.id !== id))
      }
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('filmTitle', {
        header: 'Film',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar 
                src={row.original.filmPoster} 
                variant="rounded" 
                size={40} 
                className='border border-divider'
            />
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium text-base'>
                {row.original.filmTitle}
              </Typography>
              <Typography variant='body2' className='text-xs'>
                {row.original.filmGenre} • {row.original.filmDuration}m
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('filmAgeRating', {
        header: 'Rating',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.filmAgeRating}
            size='small'
            color={
              row.original.filmAgeRating === 'D17' ? 'error' : 
              row.original.filmAgeRating === 'R13' ? 'warning' : 'success'
            }
          />
        )
      }),
      columnHelper.accessor('filmStatus', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.filmStatus === 'tayang' ? 'Sedang Tayang' : row.original.filmStatus}
            size='small'
            color={row.original.filmStatus === 'tayang' ? 'success' : 'secondary'}
            className='capitalize'
          />
        )
      }),
      columnHelper.accessor('filmDirector', {
        header: 'Sutradara',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.filmDirector}</Typography>
      }),
      {
        id: 'action',
        header: 'Aksi',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => handleEdit(row.original)}>
              <i className='tabler-edit text-textSecondary' />
            </IconButton>
            <IconButton onClick={() => handleDelete(row.original.id)}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                { text: 'Lihat Trailer', icon: 'tabler-brand-youtube' },
                { text: 'Detail Cast', icon: 'tabler-info-circle' }
              ]}
            />
          </div>
        ),
        enableSorting: false
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  })

  return (
    <>
      <Card>
        <CardHeader 
          title='Manajemen Daftar Film' 
          action={
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => {
                setSelectedFilm(null)
                setAddFilmOpen(true)
              }}
            >
              Tambah Film
            </Button>
          }
        />
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePaginationComponent table={table} />
      </Card>
      
      <AddFilmDrawer
        open={addFilmOpen}
        filmData={selectedFilm}
        handleClose={() => setAddFilmOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </>
  )
}

export default FilmListTable
