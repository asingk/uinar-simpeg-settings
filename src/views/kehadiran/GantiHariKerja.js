import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPlus } from '@coreui/icons'
import dayjs from 'dayjs'
import { CAlert, CButton, CCol, CRow, CSpinner, CTable } from '@coreui/react-pro'
import SelectTahun from '../../components/kehadiran/SelectTahun'
import HapusgantiHariLiburModal from '../../components/kehadiran/HapusGantiHariLiburModal'
import TambahGantiHariKerjaModal from 'src/components/kehadiran/TambahGantiHariKerjaModal'

const GantiHariKerja = () => {
  console.debug('rendering... GantiHariKerja')

  const date = new Date()

  const [id, setId] = useState()
  const [tahun, setTahun] = useState(date.getFullYear())
  const [toggle, setToggle] = useState(false)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [isOpenHapusModal, setIsOpenHapusModal] = useState(false)
  const [isOpenTambahModal, setIsOpenTambahModal] = useState(false)
  const [tanggal, setTanggal] = useState()
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    setTahun(new Date().getFullYear())
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(false)
    setErrorMessage()
    if (tahun) {
      fetch(import.meta.env.VITE_KEHADIRAN_API_URL + '/hari-libur-tapi-kerja?tahun=' + tahun)
        .then((response) => response.json())
        .then(
          (data) => {
            setLoading(false)
            setData(data)
          },
          (error) => {
            setLoading(false)
            setError(error)
          },
        )
    }
  }, [tahun, toggle])

  const showHapusModal = (id, tanggal) => {
    setIsOpenHapusModal(true)
    setTanggal(tanggal)
    setId(id)
  }

  const onDelete = () => {
    setIsOpenHapusModal(false)
    setToggle(!toggle)
  }

  const onAdd = () => {
    setIsOpenTambahModal(false)
    setToggle(!toggle)
  }

  let table

  const columns = [
    {
      key: 'tanggal',
      label: 'Tanggal',
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
    data.forEach((row) => {
      const item = {
        tanggal: dayjs(row.tanggal).format('D/M/YYYY'),
        aksi: (
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={(e) => showHapusModal(row.id, row.tanggal)}
          >
            <CIcon icon={cilDelete} size="sm" />
          </CButton>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    })
  } else {
    const item = {
      tanggal: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, tanggal: { colSpan: 2 } },
    }
    items.push(item)
  }

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
    table = <CTable striped columns={columns} items={items} className="mb-4 mt-2" />
  }

  return (
    <>
      <CRow className="justify-content-md-center">
        <CCol md="2" className="mb-3">
          <SelectTahun
            setSelect={(id) => setTahun(id)}
            end={2020}
            start={date.getFullYear() + 1}
            tahun={tahun}
          />
        </CCol>
      </CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <CButton color="primary" onClick={() => setIsOpenTambahModal(true)}>
          <CIcon icon={cilPlus}></CIcon> Tambah Hari
        </CButton>
      </div>
      <CRow className="justify-content-md-center">
        {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
        {table}
        {isOpenHapusModal && (
          <HapusgantiHariLiburModal
            id={id}
            visible={isOpenHapusModal}
            setVisible={setIsOpenHapusModal}
            tanggal={tanggal}
            close={() => setIsOpenHapusModal(false)}
            deleted={onDelete}
          />
        )}
        {isOpenTambahModal && (
          <TambahGantiHariKerjaModal
            id={id}
            visible={isOpenTambahModal}
            setVisible={setIsOpenTambahModal}
            tanggal={tanggal}
            close={() => setIsOpenTambahModal(false)}
            added={onAdd}
          />
        )}
      </CRow>
    </>
  )
}

export default GantiHariKerja
