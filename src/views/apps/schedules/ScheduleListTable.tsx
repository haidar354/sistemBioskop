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

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

// Component Imports
import AddScheduleDrawer from './AddScheduleDrawer'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper<any>()

const ScheduleListTable = ({ scheduleData, films, studios }: { scheduleData: any[], films: any[], studios: any[] }) => {
  // States
  const [addScheduleOpen, setAddScheduleOpen] = useState(false)
  const [data] = useState(scheduleData)

  const columns = useMemo(
    () => [
      columnHelper.accessor('film.filmTitle', {
        header: 'Film',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.film.filmTitle}
            </Typography>
            <Typography variant='body2' className='text-xs'>
              {row.original.film.filmGenre}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('studio.studioName', {
        header: 'Studio',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary'>{row.original.studio.studioName}</Typography>
            <Typography variant='caption'>{row.original.studio.studioType.toUpperCase()}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('scheduleDate', {
        header: 'Waktu Tayang',
        cell: ({ row }) => {
          const start = new Date(row.original.scheduleTimeStart)
          const end = new Date(row.original.scheduleTimeEnd)
          return (
            <div className='flex flex-col'>
                <Typography variant='body2' color='text.primary'>
                    {format(start, 'dd MMM yyyy', { locale: id })}
                </Typography>
                <Typography variant='caption'>
                    {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                </Typography>
            </div>
          )
        }
      }),
      columnHelper.accessor('schedulePriceRegular', {
        header: 'Harga Tiket',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            Rp {row.original.schedulePriceRegular.toLocaleString('id-ID')}
          </Typography>
        )
      }),
      columnHelper.accessor('scheduleStatus', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.scheduleStatus}
            size='small'
            color={row.original.scheduleStatus === 'aktif' ? 'success' : 'secondary'}
            className='capitalize'
          />
        )
      }),
      {
        id: 'action',
        header: 'Aksi',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => alert('Detail reservasi kursi segera hadir!')}>
              <i className='tabler-armchair text-textSecondary' />
            </IconButton>
            <IconButton>
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      }
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
          title='Manajemen Jadwal Tayang' 
          action={
            <Button
              variant='contained'
              startIcon={<i className='tabler-calendar-plus' />}
              onClick={() => setAddScheduleOpen(true)}
            >
              Tambah Jadwal
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
      
      <AddScheduleDrawer
        open={addScheduleOpen}
        handleClose={() => setAddScheduleOpen(false)}
        onSuccess={() => window.location.reload()}
        films={films}
        studios={studios}
      />
    </>
  )
}

export default ScheduleListTable
