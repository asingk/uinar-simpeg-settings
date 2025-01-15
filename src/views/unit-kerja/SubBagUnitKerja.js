import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import AddSubBagUnitKerjaModal from 'src/components/unit-kerja/AddSubBagUnitKerjaModal'
import EditSubBagUnitKerjaModal from 'src/components/unit-kerja/EditSubBagUnitKerjaModal'
import DeleteSubBagUnitKerjaModal from 'src/components/unit-kerja/DeleteSubBagUnitKerjaModal'

const GET_BAG_UKER = gql`
  query DaftarSubbagUnitKerja {
    daftarSubbagUnitKerja {
      id
      nama
    }
  }
`

const SubBagUnitKerja = () => {
  console.debug('rendering... SubBagUnitKerja')

  const [isEdit, setIsEdit] = useState(false)
  const [idSubBag, setIdSubBag] = useState()
  const [namaSubBag, setNamaSubBag] = useState()
  const [isAdd, setIsAdd] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const { data, loading, error } = useQuery(GET_BAG_UKER)

  const editModalAction = (id, nama) => {
    setIdSubBag(id)
    setNamaSubBag(nama)
    setIsEdit(true)
  }
  const deleteModalAction = (id, nama) => {
    setIdSubBag(id)
    setNamaSubBag(nama)
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
  if (data?.daftarSubbagUnitKerja.length > 0) {
    data.daftarSubbagUnitKerja.forEach((row, idx) => {
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
      <h1 className="text-center">Subbagian Unit Kerja</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah
        </CButton>
      </div>
      <CTable striped responsive columns={columns} items={items} />
      {isAdd && <AddSubBagUnitKerjaModal visible={isAdd} setVisible={setIsAdd} />}
      {isEdit && (
        <EditSubBagUnitKerjaModal
          visible={isEdit}
          setVisible={setIsEdit}
          id={idSubBag}
          nama={namaSubBag}
        />
      )}
      {isDelete && (
        <DeleteSubBagUnitKerjaModal
          visible={isDelete}
          setVisible={setIsDelete}
          id={idSubBag}
          nama={namaSubBag}
        />
      )}
    </>
  )
}

export default SubBagUnitKerja
