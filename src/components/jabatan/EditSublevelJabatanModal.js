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

const UPDATE_SUBLEVEL_JABATAN = gql`
  mutation UpdateSublevelJabatan($id: Int!, $nama: String!) {
    updateSublevelJabatan(id: $id, nama: $nama) {
      code
      success
      message
    }
  }
`

const EditSublevelJabatanModal = (props) => {
  const [nama, setNama] = useState(props.nama)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(UPDATE_SUBLEVEL_JABATAN)

  const editAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
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
      if (!data?.updateSublevelJabatan.success) {
        setErrorMessage(data.updateSublevelJabatan.message)
      } else if (data?.updateSublevelJabatan.success) {
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
        <CModalTitle>Ubah Sub Level Jabatan</CModalTitle>
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

EditSublevelJabatanModal.propTypes = {
  id: PropTypes.number.isRequired,
  nama: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default EditSublevelJabatanModal
