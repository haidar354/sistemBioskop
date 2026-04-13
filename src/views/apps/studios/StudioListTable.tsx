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

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import AddStudioDrawer from './AddStudioDrawer'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper<any>()

const StudioListTable = ({ studioData }: { studioData: any[] }) => {
  // States
  const [addStudioOpen, setAddStudioOpen] = useState(false)
  const [data] = useState(studioData)

  const columns = useMemo(
    () => [
      columnHelper.accessor('studioName', {
        header: 'Nama Studio',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <CustomAvatar color='primary' variant='rounded' size={34}>
              <i className='tabler-video text-xl' />
            </CustomAvatar>
            <Typography color='text.primary' className='font-medium'>
              {row.original.studioName}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('studioType', {
        header: 'Tipe',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.studioType.toUpperCase()}
            size='small'
            color={row.original.studioType === 'imax' ? 'error' : 'info'}
            className='capitalize'
          />
        )
      }),
      columnHelper.accessor('studioCapacity', {
        header: 'Kapasitas',
        cell: ({ row }) => (
          <Typography>{row.original.studioCapacity} Kursi ({row.original.studioTotalRows}x{row.original.studioTotalColumns})</Typography>
        )
      }),
      columnHelper.accessor('studioStatus', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.studioStatus === 'aktif' ? 'Aktif' : 'Maintenance'}
            size='small'
            color={row.original.studioStatus === 'aktif' ? 'success' : 'warning'}
          />
        )
      }),
      {
        id: 'action',
        header: 'Aksi',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => alert('Fitur konfigurasi kursi visual segera hadir!')}>
              <i className='tabler-settings text-textSecondary' />
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
          title='Manajemen Studio' 
          action={
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddStudioOpen(true)}
            >
              Tambah Studio
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
      
      <AddStudioDrawer
        open={addStudioOpen}
        handleClose={() => setAddStudioOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </>
  )
}

export default StudioListTable
