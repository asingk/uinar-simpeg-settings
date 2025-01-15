import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import { gql, useMutation } from '@apollo/client'

const UPDATE_PRODI = gql`
  mutation UpdateProdi($id: Int!, $nama: String!) {
    updateProdi(id: $id, nama: $nama) {
      code
      success
      message
    }
  }
`

const EditProdiModal = (props) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [simpan, { data, loading, error }] = useMutation(UPDATE_PRODI)

  const editAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
          nama: props.nama,
        },
        refetchQueries: ['Fakultas'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.updateProdi.success) {
        setErrorMessage(data.updateProdi.message)
      } else if (data?.updateProdi.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <CForm>
      <CFormInput
        type="text"
        placeholder="Nama Fakultas"
        aria-label="default input nama fakultas"
        value={props.nama}
        onChange={(e) => props.setNama(e.target.value)}
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
    </CForm>
  )

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Ubah Prodi</CModalTitle>
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

EditProdiModal.propTypes = {
  id: PropTypes.number.isRequired,
  setId: PropTypes.func,
  nama: PropTypes.string.isRequired,
  setNama: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default EditProdiModal
