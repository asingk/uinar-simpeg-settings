import React, { useContext, useEffect, useRef, useState } from 'react'
import { KeycloakContext } from 'src/context'
import axios from 'axios'
import { CAlert, CFormSwitch, CSpinner, CToaster } from '@coreui/react-pro'
import SuccessToast from 'src/components/SuccessToast'

const WfaHari = () => {
  console.debug('rendering... WFA Hari')

  const [data, setData] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState()
  const toaster = useRef(null)

  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/wfa-hari`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then((response) => {
        setData(response.data.wfaHari)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const onChangeHandler = async (item) => {
    console.log(item)
    try {
      await axios.put(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/wfa-hari/${item.id}`,
        {
          wfa: !item.wfa,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      addToast(exampleToast)
    } catch (error) {
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        setError(error.response.data.message)
      } else {
        // Anything else
        setError('Oops! Something went wrong!')
      }
    }
  }

  const exampleToast = <SuccessToast message={'WFA - hari berhasil diubah'} />

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
    body = <CAlert color="danger">Error: {error}</CAlert>
  } else {
    body = (
      <dl className="row">
        <dt className="col-sm-3">Hari</dt>
        <dt className="col-sm-9">WFA</dt>

        {data.map((item) => (
          <>
            <dd className="col-sm-3">{item.nama}</dd>
            <dd className="col-sm-9">
              <CFormSwitch
                label={item.wfa ? 'Ya' : 'Tidak'}
                id="formSwitchCheckDefault"
                defaultChecked={item.wfa}
                onChange={() => onChangeHandler(item)}
              />
            </dd>
          </>
        ))}
      </dl>
    )
  }

  return (
    <>
      <h1 className="text-center">WFA - Hari</h1>
      {body}
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </>
  )
}

export default WfaHari
