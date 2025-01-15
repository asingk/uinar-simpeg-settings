import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import { gql, useMutation } from '@apollo/client'

const UPDATE_BAG_UKER = gql`
  mutation UpdateBagianUnitKerja($id: Int!, $nama: String!) {
    updateBagianUnitKerja(id: $id, nama: $nama) {
      code
      success
      message
    }
  }
`

const EditBagUnitKerjaModal = (props) => {
  const [nama, setNama] = useState(props.nama)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(UPDATE_BAG_UKER)

  const editAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
          nama: nama,
        },
        refetchQueries: ['DaftarBagianUnitKerja'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.updateBagianUnitKerja.success) {
        setErrorMessage(data.updateBagianUnitKerja.message)
      } else if (data?.updateBagianUnitKerja.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <CForm>
      <CFormInput
        type="text"
        placeholder="Bagian Unit Kerja"
        aria-label="default input bagian unit kerja"
        defaultValue={nama}
        onChange={(e) => setNama(e.target.value)}
      />
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
    </CForm>
  )

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Ubah Bagian {props.nama}</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={editAction}>
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

EditBagUnitKerjaModal.propTypes = {
  id: PropTypes.number.isRequired,
  nama: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default EditBagUnitKerjaModal
