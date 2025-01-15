import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import AddStatusAktifModal from 'src/components/pegawai/AddStatusAktifModal'
import EditStatusAktifModal from 'src/components/pegawai/EditStatusAktifModal'
import DeleteStatusAktifModal from 'src/components/pegawai/DeleteStatusAktifModal'

const GET_DAFTAR_STATUS_AKTIF = gql`
  query DaftarStatusAktif {
    daftarStatusAktif {
      id
      nama
      ssoEnabled
      isActive
    }
  }
`

const StatusAktif = () => {
  console.debug('rendering... StatusAktif')

  const [id, setId] = useState(0)
  const [nama, setNama] = useState('')
  const [ssoEnabled, setSsoEnabled] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const { data, loading, error } = useQuery(GET_DAFTAR_STATUS_AKTIF)

  const editModalAction = (id, nama, ssoEnabled, isActive) => {
    setId(id)
    setNama(nama)
    setSsoEnabled(ssoEnabled)
    setIsActive(isActive)
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
      key: 'nama',
      _props: { scope: 'col' },
    },
    {
      key: 'sso',
      label: 'SSO',
      _props: { scope: 'col' },
    },
    {
      key: 'aktif',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  let items = []
  if (data?.daftarStatusAktif.length > 0) {
    data.daftarStatusAktif.forEach((row, idx) => {
      const item = {
        no: idx + 1,
        nama: row.nama,
        sso: row.ssoEnabled ? 'Enable' : 'Disable',
        aktif: row.isActive ? 'Ya' : 'Tidak',
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
      _cellProps: { id: { scope: 'row' }, no: { colSpan: 5 } },
    }
    items.push(item)
  }

  return (
    <>
      <h1 className="text-center">Status Aktif</h1>
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
      {isAdd && <AddStatusAktifModal visible={isAdd} setVisible={setIsAdd} />}
      {isEdit && (
        <EditStatusAktifModal
          id={id}
          setId={setId}
          nama={nama}
          setNama={setNama}
          visible={isEdit}
          setVisible={setIsEdit}
          isActive={isActive}
          setIsActive={setIsActive}
          ssoEnabled={ssoEnabled}
          setSsoEnabled={setSsoEnabled}
        />
      )}
      {isDelete && (
        <DeleteStatusAktifModal id={id} visible={isDelete} setVisible={setIsDelete} nama={nama} />
      )}
    </>
  )
}

export default StatusAktif
