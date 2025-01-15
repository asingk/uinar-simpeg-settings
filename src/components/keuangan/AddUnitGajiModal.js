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

const CREATE_UNIT_GAJI = gql`
  mutation CreateUnitGaji($id: ID!, $nama: String!) {
    createUnitGaji(id: $id, nama: $nama) {
      code
      message
      success
    }
  }
`

const AddUnitGajiModal = (props) => {
  const [id, setId] = useState('')
  const [nama, setNama] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_UNIT_GAJI)

  const addAction = async () => {
    try {
      await simpan({
        variables: {
          nama: nama,
          id: id,
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
      if (!data?.createUnitGaji.success) {
        setErrorMessage(data.createUnitGaji.message)
      } else if (data?.createUnitGaji.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <>
      <CFormInput
        type="text"
        placeholder="Kode Unit Gaji"
        aria-label="default input kode unit gaji"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="mb-3"
      />
      <CFormInput
        type="text"
        placeholder="Nama Unit Gaji"
        aria-label="default input nama unit gaji"
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
        <CModalTitle>Tambah Unit Gaji/Remun</CModalTitle>
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

export default AddUnitGajiModal

AddUnitGajiModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}
