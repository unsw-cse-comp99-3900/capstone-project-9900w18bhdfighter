import { Flex, Select, Spin, Typography } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { ReactNode, useMemo, useState } from 'react'
import styled from 'styled-components'
import { debounce } from '../../utils/optimize'
import { Group } from '../../types/group'

const SearchBar = styled(Select)`
  width: 100%;
`
const Text = styled(Typography.Text)``

interface GroupValue {
  label: ReactNode
  value: number
  title: string
  description: string
}

type Props = {
  getAutoCompleteGroups: (_val: string) => Promise<void>
  handleChange: (_val: GroupValue) => Promise<void>
  setCurrAutoCompleteGroup: React.Dispatch<React.SetStateAction<Group[]>>
  autoCompGroupList: Group[]
  handleSelect?: (_val: GroupValue) => void // Add this prop to handle select event
} & Partial<SelectProps>

const GroupSearchBar = ({
  handleChange,
  getAutoCompleteGroups,
  setCurrAutoCompleteGroup,
  autoCompGroupList,
  // handleSelect, // Destructure the new prop here if needed
  ...props
}: Props) => {
  const [fetching, setFetching] = useState(false)
  const [value, setValue] = useState<GroupValue | null>(null) // Initialize with null

  const debounceFetcher = useMemo(() => {
    const loadOptions = async (val: string) => {
      setCurrAutoCompleteGroup([])
      if (val.trim() === '') return
      setFetching(true)
      await getAutoCompleteGroups(val)
      setFetching(false)
    }
    return debounce(loadOptions, 500)
  }, [getAutoCompleteGroups, setCurrAutoCompleteGroup])

  const options = autoCompGroupList.map((group) => ({
    label: <Text strong>{group.groupName}</Text>,
    value: group.groupId,
    title: group.groupName,
    description: group.groupDescription,
  }))

  return (
    <SearchBar
      labelInValue
      value={value}
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      optionRender={(option) => {
        return (
          <Flex vertical>
            <Text strong>{option.label}</Text>
          </Flex>
        )
      }}
      options={options}
      notFoundContent={fetching ? <Spin size="small" /> : 'No groups found'}
      onChange={async (_val, option) => {
        const val = _val as GroupValue
        console.log(option)

        await handleChange(option as GroupValue)
        setValue(val) // Set the selected value
        setCurrAutoCompleteGroup((prev) =>
          prev.filter((group) => group.groupId !== val.value)
        )
        // if (handleSelect) handleSelect(val) // Call the handleSelect function if provided
      }}
      placeholder="Type name to add a group"
      loading={fetching}
      {...props}
    />
  )
}

export default GroupSearchBar
