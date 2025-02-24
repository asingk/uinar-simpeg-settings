import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
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
  CSpinner,
} from '@coreui/react-pro'
import { KeycloakContext } from 'src/context'

const EditPajakModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState()

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  let modalBody = (
    <>
      <CFormInput
        type="number"
        id="floatingInput"
        floatingClassName="mb-3"
        floatingLabel="Persentase (%)"
        placeholder="Persentase (%)"
        value={props.persen}
        onChange={(e) => props.setPersen(parseInt(e.target.value))}
      />
      {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
    </>
  )

  if (loading) {
    modalBody = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    modalBody = <CAlert color="danger">Terjadi kesalahan</CAlert>
  }

  async function submitAction() {
    try {
      setLoading(true)
      await axios.put(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pajak/${props.id}`,
        {
          persen: props.persen,
          updatedBy: loginId,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      props.done()
    } catch (error) {
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        // setErrorResp(true)
        setErrorMessage(error.response.data.message)
      } else if (error.request) {
        // The client never received a response, and the request was never left
        setError(true)
      } else {
        // Anything else
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Ubah Pajak</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CLoadingButton loading={loading} color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CLoadingButton>
        <CButton color="primary" onClick={submitAction}>
          Simpan
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

EditPajakModal.propTypes = {
  id: PropTypes.string.isRequired,
  persen: PropTypes.number.isRequired,
  setPersen: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
  done: PropTypes.func,
}

export default EditPajakModal
