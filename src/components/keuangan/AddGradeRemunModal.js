import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'
import {
  CAlert,
  CButton,
  CFormInput,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'

const CREATE_GRADE_REMUN = gql`
  mutation CreateGradeRemun($grade: String!, $p1: Int!, $p2: Int!) {
    createGradeRemun(grade: $grade, p1: $p1, p2: $p2) {
      code
      success
      message
    }
  }
`

const AddGradeRemunModal = (props) => {
  const [grade, setGrade] = useState('')
  const [p1, setP1] = useState(null)
  const [p2, setP2] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_GRADE_REMUN)

  const addAction = async () => {
    try {
      await simpan({
        variables: {
          grade: grade,
          p1: p1,
          p2: p2,
        },
        refetchQueries: ['DaftarGradeRemun'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      setErrorMessage(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.createGradeRemun.success) {
        setErrorMessage(data.createGradeRemun.message)
      } else if (data?.createGradeRemun.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <>
      <CFormInput
        type="text"
        placeholder="Grade"
        aria-label="default input grade"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        className="mb-3"
      />
      <CFormInput
        type="number"
        placeholder="P1"
        aria-label="default input p1"
        value={p1 ?? ''}
        onChange={(e) => setP1(e.target.value === '' ? null : parseInt(e.target.value, 10))}
        className="mb-3"
      />
      <CFormInput
        type="number"
        placeholder="P2"
        aria-label="default input p2"
        value={p2 ?? ''}
        onChange={(e) => setP2(e.target.value === '' ? null : parseInt(e.target.value, 10))}
      />
      {error && (
        <CAlert className="mt-3" color="danger">
          Error: {error.message}
        </CAlert>
      )}
      {errorMessage && (
        <CAlert className="mt-3" color="danger">
          Error: {errorMessage}
        </CAlert>
      )}
    </>
  )
  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Grade Remun</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={addAction}>
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

AddGradeRemunModal.propTypes = {
  added: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddGradeRemunModal
