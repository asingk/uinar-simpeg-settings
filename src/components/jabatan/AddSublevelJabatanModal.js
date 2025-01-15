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

const CREATE_SUBLEVEL_JABATAN = gql`
  mutation CreateSublevelJabatan($nama: String!) {
    createSubLevelJabatan(nama: $nama) {
      code
      success
      message
    }
  }
`

const AddSubevelJabatanModal = (props) => {
  const [nama, setNama] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_SUBLEVEL_JABATAN)

  const addAction = async () => {
    try {
      await simpan({
        variables: {
          nama: nama,
        },
        refetchQueries: ['DaftarSublevelJabatan'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      setErrorMessage(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.createSubLevelJabatan.success) {
        setErrorMessage(data.createSubLevelJabatan.message)
      } else if (data?.createSubLevelJabatan.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <>
      <CFormInput
        type="text"
        placeholder="Nama Sublevel Jabatan"
        aria-label="default input nama sublevel jabatan"
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
    </>
  )
  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Sublevel Jabatan</CModalTitle>
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

AddSubevelJabatanModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddSubevelJabatanModal
