import { Select as _Select } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { GroupAss } from '../../../types/groupAsses'

type Props = {
  groupAsslist: GroupAss[]
  setList: React.Dispatch<React.SetStateAction<GroupAss[]>>
}

const Select = styled(_Select)`
  width: 7rem;

  .ant-select-selector {
    box-shadow: none !important;
  }
`
const GroupAssesFilter = ({ groupAsslist, setList }: Props) => {
  return (
    <Select
      defaultValue={1}
      options={[
        { value: 1, label: 'All' },
        { value: 2, label: 'Marked' },
        {
          value: 3,
          label: 'Not Marked',
        },
      ]}
      onSelect={async (value, a) => {
        console.log(a)

        switch (value) {
          case 1:
            setList(groupAsslist)
            break
          case 2:
            setList(groupAsslist.filter((group) => group.groupScore !== null))
            break
          case 3:
            setList(groupAsslist.filter((group) => group.groupScore === null))
            break

          default:
            break
        }
      }}
    ></Select>
  )
}

export default GroupAssesFilter
