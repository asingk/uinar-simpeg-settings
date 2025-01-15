import React, { useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react-pro'

const TambahHariLiburModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [tanggal, setTanggal] = useState()
  const [errorMessage, setErrorMessage] = useState('')

  const tambahAction = async () => {
    if (!tanggal) {
      setErrorMessage('tanggal harus dipilih!')
      return
    }
    setError(false)
    setLoading(true)
    const formattedDate =
      props.tahun.toString() +
      '-' +
      (props.bulan > 9 ? props.bulan : '0' + props.bulan) +
      '-' +
      (tanggal.length > 1 ? tanggal : '0' + tanggal)
    try {
      await axios.post(
        import.meta.env.VITE_KEHADIRAN_API_URL + '/hari-libur',
        'tanggal=' + formattedDate,
        {
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
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

    setLoading(false)
  }

  const namaBulan = (bulan) => {
    switch (bulan) {
      case 1:
        return 'Januari'
      case 2:
        return 'Februari'
      case 3:
        return 'Maret'
      case 4:
        return 'April'
      case 5:
        return 'Mei'
      case 6:
        return 'Juni'
      case 7:
        return 'Juli'
      case 8:
        return 'Agustus'
      case 9:
        return 'September'
      case 10:
        return 'Oktober'
      case 11:
        return 'November'
      case 12:
        return 'Desember'
      default:
        return ''
    }
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

  let modalBody = (
    <>
      <h5 className="text-center">
        {namaBulan(props.bulan)} {props.tahun}
      </h5>
      <CFormSelect
        aria-label="Default select tanggal"
        options={daysOfMonth(props.tahun, props.bulan)}
        onChange={(e) => onChangeTanggal(e)}
      />
      {errorMessage && (
        <CAlert show className="w-100 mt-4" color="danger">
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
    modalBody = (
      <CAlert show className="w-100" color="danger">
        Gagal menambah hari libur! Coba lagi?
      </CAlert>
    )
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
        <CButton color="primary" onClick={tambahAction}>
          Simpan
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

TambahHariLiburModal.propTypes = {
  tahun: PropTypes.number.isRequired,
  bulan: PropTypes.number.isRequired,
  added: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default TambahHariLiburModal
