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
  mutation UpdateGradeRemun($id: ID!, $remun: Int!) {
    updateGradeRemun(id: $id, remun: $remun) {
      code
      success
      message
    }
  }
`

const EditGradeRemunModal = (props) => {
  const [remun, setRemun] = useState(props.remun)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(UPDATE_GRADE_REMUN)

  const editAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.grade,
          remun: remun,
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
        placeholder="Remun"
        aria-label="default input remun"
        value={remun}
        onChange={(e) => setRemun(parseInt(e.target.value))}
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
  grade: PropTypes.string.isRequired,
  remun: PropTypes.number.isRequired,
  edited: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default EditGradeRemunModal
