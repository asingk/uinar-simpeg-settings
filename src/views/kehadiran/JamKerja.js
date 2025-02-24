import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import {
  CAlert,
  CButton,
  CCol,
  CFormSwitch,
  CRow,
  CSpinner,
  CTimePicker,
  CToaster,
} from '@coreui/react-pro'
import SelectHari from '../../components/kehadiran/SelectHari'
import SuccessToast from 'src/components/SuccessToast'
import { KeycloakContext } from 'src/context'

const JamKerja = () => {
  console.debug('rendering... JamKerja')

  const [idHari, setIdHari] = useState(0)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [loading, setLoading] = useState(false)
  const [isRamadhan, setIsRamadhan] = useState(false)
  const [jamDatangStart, setJamDatangStart] = useState()
  const [jamDatangEnd, setJamDatangEnd] = useState()
  const [jamPulangStart, setJamPulangStart] = useState()
  const [jamPulangEnd, setjamPulangEnd] = useState()
  const [jamLemburStart, setJamLemburStart] = useState()
  const [jamLemburEnd, setJamLemburEnd] = useState()
  const [jamDatangBatas, setJamDatangBatas] = useState()
  const [jamPulangBatas, setJamPulangBatas] = useState()
  const [toast, addToast] = useState()
  const toaster = useRef(null)

  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    if (idHari > 0) {
      setLoading(true)
      axios
        .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/jam-kerja/search`, {
          params: {
            hari: idHari,
            isRamadhan,
          },
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        })
        .then((response) => {
          setJamDatangStart(response.data.jamDatangStart)
          setJamDatangEnd(response.data.jamDatangEnd)
          setJamPulangStart(response.data.jamPulangStart)
          setjamPulangEnd(response.data.jamPulangEnd)
          setJamLemburStart(response.data.jamLemburStart)
          setJamLemburEnd(response.data.jamLemburEnd)
          setJamDatangBatas(response.data.jamDatangBatas)
          setJamPulangBatas(response.data.jamPulangBatas)
        })
        .catch((error) => {
          setError(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [idHari, isRamadhan])

  const onChangeHari = (id) => {
    setIdHari(id)
  }

  const exampleToast = <SuccessToast message={'Jam kerja berhasil diubah'} />

  const simpanAction = async () => {
    const hari = idHari === 1 ? [1, 2, 3, 4, 6, 7] : [5]
    try {
      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/jam-kerja`,
        {
          jamDatangStart: jamDatangStart,
          jamDatangEnd: jamDatangEnd,
          jamPulangStart: jamPulangStart,
          jamPulangEnd: jamPulangEnd,
          jamLemburStart: jamLemburStart,
          jamLemburEnd: jamLemburEnd,
          jamDatangBatas: jamDatangBatas,
          jamPulangBatas: jamPulangBatas,
          isRamadhan,
          hari,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      addToast(exampleToast)
    } catch (error) {
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        setErrorMessage(error.response.data.message)
      } else if (error.request) {
        // The client never received a response, and the request was never left
        setError(true)
      } else {
        // Anything else
        setError(true)
      }
    }
  }

  let body
  if (loading) {
    body = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    body = (
      <CAlert show className="w-100" color="danger">
        Error: {error}
      </CAlert>
    )
  } else {
    body = (
      <>
        <CRow lg={{ cols: 2, gutter: 3 }} xs={{ cols: 1, gutter: 3 }} className="mb-3">
          <CCol>
            <CTimePicker
              label="Jam Datang Buka"
              locale="id-ID"
              time={jamDatangStart}
              seconds={false}
              onTimeChange={(time) => setJamDatangStart(time.substring(0, 8))}
            />
          </CCol>
          <CCol>
            <CTimePicker
              label="Jam Datang Batas Tepat Waktu"
              locale="id-ID"
              time={jamDatangBatas}
              seconds={false}
              onTimeChange={(time) => setJamDatangBatas(time.substring(0, 8))}
            />
          </CCol>
          <CCol>
            <CTimePicker
              label="Jam Datang Tutup"
              locale="id-ID"
              time={jamDatangEnd}
              seconds={false}
              onTimeChange={(time) => setJamDatangEnd(time.substring(0, 8))}
            />
          </CCol>
          <CCol>
            <CTimePicker
              label="Jam Pulang Buka"
              locale="id-ID"
              time={jamPulangStart}
              seconds={false}
              onTimeChange={(time) => setJamPulangStart(time.substring(0, 8))}
            />
          </CCol>
          <CCol>
            <CTimePicker
              label="Jam Pulang Batas Tepat Waktu"
              locale="id-ID"
              time={jamPulangBatas}
              seconds={false}
              onTimeChange={(time) => setJamPulangBatas(time.substring(0, 8))}
            />
          </CCol>
          <CCol>
            <CTimePicker
              label="Jam Pulang Tutup"
              locale="id-ID"
              time={jamPulangEnd}
              seconds={false}
              onTimeChange={(time) => setjamPulangEnd(time.substring(0, 8))}
            />
          </CCol>
          <CCol>
            <CTimePicker
              label="Jam Lembur Buka"
              locale="id-ID"
              time={jamLemburStart}
              seconds={false}
              onTimeChange={(time) => setJamLemburStart(time.substring(0, 8))}
            />
          </CCol>
          <CCol>
            <CTimePicker
              label="Jam Lembur Tutup"
              locale="id-ID"
              time={jamLemburEnd}
              seconds={false}
              onTimeChange={(time) => setJamLemburEnd(time.substring(0, 8))}
            />
          </CCol>
        </CRow>
        {errorMessage && (
          <CAlert show className="w-100" color="danger">
            Error: {errorMessage}
          </CAlert>
        )}
        <CRow className="mb-3 justify-content-end">
          <CCol md="3" lg="1">
            <CButton onClick={simpanAction} color="primary">
              Simpan
            </CButton>
          </CCol>
        </CRow>
      </>
    )
  }

  return (
    <>
      <h1 className="text-center">Jam Kerja</h1>
      <CRow className="justify-content-center mb-4">
        <CCol md="3">
          <SelectHari hari={idHari} setSelect={(id) => onChangeHari(Number(id))} />
        </CCol>
        <CCol md="3">
          <CFormSwitch
            label="Bulan Ramadhan"
            id="formSwitchCheckDefault"
            defaultChecked={isRamadhan}
            onChange={() => setIsRamadhan(!isRamadhan)}
          />
        </CCol>
      </CRow>
      {idHari > 0 && body}
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </>
  )
}

export default JamKerja
