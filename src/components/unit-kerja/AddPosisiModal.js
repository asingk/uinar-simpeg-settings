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

const CREATE_POSISI = gql`
  mutation CreatePosisi($id: ID!, $nama: String!) {
    createPosisi(id: $id, nama: $nama) {
      code
      success
      message
    }
  }
`

const AddPosisiModal = (props) => {
  const [id, setId] = useState('')
  const [nama, setNama] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_POSISI)

  const addAction = async () => {
    try {
      await simpan({
        variables: {
          nama: nama,
          id: id,
        },
        refetchQueries: ['DaftarPosisi'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.createPosisi.success) {
        setErrorMessage(data.createPosisi.message)
      } else if (data?.createPosisi.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <>
      <CFormInput
        type="text"
        placeholder="Kode Posisi"
        aria-label="default input kode posisi"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="mb-3"
      />
      <CFormInput
        type="text"
        placeholder="Nama Posisi"
        aria-label="default input nama posisi"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="mb-3"
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
        <CModalTitle>Tambah Posisi</CModalTitle>
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

AddPosisiModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddPosisiModal
