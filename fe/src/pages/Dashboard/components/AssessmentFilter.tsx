import { Select as _Select } from 'antd'
import styled from 'styled-components'
import { Project } from '../../../types/proj'
import { Dispatch, SetStateAction } from 'react'

const Select = styled(_Select)`
  width: 10rem;

  .ant-select-selector {
    box-shadow: none !important;
  }
`
type Props = {
  list: Project[]
  setFilteredLists: Dispatch<SetStateAction<Project[]>>
}
const AssessmentFilter = ({ list, setFilteredLists }: Props) => {
  return (
    <Select
      defaultValue={1}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={[
        { value: 1, label: 'All' },
        { value: 2, label: 'Marked' },
        { value: 3, label: 'UnMarked' },
      ]}
      onSelect={async (value) => {
        switch (value) {
          case 1:
            setFilteredLists(list)
            break
          case 2:
            break
          case 3:
            break
          default:
            break
        }
      }}
    />
  )
}

export default AssessmentFilter
