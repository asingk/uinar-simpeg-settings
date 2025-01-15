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

const CREATE_UNIT_KERJA = gql`
  mutation CreateUnitKerja($id: ID!, $nama: String!) {
    createUnitKerja(id: $id, nama: $nama) {
      code
      success
      message
    }
  }
`

const AddUnitKerjaiModal = (props) => {
  const [id, setId] = useState('')
  const [nama, setNama] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_UNIT_KERJA)

  const addAction = async () => {
    try {
      await simpan({
        variables: {
          nama: nama,
          id: id,
        },
        refetchQueries: ['DaftarUnitKerja'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      setErrorMessage(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.createUnitKerja.success) {
        setErrorMessage(data.createUnitKerja.message)
      } else if (data?.createUnitKerja.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Unit Kerja</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            type="text"
            floatingLabel="Kode"
            placeholder="Kode Unit Kerja"
            aria-label="default input kode unit kerja"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="mb-3"
          />
          <CFormInput
            type="text"
            floatingLabel="Nama"
            placeholder="Nama Unit Kerja"
            aria-label="default input nama unit kerja"
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
      </CModalBody>
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

AddUnitKerjaiModal.propTypes = {
  added: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddUnitKerjaiModal
