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
  mutation CreateGradeRemun($id: ID!, $remun: Int!) {
    createGradeRemun(id: $id, remun: $remun) {
      code
      success
      message
    }
  }
`

const AddGradeRemunModal = (props) => {
  const [id, setId] = useState('')
  const [remun, setRemun] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_GRADE_REMUN)

  const addAction = async () => {
    try {
      await simpan({
        variables: {
          id: id,
          remun: remun,
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
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="mb-3"
      />
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
