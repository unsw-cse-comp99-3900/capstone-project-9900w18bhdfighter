import { Select as _Select } from 'antd'
import styled from 'styled-components'
import { Group } from '../../../types/group'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import {
  getGroupByParticipant,
  mapGroupDTOToGroup,
} from '../../../api/groupAPI'

const Select = styled(_Select)`
  width: 10rem;

  .ant-select-selector {
    box-shadow: none !important;
  }
`

type Props = {
  list: Group[]
  setFilteredLists: Dispatch<SetStateAction<Group[]>>
}

const GroupFilter = ({ list, setFilteredLists }: Props) => {
  const { usrInfo } = useAuthContext()
  const [participated, setParticipated] = useState<Group[] | null>(null)

  const fetchParticipated = async (id: number) => {
    const res = await getGroupByParticipant(id)
    return res.data.map(mapGroupDTOToGroup)
  }

  useEffect(() => {
    if (usrInfo) {
      fetchParticipated(usrInfo.id).then(setParticipated)
    }
  }, [usrInfo])

  return (
    <Select
      defaultValue={1}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={[
        { value: 1, label: 'All' },
        { value: 2, label: 'As a Participant' },
      ]}
      onSelect={async (value) => {
        switch (value) {
          case 1:
            setFilteredLists(list)
            break
          case 2:
            if (!usrInfo) return
            if (!participated) {
              const res = await fetchParticipated(usrInfo.id)
              setParticipated(res)
              setFilteredLists(res)
            } else {
              setFilteredLists(participated)
            }
            break
          default:
            break
        }
      }}
    />
  )
}

export default GroupFilter
