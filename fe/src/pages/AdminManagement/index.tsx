import styled from 'styled-components'
import AccountManagementContextProvider from '../../context/ManagementContext'
import { getThemeColor, getThemeToken } from '../../utils/styles'
import AccountManagement from './components/AccountManagement'
import { Flex, Tabs } from 'antd'
import { TabsProps } from 'antd/lib'
import TimeManagement from './components/TimeManagement'
import { useEffect, useState } from 'react'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const _Tabs = styled(Tabs)`
  width: 100%;
  height: 100%;
  .ant-tabs-ink-bar {
    background-color: ${getThemeColor('highlight')};
    height: 3px !important;
  }
`
const sessionKey = 'management-activeTabKey'
const _AdminManagement = () => {
  const [activeKey, setActiveKey] = useState('account')
  const handleChange = (key: string) => {
    setActiveKey(key)
    sessionStorage.setItem(sessionKey, key)
  }
  useEffect(() => {
    const savedActiveKey = sessionStorage.getItem(sessionKey)
    if (savedActiveKey) {
      setActiveKey(savedActiveKey)
    }
  })
  const items: TabsProps['items'] = [
    {
      key: 'account',
      label: 'Account',
      children: <AccountManagement />,
    },
    {
      key: 'TimeRule',
      label: 'Time Rule',
      children: <TimeManagement />,
    },
  ]
  return (
    <Wrapper>
      <_Tabs
        items={items}
        activeKey={activeKey}
        onChange={handleChange}
      ></_Tabs>
    </Wrapper>
  )
}

const AdminManagement = () => {
  return (
    <AccountManagementContextProvider>
      <_AdminManagement />
    </AccountManagementContextProvider>
  )
}

export default AdminManagement
