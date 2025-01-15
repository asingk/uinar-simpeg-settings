import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import AddUnitKerjaModal from 'src/components/unit-kerja/AddUnitKerjaModal'
import EditUnitKerjaModal from 'src/components/unit-kerja/EditUnitKerjaModal'
import DeleteUnitKerjaModal from 'src/components/unit-kerja/DeleteUnitKerjaModal'

const GET_UNIT_KERJA = gql`
  query DaftarUnitKerja {
    daftarUnitKerja {
      id
      nama
    }
  }
`

const UnitKerja = () => {
  console.debug('rendering... UnitKerja')

  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [id, setId] = useState()
  const [nama, setNama] = useState()

  const { data, loading, error } = useQuery(GET_UNIT_KERJA)
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
  if (data?.daftarUnitKerja.length > 0) {
    data.daftarUnitKerja.forEach((row, idx) => {
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
              onClick={() => deleteModalAction(row.id, row.nama)}
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
      <h1 className="text-center">Unit Kerja</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah
        </CButton>
      </div>
      <CTable striped responsive columns={columns} items={items} />
      {isAdd && (
        <AddUnitKerjaModal visible={isAdd} setVisible={setIsAdd} added={() => setIsAdd(false)} />
      )}
      {isEdit && <EditUnitKerjaModal visible={isEdit} setVisible={setIsEdit} id={id} nama={nama} />}
      {isDelete && <DeleteUnitKerjaModal visible={isDelete} setVisible={setIsDelete} id={id} />}
    </>
  )
}

export default UnitKerja
