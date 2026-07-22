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

const UPDATE_GRADE_REMUN = gql`
  mutation UpdateGradeRemun($id: ID!, $p1: Int!, $p2: Int!) {
    updateGradeRemun(id: $id, p1: $p1, p2: $p2) {
      code
      success
      message
    }
  }
`

const EditGradeRemunModal = (props) => {
  const [p1, setP1] = useState(props.p1)
  const [p2, setP2] = useState(props.p2)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(UPDATE_GRADE_REMUN)

  const editAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
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

  let modalBody = (
    <>
      <h5 className="text-center">Grade {props.grade}</h5>
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

  useEffect(() => {
    if (data) {
      if (!data?.updateGradeRemun.success) {
        setErrorMessage(data.updateGradeRemun.message)
      } else if (data?.updateGradeRemun.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Ubah Grade Remun</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={editAction}>
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

EditGradeRemunModal.propTypes = {
  id: PropTypes.string.isRequired,
  grade: PropTypes.string.isRequired,
  p1: PropTypes.number,
  p2: PropTypes.number,
  edited: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default EditGradeRemunModal
