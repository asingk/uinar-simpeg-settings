import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBriefcase,
  cilFingerprint,
  cilMoney,
  cilPeople,
  cilSitemap,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react-pro'
import { Translation } from 'react-i18next'

const _nav = [
  {
    component: CNavItem,
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info-gradient',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Pegawai')}</Translation>,
    to: '/pegawai',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Fakultas',
        to: '/pegawai/fakultas',
      },
      {
        component: CNavItem,
        name: 'Status Aktif',
        to: '/pegawai/status-aktif',
      },
    ],
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Kehadiran')}</Translation>,
    to: '/kehadiran',
    icon: <CIcon icon={cilFingerprint} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Jam Kerja',
        to: '/kehadiran/jam-kerja',
      },
      {
        component: CNavItem,
        name: 'Hari Libur',
        to: '/kehadiran/hari-libur',
      },
      {
        component: CNavItem,
        name: 'Ganti Hari Kerja',
        to: '/kehadiran/ganti-hari-kerja',
      },
      {
        component: CNavItem,
        name: 'Pemutihan',
        to: '/kehadiran/pemutihan',
      },
      {
        component: CNavItem,
        name: 'Hijriah',
        to: '/kehadiran/hijriah',
      },
    ],
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Jabatan')}</Translation>,
    to: '/jabatan',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Level Jabatan',
        to: '/jabatan/jabatan',
      },
      {
        component: CNavItem,
        name: 'Sublevel Jabatan',
        to: '/jabatan/sublevel',
      },
    ],
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Satuan Kerja')}</Translation>,
    to: '/satker',
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Unit Kerja',
        to: '/satker/uker',
      },
      {
        component: CNavItem,
        name: 'Bagian Unit Kerja',
        to: '/satker/bagian',
      },
      {
        component: CNavItem,
        name: 'Subbagian Unit Kerja',
        to: '/satker/subbag',
      },
      {
        component: CNavItem,
        name: 'Posisi',
        to: '/satker/posisi',
      },
    ],
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Keuangan')}</Translation>,
    to: '/keuangan',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Grade Remun',
        to: '/keuangan/grade-remun',
      },
      {
        component: CNavItem,
        name: 'Unit Gaji & Remun',
        to: '/keuangan/unit-gaji',
      },
      {
        component: CNavItem,
        name: 'Implementasi Remun',
        to: '/keuangan/implementasi-remun',
      },
      {
        component: CNavItem,
        name: 'Uang Makan',
        to: '/keuangan/uang-makan',
      },
      {
        component: CNavItem,
        name: 'Pajak',
        to: '/keuangan/pajak',
      },
    ],
  },
]

export default _nav
