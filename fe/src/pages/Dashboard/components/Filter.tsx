import { Select as _Select } from 'antd'
import styled from 'styled-components'

const Select = styled(_Select)`
  width: 10rem;

  .ant-select-selector {
    box-shadow: none !important;
  }
`

const Filter = () => {
  return (
    <Select
      defaultValue={'2'}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={[
        { value: '1', label: 'My' },
        { value: '2', label: 'All' },
        { value: '3', label: 'Assigned By Me' },
      ]}
    />
  )
}

export default Filter
