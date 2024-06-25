import { Select as _Select } from 'antd'
import styled from 'styled-components'

const Select = styled(_Select)`
  width: 10rem;

  .ant-select-selector {
    box-shadow: none !important;
  }
`

const RoleFilter = () => {
  return (
    <Select
      defaultValue={'1'}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={[
        { value: '1', label: 'All' },
        { value: '2', label: 'Admin' },
        { value: '3', label: 'Tutor' },
        { value: '4', label: 'Student' },
        { value: '5', label: 'Client' },
      ]}
    />
  )
}

export default RoleFilter
