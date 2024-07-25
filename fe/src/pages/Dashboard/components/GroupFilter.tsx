import { Select as _Select } from 'antd'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  getGroupByParticipant,
  mapGroupDTOToGroup,
} from '../../../api/groupAPI'
import { useAuthContext } from '../../../context/AuthContext'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import { Group } from '../../../types/group'
import { errHandler } from '../../../utils/parse'

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
  const { msg } = useGlobalComponentsContext()
  const fetchParticipated = async (id: number) => {
    try {
      const res = await getGroupByParticipant(id)
      setParticipated(res.data.map(mapGroupDTOToGroup))
      setFilteredLists(res.data.map(mapGroupDTOToGroup))
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }

  useEffect(() => {
    if (!usrInfo) return
    fetchParticipated(usrInfo.id)
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
              fetchParticipated(usrInfo.id)
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
