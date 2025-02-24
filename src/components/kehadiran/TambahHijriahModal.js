import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import dayjs from 'dayjs'
import {
  CAlert,
  CButton,
  CDatePicker,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react-pro'
import { KeycloakContext } from 'src/context'

const TambahHijriahModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [awalRamadhan, setAwalRamadhan] = useState('')
  const [awalSyawal, setAwalSyawal] = useState('')
  const [tahun, setTahun] = useState('')

  const keycloak = useContext(KeycloakContext)

  let modalBody = (
    <CForm>
      <CFormInput
        label="Tahun Hijriah"
        id="tahunHijriah"
        type="number"
        className="mb-3"
        value={tahun}
        onChange={(e) => setTahun(e.target.value)}
      />
      <CDatePicker
        label="Awal Ramadhan"
        locale="id-ID"
        className="mb-3"
        onDateChange={(date) => setAwalRamadhan(date)}
        portal={false}
      />
      <CDatePicker
        label="Awal Syawal"
        locale="id-ID"
        className="mb-3"
        onDateChange={(date) => setAwalSyawal(date)}
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
    modalBody = <CAlert color="danger">Gagal menambah hijriah! Coba lagi?</CAlert>
  }

  async function tambahAction(event) {
    event.preventDefault()
    try {
      setLoading(true)
      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/hijriah`,
        {
          tahun: tahun,
          awalRamadhan: dayjs(awalRamadhan).format('YYYY-MM-DD'),
          awalSyawal: dayjs(awalSyawal).format('YYYY-MM-DD'),
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      setLoading(false)
      props.added()
    } catch (error) {
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        setLoading(false)
        // setErrorResp(true)
        setErrorMessage(error.response.data.message)
      } else if (error.request) {
        // The client never received a response, and the request was never left
        setLoading(false)
        setError(true)
      } else {
        // Anything else
        setLoading(false)
        setError(true)
      }
    }
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Hijriah</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton type="submit" color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CButton color="primary" onClick={tambahAction}>
          Simpan
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

TambahHijriahModal.propTypes = {
  added: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default TambahHijriahModal
