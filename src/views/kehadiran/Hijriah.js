import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import TambahHijriahModal from '../../components/kehadiran/TambahHijriahModal'
import UbahHijriahModal from '../../components/kehadiran/UbahHijriahModal'
import HapusHijriahModal from '../../components/kehadiran/HapusHijriahModal'
import dayjs from 'dayjs'

const Hijriah = () => {
  console.debug('rendering... Hijriah')

  const [data, setData] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [id, setId] = useState()
  const [tahun, setTahun] = useState()
  const [awalRamadhan, setAwalRamadhan] = useState()
  const [awalSyawal, setAwalSyawal] = useState()

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_KEHADIRAN_API_URL + '/hijriah')
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        setError(error)
      })
      .then(() => {
        setLoading(false)
      })
  }, [toggle])
  const onAdd = () => {
    setIsAdd(false)
    setToggle(!toggle)
  }
  function onEdit() {
    setIsEdit(false)
    setToggle(!toggle)
  }
  function onDelete() {
    setIsDelete(false)
    setToggle(!toggle)
  }
  const columns = [
    {
      key: 'tahun',
      _props: { scope: 'col' },
    },
    {
      key: 'awalRamadhan',
      _props: { scope: 'col' },
    },
    {
      key: 'awalSyawal',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  let items = []

  function editModalAction(id, tahun, awalRamadhan, awalSyawal) {
    setId(id)
    setTahun(tahun)
    setAwalRamadhan(awalRamadhan)
    setAwalSyawal(awalSyawal)
    setIsEdit(true)
  }

  function deleteModalAction(id, tahun) {
    setId(id)
    setTahun(tahun)
    setIsDelete(true)
  }

  if (data.length > 0) {
    data.forEach((row) => {
      const item = {
        tahun: row.tahun,
        awalRamadhan: dayjs(row.awalRamadhan).format('D/M/YYYY'),
        awalSyawal: dayjs(row.awalSyawal).format('D/M/YYYY'),
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="warning"
              variant="outline"
              size="sm"
              onClick={() => editModalAction(row.id, row.tahun, row.awalRamadhan, row.awalSyawal)}
            >
              <CIcon icon={cilPencil} size="sm" />
            </CButton>
            <CButton
              color="danger"
              variant="outline"
              size="sm"
              className="me-md-2"
              onClick={() => deleteModalAction(row.id, row.tahun)}
            >
              <CIcon icon={cilDelete} size="sm" />
            </CButton>
          </div>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    })
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
    <>
      <h1 className="text-center">Hijriah</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah Tahun Hijriah
        </CButton>
      </div>
      {table}
      {isAdd && <TambahHijriahModal visible={isAdd} setVisible={setIsAdd} added={onAdd} />}
      {isEdit && (
        <UbahHijriahModal
          id={id}
          tahun={tahun}
          awalRamadhan={awalRamadhan}
          awalSyawal={awalSyawal}
          visible={isEdit}
          setVisible={setIsEdit}
          edited={onEdit}
        />
      )}
      {isDelete && (
        <HapusHijriahModal
          id={id}
          visible={isDelete}
          setVisible={setIsDelete}
          tahun={tahun}
          deleted={onDelete}
        />
      )}
    </>
  )
}

export default Hijriah
