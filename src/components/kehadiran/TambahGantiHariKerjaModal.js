import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import dayjs from 'dayjs'
import {
  CAlert,
  CButton,
  CDatePicker,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react-pro'
import { KeycloakContext } from 'src/context'

const TambahHariKerjaModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [tanggal, settanggal] = useState('')

  const keycloak = useContext(KeycloakContext)

  let modalBody = (
    <CForm>
      <CDatePicker
        label="Tanggal"
        locale="id-ID"
        className="mb-3"
        onDateChange={(date) => settanggal(date)}
        portal={false}
      />
      {errorMessage && <CAlert color="danger">errorMessage</CAlert>}
    </CForm>
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
    modalBody = <CAlert color="danger">Gagal menambah hari! Coba lagi?</CAlert>
  }

  const tambahAction = async () => {
    setErrorMessage()
    setError(false)
    setLoading(true)

    try {
      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/hari-libur-tapi-kerja`,
        {
          tanggal: dayjs(tanggal).format('YYYY-MM-DD'),
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      props.added()
    } catch (error) {
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        setLoading(false)
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
        <CModalTitle>Tambah Ganti hari Kerja</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CButton color="primary" onClick={tambahAction}>
          Simpan
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

TambahHariKerjaModal.propTypes = {
  added: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default TambahHariKerjaModal
