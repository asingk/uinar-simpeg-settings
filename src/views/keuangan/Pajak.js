import React, { useEffect, useState } from 'react'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import axios from 'axios'
import EditPajakModal from 'src/components/keuangan/EditPajakModal'

const Pajak = () => {
  console.debug('rendering... Pajak')

  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [toggle, setToggle] = useState(false)
  const [id, setId] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [persen, setPersen] = useState(0)

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_KEHADIRAN_API_URL + '/pajak')
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [toggle])

  const onEdit = (id, persen) => {
    setId(id)
    setPersen(persen)
    setIsEdit(true)
  }

  const onEdited = () => {
    setIsEdit(false)
    setToggle(!toggle)
  }

  const columns = [
    {
      key: 'statusPegawai',
      _props: { scope: 'col' },
    },
    {
      key: 'golonganRuang',
      _props: { scope: 'col' },
    },
    {
      key: 'persentase',
      label: 'Persentase (%)',
      _props: { scope: 'col' },
    },
    {
      key: 'action',
      label: '',
      _props: { scope: 'col' },
    },
  ]
  let items = []
  if (data) {
    data.forEach((row) => {
      const item = {
        statusPegawai: row.statusPegawaiNama || '-',
        golonganRuang: row.golongan || '-',
        persentase: row.persen,
        action: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="warning"
              variant="outline"
              size="sm"
              onClick={() => onEdit(row.id, row.persen)}
            >
              <CIcon icon={cilPencil} />
            </CButton>
          </div>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    })
  } else {
    const item = {
      tanggal: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, tanggal: { colSpan: 4 } },
    }
    items.push(item)
  }

  let table

  if (loading) {
    table = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    table = <CAlert color="danger">Error: {error}</CAlert>
  } else {
    table = <CTable striped columns={columns} items={items} className="mb-4 mt-2" />
  }

  return (
    <div className="mb-4">
      <h1 className="text-center mb-3">Pajak</h1>
      {table}
      {isEdit && (
        <EditPajakModal
          visible={isEdit}
          setVisible={setIsEdit}
          id={id}
          persen={persen}
          setPersen={setPersen}
          done={onEdited}
        />
      )}
    </div>
  )
}

export default Pajak
