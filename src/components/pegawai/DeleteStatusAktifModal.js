import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import { gql, useMutation } from '@apollo/client'

const DELETE_STATUS_AKTIF = gql`
  mutation DeleteStatusAktif($id: Int!) {
    deleteStatusAktif(id: $id) {
      code
      success
      message
    }
  }
`

const DeleteStatusAktifModal = (props) => {
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(DELETE_STATUS_AKTIF)

  const hapusAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
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
      if (!data?.deleteStatusAktif.success) {
        setErrorMessage(data.deleteStatusAktif.message)
      } else if (data?.deleteStatusAktif.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Hapus Status Aktif</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <>
          <p>Anda yakin ingin menghapus status aktif {props.nama}?</p>
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
        </>
      </CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={() => props.setVisible(false)}>
          Tidak
        </CButton>
        <CLoadingButton
          loading={loading}
          color="danger"
          variant="outline"
          onClick={() => hapusAction()}
        >
          Ya
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

DeleteStatusAktifModal.propTypes = {
  id: PropTypes.number.isRequired,
  nama: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default DeleteStatusAktifModal