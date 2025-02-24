import React, { useState, useEffect, useContext } from 'react'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPlus } from '@coreui/icons'
import {
  CAlert,
  CButton,
  CCol,
  CListGroup,
  CListGroupItem,
  CRow,
  CSpinner,
} from '@coreui/react-pro'
import SelectTahun from '../../components/kehadiran/SelectTahun'
import TambahHariLiburModal from '../../components/kehadiran/TambahHariLiburModal'
import HapusHariLiburModal from '../../components/kehadiran/HapusHariLiburModal'
import axios from 'axios'
import { KeycloakContext } from 'src/context'

const HariLibur = () => {
  console.debug('rendering... HariLibur')

  const date = new Date()

  const [id, setId] = useState()
  const [tanggal, setTanggal] = useState()
  const [tahun, setTahun] = useState(date.getFullYear())
  const [bulan, setBulan] = useState()
  const [januari, setJanuari] = useState([])
  const [februari, setFebruari] = useState([])
  const [maret, setMaret] = useState([])
  const [april, setApril] = useState([])
  const [mei, setMei] = useState([])
  const [juni, setJuni] = useState([])
  const [juli, setJuli] = useState([])
  const [agustus, setAgustus] = useState([])
  const [september, setSeptember] = useState([])
  const [oktober, setOktober] = useState([])
  const [november, setNovember] = useState([])
  const [desember, setDesember] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [isOpenTambahModal, setIsOpenTambahModal] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [isOpenHapusModal, setIsOpenHapusModal] = useState(false)

  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    setTahun(new Date().getFullYear())
  }, [])

  useEffect(() => {
    setLoading(true)
    if (tahun) {
      axios
        .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/hari-libur`, {
          params: {
            tahun,
          },
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        })
        .then((response) => {
          const jan = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '01'
          })
          setJanuari(jan)
          const feb = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '02'
          })
          setFebruari(feb)
          const mar = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '03'
          })
          setMaret(mar)
          const apr = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '04'
          })
          setApril(apr)
          const mei = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '05'
          })
          setMei(mei)
          const jun = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '06'
          })
          setJuni(jun)
          const jul = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '07'
          })
          setJuli(jul)
          const agu = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '08'
          })
          setAgustus(agu)
          const sep = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '09'
          })
          setSeptember(sep)
          const okt = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '10'
          })
          setOktober(okt)
          const nov = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '11'
          })
          setNovember(nov)
          const des = response.data.hariLibur.filter((row) => {
            return row.tanggal.split('-')[1] === '12'
          })
          setDesember(des)
        })
        .catch((error) => {
          setError(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [tahun, toggle])

  const onAdd = () => {
    setIsOpenTambahModal(false)
    setToggle(!toggle)
  }

  const formatTanggal = (tanggal) => {
    const spltted = tanggal.split('-')
    return parseInt(spltted[2])
  }

  const showTambahModal = (bulan) => {
    setBulan(bulan)
    setIsOpenTambahModal(true)
  }

  const showHapusModal = (tanggal, id) => {
    setIsOpenHapusModal(true)
    setTanggal(tanggal)
    setId(id)
  }

  const closeHapusModal = () => {
    setIsOpenHapusModal(false)
  }

  const onDelete = () => {
    setIsOpenHapusModal(false)
    setToggle(!toggle)
  }

  let liburList

  if (loading) {
    liburList = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    liburList = (
      <CAlert show className="w-100" color="danger">
        Error: {error.message}
      </CAlert>
    )
  } else {
    const janList = januari.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const febList = februari.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const marList = maret.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const aprList = april.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const meiList = mei.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const junList = juni.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const julList = juli.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const aguList = agustus.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const sepList = september.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const oktList = oktober.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const novList = november.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    const desList = desember.map((el) => (
      <CListGroupItem
        className="text-danger d-flex justify-content-between align-items-center"
        key={el.id}
      >
        {formatTanggal(el.tanggal)}
        <CButton
          size="sm"
          color="danger"
          shape="rounded-pill"
          variant="outline"
          onClick={() => showHapusModal(el.tanggal, el.id)}
        >
          <CIcon icon={cilDelete} size="sm" />
        </CButton>
      </CListGroupItem>
    ))
    liburList = (
      <CRow>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Januari
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(1)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {janList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Februari
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(2)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {febList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Maret
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(3)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {marList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              April
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(4)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {aprList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Mei
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(5)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {meiList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Juni
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(6)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {junList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Juli
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(7)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {julList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Agustus
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(8)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {aguList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              September
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(9)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {sepList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Oktober
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(10)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {oktList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              November
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(11)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {novList}
          </CListGroup>
        </CCol>
        <CCol lg="2" md="4" className="mb-4">
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center" active>
              Desember
              <CButton
                size="sm"
                color="info"
                shape="rounded-pill"
                onClick={() => showTambahModal(12)}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            </CListGroupItem>
            {desList}
          </CListGroup>
        </CCol>
      </CRow>
    )
  }

  return (
    <>
      <div className="row justify-content-md-center">
        <CCol lg="2" md="4" className="mb-4">
          <SelectTahun
            setSelect={(id) => setTahun(id)}
            end={2020}
            start={date.getFullYear() + 1}
            tahun={tahun}
          />
        </CCol>
      </div>
      {liburList}
      {isOpenTambahModal && (
        <TambahHariLiburModal
          tahun={parseInt(tahun)}
          bulan={bulan}
          visible={isOpenTambahModal}
          setVisible={setIsOpenTambahModal}
          added={onAdd}
        />
      )}
      {isOpenHapusModal && (
        <HapusHariLiburModal
          id={id}
          visible={isOpenHapusModal}
          setVisible={setIsOpenHapusModal}
          tanggal={tanggal}
          close={closeHapusModal}
          deleted={onDelete}
        />
      )}
    </>
  )
}

export default HariLibur
