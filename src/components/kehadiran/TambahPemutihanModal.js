import React, { useContext, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CForm,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react-pro'
import { namaBulan } from 'src/utils'
import { KeycloakContext } from 'src/context'

const TambahPemutihanModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [tanggal, setTanggal] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const [status, setStatus] = useState()

  const keycloak = useContext(KeycloakContext)

  const tambahAction = async (event) => {
    event.preventDefault()
    if (!(tanggal && props.bulan && props.tahun && (status === 'DATANG' || status === 'PULANG'))) {
      setErrorMessage('tanggal dan status harus dipilih!')
      return
    }
    setError(false)
    setLoading(true)
    const formattedDate =
      props.tahun.toString() +
      '-' +
      (props.bulan > 9 ? props.bulan : '0' + props.bulan) +
      '-' +
      (tanggal > 9 ? tanggal : '0' + tanggal)
    try {
      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pemutihan`,
        {
          tanggal: formattedDate,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      setLoading(false)
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
    props.added()
  }

  const daysOfMonth = (tahun, bulan) => {
    let result = ['Pilih Tanggal']
    const max = new Date(tahun, bulan, 0).getDate()
    for (let i = 1; i <= max; i++) {
      result.push({ label: i, value: i })
    }
    return result
  }

  const onChangeTanggal = (e) => {
    setTanggal(e.target.value)
    setErrorMessage()
  }

  const onChangeStatus = (e) => {
    setStatus(e.target.value)
    setErrorMessage()
  }

  let modalBody = (
    <>
      <h5 className="text-center">
        {namaBulan(props.bulan)} {props.tahun}
      </h5>
      <CForm>
        <CFormSelect
          aria-label="Default select tanggal"
          options={daysOfMonth(props.tahun, props.bulan)}
          onChange={(e) => onChangeTanggal(e)}
          className="mb-3"
        />
        <CFormSelect
          aria-label="Default pilih status"
          value={status}
          options={['Pilih Status', 'DATANG', 'PULANG']}
          onChange={(e) => onChangeStatus(e)}
        />
      </CForm>
      {errorMessage && (
        <CAlert className="mt-3" color="danger">
          {errorMessage}
        </CAlert>
      )}
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
    modalBody = <CAlert color="danger">Gagal menambah hari libur! Coba lagi?</CAlert>
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Hari Libur</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CButton type="submit" color="primary" onClick={tambahAction}>
          Simpan
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

TambahPemutihanModal.propTypes = {
  tahun: PropTypes.number.isRequired,
  bulan: PropTypes.number.isRequired,
  added: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default TambahPemutihanModal
