import { Select, Spin } from 'antd'
import React, { ReactNode, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  getAutoCompleteGroups,
  mapGroupDTOToGroup,
} from '../../../api/groupAPI'
import { debounce } from '../../../utils/optimize'
import { Group } from '../../../types/group'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import { useProjectDetailContext } from '../../../context/ProjectDetailContext'

const SearchBar = styled(Select)`
  width: 100%;
`
interface GroupValue {
  label: ReactNode
  value: number
}
const GroupSearchBar = () => {
  const [fetching, setFetching] = useState(false)
  const [value, setValue] = useState<number | null>()
  const [options, setOptions] = useState<GroupValue[]>([])
  const autoCompGroups = useRef<Group[]>([])
  const { msg } = useGlobalComponentsContext()
  const { addGroup, project } = useProjectDetailContext()
  const debounceFetcher = useMemo(() => {
    const loadOptions = async (val: string) => {
      setOptions([])
      if (val.trim() === '') return
      setFetching(true)
      try {
        const res = await getAutoCompleteGroups(val)
        autoCompGroups.current = res.data.data.map(mapGroupDTOToGroup)
        setOptions(
          autoCompGroups.current.map((group) => ({
            label: group.groupName,
            value: group.groupId,
          }))
        )
      } catch (e) {
        msg.err('Failed to fetch groups')
      }

      setFetching(false)
    }
    return debounce(loadOptions, 500)
  }, [])
  const handleSelect = async (newValue: unknown) => {
    if (!project) return
    await addGroup({ GroupID: newValue as number, ProjectID: project.id })
    setValue(null)
  }
  return (
    <SearchBar
      filterOption={false}
      showSearch
      options={options}
      onSearch={debounceFetcher}
      loading={fetching}
      placeholder="Type name to search groups"
      value={value}
      onSelect={handleSelect}
      notFoundContent={fetching ? <Spin size="small" /> : 'No data'}
    ></SearchBar>
  )
}

export default GroupSearchBar
