import React from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import CIcon from '@coreui/icons-react'
import { cilPaw } from '@coreui/icons'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'

const GET_DAFTAR_JABATAN = gql`
  query DaftarJabatan {
    daftarJabatan {
      id
      nama
    }
  }
`

const Jabatan = () => {
  console.debug('rendering... Jabatan')

  const navigate = useNavigate()

  const { data, loading, error } = useQuery(GET_DAFTAR_JABATAN)
  const onDetail = (id) => {
    navigate('/jabatan/' + id)
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
  if (data?.daftarJabatan.length > 0) {
    data.daftarJabatan.forEach((row, idx) => {
      const item = {
        no: idx + 1,
        nama: row.nama,
        aksi: (
          <CButton color="success" variant="outline" onClick={() => onDetail(row.id)}>
            <CIcon icon={cilPaw} />
          </CButton>
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
      <h1 className="text-center">Jabatan</h1>
      <CTable striped responsive columns={columns} items={items} />
    </>
  )
}

export default Jabatan
