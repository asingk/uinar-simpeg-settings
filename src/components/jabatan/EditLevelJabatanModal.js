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

const UPDATE_LEVEL_JABATAN = gql`
  mutation UpdateLevelJabatan($id: Int!, $nama: String!, $ssoRole: ID!) {
    updateLevelJabatan(id: $id, nama: $nama, ssoRole: $ssoRole) {
      code
      success
      message
    }
  }
`

const EditLevelJabatanModal = (props) => {
  const [nama, setNama] = useState(props.nama)
  const [ssoRole, setSsoRole] = useState(props.ssoRole)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(UPDATE_LEVEL_JABATAN)

  const editAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
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
      if (!data?.updateLevelJabatan.success) {
        setErrorMessage(data.updateLevelJabatan.message)
      } else if (data?.updateLevelJabatan.success) {
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
      <SelectSsoRole setSsoRole={setSsoRole} code={ssoRole} />
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
        <CModalTitle>Ubah Level Jabatan</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton type="submit" color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={editAction}>
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

EditLevelJabatanModal.propTypes = {
  id: PropTypes.number.isRequired,
  nama: PropTypes.string.isRequired,
  ssoRole: PropTypes.string.isRequired,
  edited: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default EditLevelJabatanModal
