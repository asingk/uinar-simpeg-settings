import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPaw, cilPencil, cilPlus } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import AddFakultasModal from 'src/components/pegawai/AddFakultasModal'
import EditFakultasModal from 'src/components/pegawai/EditFakultasModal'
import DeleteFakultasModal from 'src/components/pegawai/DeleteFakultasModal'

const GET_DAFTAR_FAKULTAS = gql`
  query DaftarFakultas {
    daftarFakultas {
      id
      nama
    }
  }
`

const Fakultas = () => {
  console.debug('rendering... Fakultas')

  const [id, setId] = useState('')
  const [nama, setNama] = useState('')
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const navigate = useNavigate()

  const { data, loading, error } = useQuery(GET_DAFTAR_FAKULTAS)

  const onDetail = (id) => {
    navigate('/pegawai/fakultas/' + id)
  }

  const editModalAction = (id, nama) => {
    setId(id)
    setNama(nama)
    setIsEdit(true)
  }

  const deleteModalAction = (id, nama) => {
    setId(id)
    setNama(nama)
    setIsDelete(true)
  }

  const columns = [
    {
      key: 'no',
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'kode',
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
  if (data?.daftarFakultas.length > 0) {
    data.daftarFakultas.forEach((row, idx) => {
      const item = {
        no: idx + 1,
        kode: row.id,
        nama: row.nama,
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton color="success" variant="outline" size="sm" onClick={() => onDetail(row.id)}>
              <CIcon icon={cilPaw} />
            </CButton>
            <CButton
              color="warning"
              variant="outline"
              size="sm"
              onClick={() => editModalAction(row.id, row.nama, row.ssoEnabled, row.isActive)}
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
      _cellProps: { id: { scope: 'row' }, no: { colSpan: 4 } },
    }
    items.push(item)
  }

  return (
    <>
      <h1 className="text-center">Fakultas</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <CButton color="primary" onClick={() => setIsAdd(true)} className="mb-3">
          <CIcon icon={cilPlus} /> Tambah
        </CButton>
      </div>
      {loading && (
        <div className="text-center">
          <CSpinner />
        </div>
      )}
      {error && <CAlert color="danger">Error: {error.message}</CAlert>}
      {data && <CTable striped responsive columns={columns} items={items} />}
      {isAdd && <AddFakultasModal visible={isAdd} setVisible={setIsAdd} />}
      {isEdit && (
        <EditFakultasModal
          id={id}
          setId={setId}
          nama={nama}
          setNama={setNama}
          visible={isEdit}
          setVisible={setIsEdit}
        />
      )}
      {isDelete && (
        <DeleteFakultasModal id={id} visible={isDelete} setVisible={setIsDelete} nama={nama} />
      )}
    </>
  )
}

export default Fakultas
