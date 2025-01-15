import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import AddBagUnitKerjaModal from 'src/components/unit-kerja/AddBagUnitKerjaModal'
import EditBagUnitKerjaModal from 'src/components/unit-kerja/EditBagUnitKerjaModal'
import DeleteBagUnitKerjaModal from 'src/components/unit-kerja/DeleteBagUnitKerjaModal'

const GET_BAG_UKER = gql`
  query DaftarBagianUnitKerja {
    daftarBagianUnitKerja {
      id
      nama
    }
  }
`

const BagUnitKerja = () => {
  console.debug('rendering... BagUnitKerja')

  const [isEdit, setIsEdit] = useState(false)
  const [idBag, setIdBag] = useState()
  const [namaBag, setNamaBag] = useState()
  const [isAdd, setIsAdd] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const { data, loading, error } = useQuery(GET_BAG_UKER)

  const editModalAction = (id, nama) => {
    setIdBag(id)
    setNamaBag(nama)
    setIsEdit(true)
  }
  const deleteModalAction = (id, nama) => {
    setIdBag(id)
    setNamaBag(nama)
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
  if (data?.daftarBagianUnitKerja.length > 0) {
    data.daftarBagianUnitKerja.forEach((row, idx) => {
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
      <h1 className="text-center">Bagian Unit Kerja</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah
        </CButton>
      </div>
      <CTable responsive striped columns={columns} items={items} />
      {isAdd && <AddBagUnitKerjaModal visible={isAdd} setVisible={setIsAdd} />}
      {isEdit && (
        <EditBagUnitKerjaModal visible={isEdit} setVisible={setIsEdit} id={idBag} nama={namaBag} />
      )}
      {isDelete && (
        <DeleteBagUnitKerjaModal
          visible={isDelete}
          setVisible={setIsDelete}
          id={idBag}
          nama={namaBag}
        />
      )}
    </>
  )
}

export default BagUnitKerja
