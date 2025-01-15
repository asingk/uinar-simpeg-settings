import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const GET_DAFTAR_SSO_ROLE = gql`
  query DaftarSsoRole {
    daftarSsoRole {
      code
      description
    }
  }
`

const SelectSsoRole = (props) => {
  const { loading, error, data } = useQuery(GET_DAFTAR_SSO_ROLE)

  if (loading) {
    return <p className="text-center">Loading..</p>
  }
  if (error) {
    return <p className="text-center">Error.. :-(</p>
  }

  let options = [{ label: '-- Pilih Role SSO --', value: '' }]
  data.daftarSsoRole.forEach((row) => {
    let opt = {
      label: row.description,
      value: row.code,
    }
    options.push(opt)
  })

  return (
    <CFormSelect
      aria-label="Default select grade"
      defaultValue={props.code}
      options={options}
      onChange={(e) => props.setSsoRole(e.target.value)}
    />
  )
}

SelectSsoRole.propTypes = {
  code: PropTypes.string,
  setSsoRole: PropTypes.func,
}

export default SelectSsoRole
