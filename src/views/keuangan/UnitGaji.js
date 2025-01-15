import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import AddUnitGajiModal from 'src/components/keuangan/AddUnitGajiModal'
import EditUnitGajiModal from 'src/components/keuangan/EditUnitGajiiModal'
import DeleteUnitGajiiModal from 'src/components/keuangan/DeleteUnitGajiModal'

const GET_DAFTAR_UNIT_GAJI = gql`
  query DaftarUnitGaji {
    daftarUnitGaji {
      id
      nama
    }
  }
`

const UnitGaji = () => {
  console.debug('rendering... UnitGaji')

  const [id, setId] = useState('')
  const [nama, setNama] = useState('')
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const { data, loading, error } = useQuery(GET_DAFTAR_UNIT_GAJI)

  const editModalAction = (id, nama) => {
    setId(id)
    setNama(nama)
    setIsEdit(true)
  }

  const deleteModalAction = (id) => {
    setId(id)
    setIsDelete(true)
  }

  const columns = [
    {
      key: 'no',
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'id',
      label: 'Kode',
      _props: { scope: 'col' },
    },
    {
      key: 'nama',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  let items = []
  if (data?.daftarUnitGaji.length > 0) {
    data.daftarUnitGaji.forEach((row, idx) => {
      const item = {
        no: idx + 1,
        id: row.id,
        nama: row.nama,
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="warning"
              variant="outline"
              size="sm"
              onClick={() => editModalAction(row.id, row.nama)}
            >
              <CIcon icon={cilPencil} />
            </CButton>
            <CButton
              color="danger"
              variant="outline"
              size="sm"
              className="me-md-2"
              onClick={() => deleteModalAction(row.id)}
            >
              <CIcon icon={cilDelete} />
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

  return (
    <>
      <h1 className="text-center">Unit Gaji & Remun</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah
        </CButton>
      </div>
      {loading && (
        <div className="text-center">
          <CSpinner />
        </div>
      )}
      {error && <CAlert color="danger">Error: {error.message}</CAlert>}
      {data && <CTable responsive striped columns={columns} items={items} />}
      {isAdd && <AddUnitGajiModal visible={isAdd} setVisible={setIsAdd} />}
      {isEdit && <EditUnitGajiModal id={id} nama={nama} visible={isEdit} setVisible={setIsEdit} />}
      {isDelete && <DeleteUnitGajiiModal id={id} visible={isDelete} setVisible={setIsDelete} />}
    </>
  )
}

export default UnitGaji
