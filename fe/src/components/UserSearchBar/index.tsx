import { Flex, Select, Spin, Typography } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { ReactNode, useMemo, useState } from 'react'
import styled from 'styled-components'
import { debounce } from '../../utils/optimize'
import { roleNames } from '../../constant/role'
import { UserProfileSlim } from '../../types/user'

const SearchBar = styled(Select)`
  width: 100%;
`
const Text = styled(Typography.Text)``

interface UserValue {
  label: ReactNode
  value: number
  title: string
  role: string
}
type Props = {
  getAutoCompleteUsers: (_val: string) => Promise<void>
  handleChange: (_val: UserValue) => Promise<void>
  setCurrAutoCompleteUser: React.Dispatch<
    React.SetStateAction<UserProfileSlim[]>
  >
  autoCompUserWithoutSelf: UserProfileSlim[]
} & Partial<SelectProps>
const UserSearchBar = ({
  handleChange,
  getAutoCompleteUsers,
  setCurrAutoCompleteUser,
  autoCompUserWithoutSelf,
  ...props
}: Props) => {
  const [fetching, setFetching] = useState(false)
  const [value, setValue] = useState<UserValue | null>()

  const debounceFetcher = useMemo(() => {
    const loadOptions = async (val: string) => {
      setCurrAutoCompleteUser([])
      if (val.trim() === '') return
      setFetching(true)
      await getAutoCompleteUsers(val)
      setFetching(false)
    }
    return debounce(loadOptions, 500)
  }, [])

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
            <Text type="secondary">{option.data.email}</Text>
          </Flex>
        )
      }}
      options={autoCompUserWithoutSelf.map((contact) => ({
        label: (
          <Text strong>
            {contact.firstName} {contact.lastName}
          </Text>
        ),
        value: contact.id,
        title: contact.email,
        role: roleNames[contact.role],
      }))}
      notFoundContent={fetching ? <Spin size="small" /> : 'No users found'}
      onChange={async (val) => {
        await handleChange(val as UserValue)
        setValue(null)
      }}
      placeholder="Type email to add a user"
      loading={fetching}
      {...props}
    />
  )
}

export default UserSearchBar
