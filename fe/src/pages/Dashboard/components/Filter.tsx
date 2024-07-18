import { Select as _Select } from 'antd'
import styled from 'styled-components'
import { Project } from '../../../types/proj'
import { Dispatch, SetStateAction, useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import {
  getProjectByParticipant,
  mapProjectDTOToProject,
} from '../../../api/projectAPI'
import { errHandler } from '../../../utils/parse'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'

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
const Filter = ({ list, setFilteredLists }: Props) => {
  const { usrInfo } = useAuthContext()
  const [participated, setParticipated] = useState<Project[] | null>(null)
  const { msg } = useGlobalComponentsContext()
  const fetchParticipated = async (id: number) => {
    try {
      const res = await getProjectByParticipant(id)
      setParticipated(res.data.map(mapProjectDTOToProject))
      setFilteredLists(res.data.map(mapProjectDTOToProject))
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }

  return (
    <Select
      defaultValue={1}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={[
        { value: 1, label: 'All' },
        { value: 2, label: 'As a Participant' },
        { value: 3, label: 'As a Owner' },
        { value: 4, label: 'As a Creator' },
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
          case 3:
            setFilteredLists(
              list.filter((p) => p.projectOwnerId === usrInfo?.id)
            )
            break
          case 4:
            setFilteredLists(list.filter((p) => p.createdBy === usrInfo?.id))
            break
          default:
            break
        }
      }}
    />
  )
}

export default Filter
