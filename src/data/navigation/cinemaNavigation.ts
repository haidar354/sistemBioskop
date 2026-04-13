import type { VerticalMenuDataType } from '@/types/menuTypes'

// Role based navigation data
const cinemaNavigation = (userRole: string): VerticalMenuDataType[] => {
  const commonMenu: VerticalMenuDataType[] = [
    {
      label: 'Dashboard',
      icon: 'tabler-smart-home',
      href: '/dashboards/crm'
    }
  ]

  const adminMenu: VerticalMenuDataType[] = [
    {
      label: 'Manajemen Bioskop',
      isSection: true,
      children: [
        {
          label: 'Daftar Film',
          icon: 'tabler-movie',
          href: '/apps/films'
        },
        {
          label: 'Jadwal Tayang',
          icon: 'tabler-calendar-event',
          href: '/apps/schedules'
        },
        {
          label: 'Studio & Kursi',
          icon: 'tabler-armchair',
          href: '/apps/studios'
        },
        {
          label: 'Snack & Menu',
          icon: 'tabler-popcorn',
          href: '/apps/snacks'
        }
      ]
    },
    {
      label: 'Promosi & User',
      isSection: true,
      children: [
        {
          label: 'Promo & Voucher',
          icon: 'tabler-ticket',
          href: '/apps/promos'
        },
        {
          label: 'Manajemen User',
          icon: 'tabler-users',
          href: '/apps/users'
        }
      ]
    },
    {
      label: 'Laporan',
      isSection: true,
      children: [
        {
          label: 'Laporan Keuangan',
          icon: 'tabler-chart-bar',
          href: '/apps/reports/finance'
        },
        {
          label: 'Audit Log',
          icon: 'tabler-history',
          href: '/apps/reports/audit'
        }
      ]
    }
  ]

  const kasirMenu: VerticalMenuDataType[] = [
    {
      label: 'Operasional',
      isSection: true,
      children: [
        {
          label: 'Scan Barcode',
          icon: 'tabler-qrcode',
          href: '/apps/kasir/scan'
        },
        {
          label: 'Jadwal Hari Ini',
          icon: 'tabler-calendar',
          href: '/apps/kasir/today'
        }
      ]
    }
  ]

  const customerMenu: VerticalMenuDataType[] = [
    {
      label: 'Tiket & Film',
      isSection: true,
      children: [
        {
          label: 'Jelajah Film',
          icon: 'tabler-movie',
          href: '/apps/customer/browse'
        },
        {
          label: 'Tiket Saya',
          icon: 'tabler-ticket',
          href: '/apps/customer/tickets'
        },
        {
          label: 'Poin & Reward',
          icon: 'tabler-gift',
          href: '/apps/customer/rewards'
        }
      ]
    }
  ]

  // Combine menus based on role
  let finalMenu = [...commonMenu]

  if (userRole === 'admin') {
    finalMenu = [...finalMenu, ...adminMenu]
  } else if (userRole === 'kasir') {
    finalMenu = [...finalMenu, ...kasirMenu]
  } else if (userRole === 'customer') {
    finalMenu = [...finalMenu, ...customerMenu]
  }

  return finalMenu
}

export default cinemaNavigation
