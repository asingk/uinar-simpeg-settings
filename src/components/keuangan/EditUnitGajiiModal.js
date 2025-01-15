import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
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
import { gql, useMutation } from '@apollo/client'

const UPDATE_UNIT_GAJI = gql`
  mutation UpdateUnitGaji($id: ID!, $nama: String!) {
    updateUnitGaji(id: $id, nama: $nama) {
      code
      success
      message
    }
  }
`

const EditUnitGajiModal = (props) => {
  const [nama, setNama] = useState(props.nama)
  const [errorMessage, setErrorMessage] = useState('')
  const [simpan, { data, loading, error }] = useMutation(UPDATE_UNIT_GAJI)

  const editAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
          nama: nama,
        },
        refetchQueries: ['DaftarUnitGaji'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.updateUnitGaji.success) {
        setErrorMessage(data.updateUnitGaji.message)
      } else if (data?.updateUnitGaji.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <>
      <CFormInput
        className="mb-3"
        type="text"
        placeholder="Nama Unit Gaji"
        aria-label="default input unit gaji"
        defaultValue={nama}
        onChange={(e) => setNama(e.target.value)}
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
        <CModalTitle>Ubah Unit Gaji</CModalTitle>
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

EditUnitGajiModal.propTypes = {
  id: PropTypes.string.isRequired,
  nama: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default EditUnitGajiModal
