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

const DELETE_SUBBAG_UKER = gql`
  mutation DeleteSubbagUnitKerja($id: Int!) {
    deleteSubbagUnitKerja(id: $id) {
      code
      success
      message
    }
  }
`

const DeleteSubBagUnitKerjaModal = (props) => {
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(DELETE_SUBBAG_UKER)

  const hapusAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
        },
        refetchQueries: ['DaftarSubbagUnitKerja'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.deleteSubbagUnitKerja.success) {
        setErrorMessage(data.deleteSubbagUnitKerja.message)
      } else if (data?.deleteSubbagUnitKerja.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Hapus Bagian {props.nama}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <>
          <p>Anda yakin ingin menghapus subbagian unit kerja ini?</p>
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

DeleteSubBagUnitKerjaModal.propTypes = {
  id: PropTypes.number.isRequired,
  nama: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default DeleteSubBagUnitKerjaModal
