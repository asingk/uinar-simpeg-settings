import React, { useEffect, useState } from 'react'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import axios from 'axios'
import EditUangMakanModal from 'src/components/keuangan/EditUangMakanModal'

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
})

const UangMakan = () => {
  console.debug('rendering... UangMakan')

  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [toggle, setToggle] = useState(false)
  const [id, setId] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [jumlah, setJumlah] = useState(0)
  const [golongan, setGolongan] = useState('')

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_KEHADIRAN_API_URL + '/uang-makan')
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

  const onEdit = (id, jumlah, golongan) => {
    setId(id)
    setJumlah(jumlah)
    setGolongan(golongan)
    setIsEdit(true)
  }

  const onEdited = () => {
    setIsEdit(false)
    setToggle(!toggle)
  }

  const columns = [
    {
      key: 'golonganRuang',
      _props: { scope: 'col' },
    },
    {
      key: 'jumlah',
      label: 'Jumlah Harian',
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
        golonganRuang: row.golongan,
        jumlah: formatter.format(row.jumlah),
        action: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="warning"
              variant="outline"
              size="sm"
              onClick={() => onEdit(row.id, row.jumlah, row.golongan)}
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
      _cellProps: { id: { scope: 'row' }, tanggal: { colSpan: 3 } },
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
    table = <CTable responsive striped columns={columns} items={items} className="mb-4 mt-2" />
  }

  return (
    <div className="mb-4">
      <h1 className="text-center mb-3">Uang Makan</h1>
      {table}
      {isEdit && (
        <EditUangMakanModal
          visible={isEdit}
          setVisible={setIsEdit}
          id={id}
          jumlah={jumlah}
          setJumlah={setJumlah}
          golongan={golongan}
          done={onEdited}
        />
      )}
    </div>
  )
}

export default UangMakan
