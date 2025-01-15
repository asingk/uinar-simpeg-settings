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

const CREATE_BAG_UKER = gql`
  mutation CretaeBagianUnitKerja($nama: String!) {
    createBagianUnitKerja(nama: $nama) {
      code
      success
      message
    }
  }
`

const AddBagUnitKerjaiModal = (props) => {
  const [nama, setNama] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_BAG_UKER)

  const addAction = async () => {
    try {
      await simpan({
        variables: {
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
      if (!data?.createBagianUnitKerja.success) {
        setErrorMessage(data.createBagianUnitKerja.message)
      } else if (data?.createBagianUnitKerja.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  let modalBody = (
    <CForm>
      <CFormInput
        type="text"
        placeholder="Nama Bagian Unit Kerja"
        aria-label="default input nama bagian unit kerja"
        value={nama}
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
        <CModalTitle>Tambah Bagian Unit Kerja</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={addAction}>
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

AddBagUnitKerjaiModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddBagUnitKerjaiModal
