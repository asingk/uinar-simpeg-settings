import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
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

const HapusGantiGariKerjaModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const hapusAction = async () => {
    setError(false)
    setLoading(true)
    const resp = await fetch(
      import.meta.env.VITE_KEHADIRAN_API_URL + '/hari-libur-tapi-kerja/' + props.id,
      {
        method: 'DELETE',
        headers: {
          apikey: import.meta.env.VITE_API_KEY,
        },
      },
    )
    if (resp.ok) {
      setLoading(false)
      props.deleted()
    } else {
      setLoading(false)
      setError(true)
    }
  }

  let modalBody = (
    <p>
      Anda yakin ingin menghapus ganti hari libur pada {dayjs(props.tanggal).format('D/M/YYYY')}?
    </p>
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
    modalBody = <CAlert color="danger">Gagal menghapus hari libur tapi kerja! Coba lagi?</CAlert>
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Hapus Ganti hari Kerja</CModalTitle>
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

HapusGantiGariKerjaModal.propTypes = {
  id: PropTypes.string.isRequired,
  tanggal: PropTypes.string.isRequired,
  deleted: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
  close: PropTypes.func,
}

export default HapusGantiGariKerjaModal
