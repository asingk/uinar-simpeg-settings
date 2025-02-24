import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'

import { cilDelete, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import HapusPemutihanModal from 'src/components/kehadiran/HapusPemutihanModal'
import { CAlert, CButton, CCol, CSpinner, CTable } from '@coreui/react-pro'
import SelectBulanTahun from '../../components/kehadiran/SelectBulanTahun'
import dayjs from 'dayjs'
import TambahPemutihanModal from 'src/components/kehadiran/TambahPemutihanModal'
import { KeycloakContext } from 'src/context'

const Pemutihan = () => {
  console.debug('rendering... Pemutihan')

  const [id, setId] = useState()
  const [bulan, setBulan] = useState()
  const [tahun, setTahun] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [tanggal, setTanggal] = useState()
  const [isOpenHapusModal, setIsOpenHapusModal] = useState(false)
  const [isOpenTambahModal, setIsOpenTambahModal] = useState(false)
  const [status, setStatus] = useState()
  const [toggle, setToggle] = useState(false)

  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    const date = new Date()
    setTahun(date.getFullYear())
    setBulan(date.getMonth() + 1)
  }, [])

  useEffect(() => {
    setLoading(true)
    if (tahun && bulan) {
      axios
        .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/pemutihan`, {
          params: {
            tahun,
            bulan,
          },
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        })
        .then((response) => {
          setData(response.data.pemutihan)
        })
        .catch((error) => {
          setError(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [bulan, tahun, toggle])

  const showHapusModal = (id, tanggal, status) => {
    setIsOpenHapusModal(true)
    setTanggal(tanggal)
    setId(id)
    setStatus(status)
  }

  const onChangeBulan = (bulan, tahun) => {
    setBulan(bulan)
    setTahun(tahun)
  }

  const onDelete = () => {
    setIsOpenHapusModal(false)
    setToggle(!toggle)
  }

  const onAdd = () => {
    setIsOpenTambahModal(false)
    setToggle(!toggle)
  }

  const columns = [
    {
      key: 'no',
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'tanggal',
      label: 'Tanggal',
      _props: { scope: 'col' },
    },
    {
      key: 'ket',
      label: 'Status',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  let items = []

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = {
        no: i + 1,
        tanggal: dayjs(data[i].tanggal).format('D/M/YYYY'),
        ket: data[i].status,
        aksi: (
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={() => showHapusModal(data[i].id, data[i].tanggal, data[i].status)}
          >
            <CIcon icon={cilDelete} size="sm" />
          </CButton>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    }
  } else {
    const item = {
      no: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, no: { colSpan: 4 } },
    }
    items.push(item)
  }

  let table

  if (loading) {
    table = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    table = <CAlert color="danger">Error: {error}</CAlert>
  } else {
    table = <CTable responsive striped columns={columns} items={items} className="mb-4 mt-2" />
  }

  return (
    <div className="mb-4">
      <h1 className="text-center mb-3">Melihat Daftar Pemutihan</h1>
      <div className="row justify-content-md-center mb-3">
        <CCol lg={3}>
          <SelectBulanTahun setSelect={(bulan, tahun) => onChangeBulan(bulan, tahun)} />
        </CCol>
      </div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsOpenTambahModal(true)}>
          <CIcon icon={cilPlus}></CIcon> Tambah Pemutihan
        </CButton>
      </div>
      {table}
      {isOpenHapusModal && (
        <HapusPemutihanModal
          id={id}
          visible={isOpenHapusModal}
          setVisible={setIsOpenHapusModal}
          status={status}
          tanggal={tanggal}
          deleted={onDelete}
        />
      )}
      {isOpenTambahModal && (
        <TambahPemutihanModal
          visible={isOpenTambahModal}
          setVisible={setIsOpenTambahModal}
          added={onAdd}
          bulan={Number(bulan)}
          tahun={tahun}
        />
      )}
    </div>
  )
}

export default Pemutihan
