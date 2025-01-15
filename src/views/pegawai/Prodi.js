import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { CAlert, CButton, CCol, CRow, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilArrowThickLeft, cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import AddProdiModal from 'src/components/pegawai/AddProdiModal'
import EditProdiModal from 'src/components/pegawai/EditProdiModal'
import DeleteProdiModal from 'src/components/pegawai/DeleteProdiModal'

const GET_FAKULTAS = gql`
  query Fakultas($id: ID!) {
    fakultas(id: $id) {
      id
      nama
      prodi {
        id
        nama
      }
    }
  }
`

const Prodi = () => {
  console.debug('rendering... Prodi')

  const [idProdi, setIdProdi] = useState(0)
  const [nama, setNama] = useState('')
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const { id } = useParams()

  const navigate = useNavigate()

  const { data, loading, error } = useQuery(GET_FAKULTAS, { variables: { id: id } })

  const editModalAction = (id, nama) => {
    setIdProdi(id)
    setNama(nama)
    setIsEdit(true)
  }

  const deleteModalAction = (id, nama) => {
    setIdProdi(id)
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
  if (data?.fakultas?.prodi.length > 0) {
    data.fakultas.prodi.forEach((row, idx) => {
      const item = {
        no: idx + 1,
        nama: row.nama,
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
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
      _cellProps: { id: { scope: 'row' }, no: { colSpan: 3 } },
    }
    items.push(item)
  }

  return (
    <>
      <h1 className="text-center">Program Studi</h1>
      <h1 className="text-center">Fakultas {data?.fakultas.nama}</h1>
      <CRow className="justify-content-between mb-3">
        <CCol xs="auto">
          <CButton color="secondary" onClick={() => navigate('/pegawai/fakultas')}>
            <CIcon icon={cilArrowThickLeft} />
          </CButton>
        </CCol>
        <CCol xs="auto">
          <CButton color="primary" onClick={() => setIsAdd(true)}>
            <CIcon icon={cilPlus} />
          </CButton>
        </CCol>
      </CRow>
      {loading && (
        <div className="text-center">
          <CSpinner />
        </div>
      )}
      {error && <CAlert color="danger">Error: {error.message}</CAlert>}
      {data && <CTable striped responsive columns={columns} items={items} />}
      {isAdd && <AddProdiModal visible={isAdd} setVisible={setIsAdd} fakultasId={id} />}
      {isEdit && (
        <EditProdiModal
          id={idProdi}
          setId={setIdProdi}
          nama={nama}
          setNama={setNama}
          visible={isEdit}
          setVisible={setIsEdit}
        />
      )}
      {isDelete && (
        <DeleteProdiModal id={idProdi} visible={isDelete} setVisible={setIsDelete} nama={nama} />
      )}
    </>
  )
}

export default Prodi
