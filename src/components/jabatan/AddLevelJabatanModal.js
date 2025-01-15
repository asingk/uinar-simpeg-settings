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
import SelectSsoRole from './SelectSsoRole'

const CREATE_LEVEL_JABATAN = gql`
  mutation CreateLevelJabatan($jabatanId: ID!, $nama: String!, $ssoRole: ID!) {
    createLeveljabatan(jabatanId: $jabatanId, nama: $nama, ssoRole: $ssoRole) {
      code
      success
      message
    }
  }
`

const AddLevelJabatanModal = (props) => {
  const [nama, setNama] = useState('')
  const [ssoRole, setSsoRole] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_LEVEL_JABATAN)

  const addAction = async () => {
    try {
      await simpan({
        variables: {
          jabatanId: props.jabatanId,
          nama: nama,
          ssoRole: ssoRole,
        },
        refetchQueries: ['Jabatan'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      setErrorMessage(e.message)
    }
  }
  useEffect(() => {
    if (data) {
      if (!data?.createLeveljabatan.success) {
        setErrorMessage(data.createLeveljabatan.message)
      } else if (data?.createLeveljabatan.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <CForm>
      <CFormInput
        type="text"
        placeholder="Nama Level Jabatan"
        aria-label="default input nama level jabatan"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="mb-2"
      />
      <SelectSsoRole setSsoRole={(code) => setSsoRole(code)} />
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
        <CModalTitle>Tambah Level Jabatan {props.namaJabatan}</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton type="submit" color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={addAction}>
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

AddLevelJabatanModal.propTypes = {
  jabatanId: PropTypes.string.isRequired,
  namaJabatan: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddLevelJabatanModal
