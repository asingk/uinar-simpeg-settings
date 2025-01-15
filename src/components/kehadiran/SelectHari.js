import React from 'react'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const SelectHari = (props) => {
  let options = [
    { value: 0, label: 'Pilih Hari', disabled: true },
    { value: 1, label: 'Senin-kamis' },
    { value: 5, label: 'Jumat' },
  ]

  return (
    <CFormSelect
      aria-label="Default select hari"
      defaultValue={props.hari || 0}
      options={options}
      onChange={(e) => props.setSelect(e.target.value)}
    />
  )
}

SelectHari.propTypes = {
  setSelect: PropTypes.func,
  hari: PropTypes.number,
}

export default SelectHari
