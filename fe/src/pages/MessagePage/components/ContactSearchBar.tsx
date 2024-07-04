import { Flex, Select, Spin, Typography } from 'antd'
import { ReactNode, useMemo, useState } from 'react'
import styled from 'styled-components'
import { debounce } from '../../../utils/optimize'
import { useMessageContext } from '../../../context/MessageContext'
import { roleNames } from '../../../constant/role'

const SearchBar = styled(Select)`
  width: 100%;
`
const Text = styled(Typography.Text)``

interface UserValue {
  label: ReactNode
  value: number
  email: string
  role: string
}

const ContactSearchBar = () => {
  const [fetching, setFetching] = useState(false)
  const [value, setValue] = useState<UserValue>()
  const {
    getAutoCompleteContacts,
    currAutoCompleteContacts,
    setCurrAutoCompleteContacts,
  } = useMessageContext()

  const debounceFetcher = useMemo(() => {
    const loadOptions = async (val: string) => {
      setCurrAutoCompleteContacts([])
      if (val.trim() === '') return
      setFetching(true)
      await getAutoCompleteContacts(val)
      setFetching(false)
    }
    return debounce(loadOptions, 1000)
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
            <Text type="secondary">{option.data.role}</Text>
          </Flex>
        )
      }}
      options={currAutoCompleteContacts.map((contact) => ({
        label: (
          <Text strong>
            {contact.firstName} {contact.lastName}
          </Text>
        ),
        value: contact.id,
        email: contact.email,
        role: roleNames[contact.role],
      }))}
      notFoundContent={fetching ? <Spin size="small" /> : 'No contacts found'}
      onChange={(newValue) => {
        setValue(newValue as UserValue)
      }}
      placeholder="Type email to search"
      loading={fetching}
    />
  )
}

export default ContactSearchBar
