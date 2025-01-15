import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'
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

const CREATE_STATUS_AKTIF = gql`
  mutation CreateStatusAktif($nama: String!, $ssoEnabled: Boolean!, $isActive: Boolean!) {
    createStatusAktif(nama: $nama, ssoEnabled: $ssoEnabled, isActive: $isActive) {
      code
      success
      message
    }
  }
`

const AddStatusAktifModal = (props) => {
  const [ssoEnabled, setSsoEnabled] = useState(null)
  const [nama, setNama] = useState('')
  const [isActive, setIsActive] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_STATUS_AKTIF)

  const addAction = async () => {
    try {
      await simpan({
        variables: {
          nama: nama,
          ssoEnabled: ssoEnabled,
          isActive: isActive,
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
      if (!data?.createStatusAktif.success) {
        setErrorMessage(data.createStatusAktif.message)
      } else if (data?.createStatusAktif.success) {
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
            value={nama}
            onChange={(e) => setNama(e.target.value)}
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
            checked={ssoEnabled === true}
            onChange={() => setSsoEnabled(true)}
          />
          <CFormCheck
            button={{ color: 'danger', variant: 'outline' }}
            type="radio"
            name="options-sso"
            id="sso-disable"
            autoComplete="off"
            label="Disable"
            checked={ssoEnabled === false}
            onChange={() => setSsoEnabled(false)}
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
            onChange={() => setIsActive(true)}
            checked={isActive === true}
          />
          <CFormCheck
            button={{ color: 'danger', variant: 'outline' }}
            type="radio"
            name="options-aktif"
            id="aktif-tidak"
            autoComplete="off"
            label="Tidak"
            onChange={() => setIsActive(false)}
            checked={isActive === false}
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

export default AddStatusAktifModal

AddStatusAktifModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}
