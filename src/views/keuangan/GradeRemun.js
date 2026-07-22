import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import EditGradeRemunModal from 'src/components/keuangan/EditGradeRemunModal'
import AddGradeRemunModal from 'src/components/keuangan/AddGradeRemunModal'
import DeleteGradeRemunModal from 'src/components/keuangan/DeleteGradeRemunModal'

const GET_DAFTAR_GRADE = gql`
  query DaftarGradeRemun {
    daftarGradeRemun {
      id
      grade
      p1
      p2
    }
  }
`

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
})

const GradeRemun = () => {
  console.debug('rendering... GradeRemun')

  const [isEdit, setIsEdit] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [id, setId] = useState()
  const [grade, setGrade] = useState()
  const [p1, setP1] = useState(null)
  const [p2, setP2] = useState(null)
  const [isDelete, setIsDelete] = useState(false)

  const { data, loading, error } = useQuery(GET_DAFTAR_GRADE)

  const editModalAction = (id, grade, p1, p2) => {
    setId(id)
    setGrade(grade)
    setP1(p1)
    setP2(p2)
    setIsEdit(true)
  }

  const deleteModalAction = (id, grade) => {
    setId(id)
    setGrade(grade)
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
      key: 'grade',
      _props: { scope: 'col' },
    },
    {
      key: 'p1',
      _props: { scope: 'col' },
    },
    {
      key: 'p2',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  let items = []
  if (data?.daftarGradeRemun.length > 0) {
    data?.daftarGradeRemun.forEach((row) => {
      const item = {
        grade: row.grade,
        p1: formatter.format(row.p1 ?? 0),
        p2: formatter.format(row.p2 ?? 0),
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="warning"
              variant="outline"
              size="sm"
              onClick={() => editModalAction(row.id, row.grade, row.p1, row.p2)}
            >
              <CIcon icon={cilPencil} />
            </CButton>
            <CButton
              color="danger"
              variant="outline"
              size="sm"
              className="me-md-2"
              onClick={() => deleteModalAction(row.id, row.grade)}
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
      <h1 className="text-center">Grade Remun</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah
        </CButton>
      </div>
      <CTable responsive striped columns={columns} items={items} />
      {isEdit && (
        <EditGradeRemunModal
          visible={isEdit}
          setVisible={setIsEdit}
          id={id}
          grade={grade}
          p1={p1}
          p2={p2}
        />
      )}
      {isAdd && <AddGradeRemunModal visible={isAdd} setVisible={setIsAdd} />}
      {isDelete && (
        <DeleteGradeRemunModal visible={isDelete} setVisible={setIsDelete} id={id} grade={grade} />
      )}
    </>
  )
}

export default GradeRemun
