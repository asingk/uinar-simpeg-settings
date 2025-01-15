import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  CAlert,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react-pro'

const HapusHijriahModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function hapusAction() {
    try {
      setLoading(true)
      await axios.delete(import.meta.env.VITE_KEHADIRAN_API_URL + '/hijriah/' + props.id, {
        headers: {
          apikey: import.meta.env.VITE_API_KEY,
        },
      })
      props.deleted()
    } catch (error) {
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        setLoading(false)
        // setErrorResp(true)
      } else if (error.request) {
        // The client never received a response, and the request was never left
        setLoading(false)
        setError(true)
      } else {
        // Anything else
        setLoading(false)
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  let modalBody = <p>Anda yakin ingin menghapus Hijriah Tahun {props.tahun}?</p>

  if (loading) {
    modalBody = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    modalBody = (
      <CAlert show className="w-100" color="danger">
        Gagal menghapus pemutihan! Coba lagi?
      </CAlert>
    )
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Hapus Hijriah</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CButton color="danger" onClick={hapusAction}>
          Hapus
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

HapusHijriahModal.propTypes = {
  id: PropTypes.string.isRequired,
  tahun: PropTypes.number.isRequired,
  deleted: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default HapusHijriahModal
