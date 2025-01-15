import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import EditPosisiModal from 'src/components/unit-kerja/EditPosisiModal'
import AddPosisiModal from 'src/components/unit-kerja/AddPosisiModal'
import DeletePosisiModal from 'src/components/unit-kerja/DeletePosisiModal'

const GET_POSISI = gql`
  query DaftarPosisi {
    daftarPosisi {
      id
      nama
    }
  }
`

const Posisi = () => {
  console.debug('rendering... Posisi')

  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState('')
  const [nama, setNama] = useState('')
  const [isAdd, setIsAdd] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const { data, loading, error } = useQuery(GET_POSISI)

  const editModalAction = (id, nama) => {
    setId(id)
    setNama(nama)
    setIsEdit(true)
  }

  const deleteModalAction = (id) => {
    setId(id)
    setIsDelete(true)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    return <CAlert color="danger">Error: {error.message}</CAlert>
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
  if (data?.daftarPosisi.length > 0) {
    data.daftarPosisi.forEach((row, idx) => {
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
      <h1 className="text-center">Posisi Unit Kerja</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah
        </CButton>
      </div>
      <CTable responsive striped columns={columns} items={items} />
      {isEdit && <EditPosisiModal visible={isEdit} setVisible={setIsEdit} id={id} nama={nama} />}
      {isAdd && <AddPosisiModal visible={isAdd} setVisible={setIsAdd} />}
      {isDelete && <DeletePosisiModal visible={isDelete} setVisible={setIsDelete} id={id} />}
    </>
  )
}

export default Posisi
