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

const DELETE_FAKULTAS = gql`
  mutation DeleteFakultas($id: ID!) {
    deleteFakultas(id: $id) {
      code
      success
      message
    }
  }
`

const DeleteFakultasModal = (props) => {
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(DELETE_FAKULTAS)

  const hapusAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
        },
        refetchQueries: ['DaftarFakultas'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.deleteFakultas.success) {
        setErrorMessage(data.deleteFakultas.message)
      } else if (data?.deleteFakultas.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Hapus Fakultas</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <>
          <p>Anda yakin ingin menghapus fakultas {props.nama}?</p>
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

DeleteFakultasModal.propTypes = {
  id: PropTypes.string.isRequired,
  nama: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default DeleteFakultasModal
