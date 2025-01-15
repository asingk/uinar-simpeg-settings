import React from 'react'
import { Translation } from 'react-i18next'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const JamKerja = React.lazy(() => import('./views/kehadiran/JamKerja'))
const HariLibur = React.lazy(() => import('./views/kehadiran/HariLibur'))
const GantiHariKerja = React.lazy(() => import('./views/kehadiran/GantiHariKerja'))
const Pemutihan = React.lazy(() => import('./views/kehadiran/Pemutihan'))
const Hijriah = React.lazy(() => import('./views/kehadiran/Hijriah'))
const Jabatan = React.lazy(() => import('./views/jabatan/Jabatan'))
const LevelJabatan = React.lazy(() => import('./views/jabatan/LevelJabatan'))
const SubLevelJabatan = React.lazy(() => import('./views/jabatan/SubLevelJabatan'))
const Posisi = React.lazy(() => import('./views/unit-kerja/Posisi'))
const UnitKerja = React.lazy(() => import('./views/unit-kerja/UnitKerja'))
const BagUker = React.lazy(() => import('./views/unit-kerja/BagUnitKerja'))
const SubbagUker = React.lazy(() => import('./views/unit-kerja/SubBagUnitKerja'))
const GradeRemun = React.lazy(() => import('./views/keuangan/GradeRemun'))
const UnitGaji = React.lazy(() => import('./views/keuangan/UnitGaji'))
const ImplementasiRemun = React.lazy(() => import('./views/keuangan/ImplementasiRemun'))
const Pajak = React.lazy(() => import('./views/keuangan/Pajak'))
const UangMakan = React.lazy(() => import('./views/keuangan/UangMakan'))
const Fakultas = React.lazy(() => import('./views/pegawai/Fakultas'))
const Prodi = React.lazy(() => import('./views/pegawai/Prodi'))
const StatusAktif = React.lazy(() => import('./views/pegawai/StatusAktif'))

const routes = [
  { path: '/', exact: true, name: <Translation>{(t) => t('Home')}</Translation> },
  {
    path: '/dashboard',
    name: <Translation>{(t) => t('Dashboard')}</Translation>,
    element: Dashboard,
  },
  {
    path: '/pegawai',
    name: <Translation>{(t) => t('Pegawai')}</Translation>,
    element: Fakultas,
    exact: true,
  },
  { path: '/pegawai/fakultas', name: 'Fakultas', element: Fakultas },
  {
    path: '/pegawai/fakultas/:id',
    name: 'Prodi',
    element: Prodi,
    exact: true,
  },
  { path: '/pegawai/status-aktif', name: 'Status Aktif', element: StatusAktif },
  {
    path: '/kehadiran',
    name: <Translation>{(t) => t('Kehadiran')}</Translation>,
    element: JamKerja,
    exact: true,
  },
  { path: '/kehadiran/jam-kerja', name: 'Jam Kerja', element: JamKerja },
  { path: '/kehadiran/hari-libur', name: 'Hari Libur', element: HariLibur },
  { path: '/kehadiran/ganti-hari-kerja', name: 'Ganti Hari Kerja', element: GantiHariKerja },
  { path: '/kehadiran/pemutihan', name: 'Pemutihan', element: Pemutihan },
  { path: '/kehadiran/hijriah', name: 'Hijriah', element: Hijriah },
  {
    path: '/jabatan',
    name: <Translation>{(t) => t('Jabatan')}</Translation>,
    element: Jabatan,
    exact: true,
  },
  { path: '/jabatan/jabatan', name: 'Jabatan', element: Jabatan },
  { path: '/jabatan/:id', name: 'Level Jabatan', element: LevelJabatan },
  { path: '/jabatan/sublevel', name: 'Sublevel Jabatan', element: SubLevelJabatan },
  {
    path: '/satker',
    name: <Translation>{(t) => t('Satuan Kerja')}</Translation>,
    element: UnitKerja,
    exact: true,
  },
  { path: '/satker/posisi', name: 'Posisi', element: Posisi },
  { path: '/satker/uker', name: 'Unit Kerja', element: UnitKerja },
  { path: '/satker/bagian', name: 'Bagian Unit Kerja', element: BagUker },
  { path: '/satker/subbag', name: 'Subbagian Unit Kerja', element: SubbagUker },
  {
    path: '/keuangan',
    name: <Translation>{(t) => t('Keuangan')}</Translation>,
    element: UnitGaji,
    exact: true,
  },
  { path: '/keuangan/grade-remun', name: 'Grade Remun', element: GradeRemun },
  { path: '/keuangan/unit-gaji', name: 'Unit Gaji', element: UnitGaji },
  { path: '/keuangan/implementasi-remun', name: 'Implementasi Remun', element: ImplementasiRemun },
  { path: '/keuangan/uang-makan', name: 'Uang Makan', element: UangMakan },
  { path: '/keuangan/pajak', name: 'Pajak', element: Pajak },
]

export default routes
