import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react-pro'
import { gql, useMutation } from '@apollo/client'

const UPDATE_STATUS_AKTIF = gql`
  mutation UpdateStatusAktif(
    $id: Int!
    $nama: String!
    $ssoEnabled: Boolean!
    $isActive: Boolean!
  ) {
    updateStatusAktif(id: $id, nama: $nama, ssoEnabled: $ssoEnabled, isActive: $isActive) {
      code
      success
      message
    }
  }
`

const EditStatusAktifModal = (props) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [simpan, { data, loading, error }] = useMutation(UPDATE_STATUS_AKTIF)

  const editAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
          nama: props.nama,
          ssoEnabled: props.ssoEnabled,
          isActive: props.isActive,
        },
        refetchQueries: ['DaftarStatusAktif'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.updateStatusAktif.success) {
        setErrorMessage(data.updateStatusAktif.message)
      } else if (data?.updateStatusAktif.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <CForm>
      <CRow className="mb-3">
        <CFormLabel htmlFor="staticNama" className="col-sm-2 col-form-label">
          Nama
        </CFormLabel>
        <CCol sm={10}>
          <CFormInput
            type="text"
            id="staticNama"
            value={props.nama}
            onChange={(e) => props.setNama(e.target.value)}
          />
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <CFormLabel htmlFor="option-sso" className="col-sm-2 col-form-label">
          SSO
        </CFormLabel>
        <CCol sm={10}>
          <CFormCheck
            button={{ color: 'success', variant: 'outline' }}
            type="radio"
            name="options-sso"
            id="sso-enable"
            autoComplete="off"
            label="Enable"
            checked={props.ssoEnabled === true}
            onChange={() => props.setSsoEnabled(true)}
          />
          <CFormCheck
            button={{ color: 'danger', variant: 'outline' }}
            type="radio"
            name="options-sso"
            id="sso-disable"
            autoComplete="off"
            label="Disable"
            checked={props.ssoEnabled === false}
            onChange={() => props.setSsoEnabled(false)}
          />
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <CFormLabel htmlFor="option-aktif" className="col-sm-2 col-form-label">
          Aktif
        </CFormLabel>
        <CCol sm={10}>
          <CFormCheck
            button={{ color: 'success', variant: 'outline' }}
            type="radio"
            name="options-aktif"
            id="aktif-ya"
            autoComplete="off"
            label="Ya"
            onChange={() => props.setIsActive(true)}
            checked={props.isActive === true}
          />
          <CFormCheck
            button={{ color: 'danger', variant: 'outline' }}
            type="radio"
            name="options-aktif"
            id="aktif-tidak"
            autoComplete="off"
            label="Tidak"
            onChange={() => props.setIsActive(false)}
            checked={props.isActive === false}
          />
        </CCol>
      </CRow>
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
        <CModalTitle>Ubah Status Aktif</CModalTitle>
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

EditStatusAktifModal.propTypes = {
  id: PropTypes.number.isRequired,
  setId: PropTypes.func,
  nama: PropTypes.string.isRequired,
  setNama: PropTypes.func,
  ssoEnabled: PropTypes.bool.isRequired,
  setSsoEnabled: PropTypes.func,
  isActive: PropTypes.bool.isRequired,
  setIsActive: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default EditStatusAktifModal
