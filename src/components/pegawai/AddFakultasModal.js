import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'
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

const CREATE_FAKULTAS = gql`
  mutation CreateFakultas($id: ID!, $nama: String!) {
    createFakultas(id: $id, nama: $nama) {
      code
      success
      message
    }
  }
`

const AddFakultasModal = (props) => {
  const [id, setId] = useState('')
  const [nama, setNama] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_FAKULTAS)

  const addAction = async () => {
    try {
      await simpan({
        variables: {
          id: id,
          nama: nama,
        },
        refetchQueries: ['DaftarFakultas'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.createFakultas.success) {
        setErrorMessage(data.createFakultas.message)
      } else if (data?.createFakultas.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <CForm>
      <CFormInput
        type="text"
        placeholder="Kode Fakultas"
        aria-label="default input kode fakultas"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="mb-3"
      />
      <CFormInput
        type="text"
        placeholder="Nama Fakultas"
        aria-label="default input nama fakultas"
        value={nama}
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
    </CForm>
  )
  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Fakultas</CModalTitle>
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

export default AddFakultasModal

AddFakultasModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}
