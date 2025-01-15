import React, { useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import { gql, useQuery } from '@apollo/client'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import AddSublevelJabatanModal from 'src/components/jabatan/AddSublevelJabatanModal'
import EditSublevelJabatanModal from 'src/components/jabatan/EditSublevelJabatanModal'
import DeleteSublevelJabatanModal from 'src/components/jabatan/DeleteSublevelJabatanModal'

const GET_SUBLEVEL_JABATAN = gql`
  query DaftarSublevelJabatan {
    daftarSublevelJabatan {
      id
      nama
    }
  }
`

const SubLevelJabatan = () => {
  console.debug('rendering... SubLevelJabatan')

  const [isEdit, setIsEdit] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [idSublevel, setIdSublevel] = useState()
  const [namaSublevel, setNamaSublevel] = useState()

  const { data, loading, error } = useQuery(GET_SUBLEVEL_JABATAN)
  const editModalAction = (idSublevel, namaSubLevel, grade) => {
    setIdSublevel(idSublevel)
    setNamaSublevel(namaSubLevel)
    setIsEdit(true)
  }
  const deleteModalAction = (idSublevel, namaSublevel) => {
    setIdSublevel(idSublevel)
    setNamaSublevel(namaSublevel)
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
  if (data?.daftarSublevelJabatan.length > 0) {
    data.daftarSublevelJabatan.forEach((row, idx) => {
      const item = {
        no: idx + 1,
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
      _cellProps: { id: { scope: 'row' }, no: { colSpan: 3 } },
    }
    items.push(item)
  }

  return (
    <>
      <h1 className="text-center">Sublevel Jabatan</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah
        </CButton>
      </div>
      <CTable striped responsive columns={columns} items={items} />
      {isAdd && <AddSublevelJabatanModal visible={isAdd} setVisible={setIsAdd} />}
      {isEdit && (
        <EditSublevelJabatanModal
          id={idSublevel}
          nama={namaSublevel}
          visible={isEdit}
          setVisible={setIsEdit}
        />
      )}
      {isDelete && (
        <DeleteSublevelJabatanModal
          visible={isDelete}
          setVisible={setIsDelete}
          id={idSublevel}
          nama={namaSublevel}
        />
      )}
    </>
  )
}

export default SubLevelJabatan
