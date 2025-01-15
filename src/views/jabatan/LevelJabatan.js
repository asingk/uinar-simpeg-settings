import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import CIcon from '@coreui/icons-react'
import { cilArrowThickLeft, cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { CAlert, CButton, CCol, CRow, CSpinner, CTable } from '@coreui/react-pro'
import EditLevelJabatanModal from 'src/components/jabatan/EditLevelJabatanModal'
import AddLevelJabatanModal from 'src/components/jabatan/AddLevelJabatanModal'
import DeleteLevelJabatanModal from 'src/components/jabatan/DeleteLevelJabatanModal'

const GET_LEVEL_JABATAN = gql`
  query Jabatan($id: ID!) {
    jabatan(id: $id) {
      nama
      level {
        id
        nama
        ssoRole {
          code
          description
        }
      }
    }
  }
`

const LevelJabatan = () => {
  console.debug('rendering... LevelJabatan')

  const [isEdit, setIsEdit] = useState(false)
  const [idLevel, setIdLevel] = useState('')
  const [namaLevel, setNamaLevel] = useState('')
  const [ssoRole, setSsoRole] = useState('')
  const [isAdd, setIsAdd] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()

  const { data, loading, error } = useQuery(GET_LEVEL_JABATAN, {
    variables: { id: id },
  })

  const editModalAction = (idLevel, nama, ssoRole) => {
    setIdLevel(idLevel)
    setNamaLevel(nama)
    setSsoRole(ssoRole)
    setIsEdit(true)
  }
  const deleteModalAction = (idLevel, namaLevel) => {
    setIdLevel(idLevel)
    setNamaLevel(namaLevel)
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
    return (
      <CAlert className="w-100" color="danger">
        Error: {error.message}
      </CAlert>
    )
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
      key: 'roleSso',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  let items = []
  if (data?.jabatan.level.length > 0) {
    data.jabatan.level.forEach((row, idx) => {
      const item = {
        no: idx + 1,
        nama: row.nama,
        roleSso: row.ssoRole.description,
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="warning"
              variant="outline"
              size="sm"
              onClick={() => editModalAction(row.id, row.nama, row.ssoRole.code)}
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
      <h1 className="text-center">{data?.jabatan.nama}</h1>
      <CRow className="justify-content-between mb-3">
        <CCol xs="auto">
          <CButton color="secondary" onClick={() => navigate('/jabatan')}>
            <CIcon icon={cilArrowThickLeft} />
          </CButton>
        </CCol>
        <CCol xs="auto">
          <CButton color="primary" onClick={() => setIsAdd(true)}>
            <CIcon icon={cilPlus} />
          </CButton>
        </CCol>
      </CRow>
      <CTable striped responsive columns={columns} items={items} />
      {isEdit && (
        <EditLevelJabatanModal
          visible={isEdit}
          setVisible={setIsEdit}
          id={idLevel}
          nama={namaLevel}
          ssoRole={ssoRole}
        />
      )}
      {isAdd && (
        <AddLevelJabatanModal
          visible={isAdd}
          setVisible={setIsAdd}
          jabatanId={id}
          namaJabatan={data?.jabatan.nama}
        />
      )}
      {isDelete && (
        <DeleteLevelJabatanModal
          visible={isDelete}
          setVisible={setIsDelete}
          id={idLevel}
          nama={namaLevel}
        />
      )}
    </>
  )
}

export default LevelJabatan
