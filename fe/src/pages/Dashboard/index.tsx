import { Flex, Tabs } from 'antd'
import type { TabsProps } from 'antd/es/tabs'

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { getThemeColor, getThemeToken } from '../../utils/styles'
import AllocationList from './components/AllocationList'
import GroupsAssessmentList from './components/GroupAssessmentList'
import GroupsList from './components/GroupsList'
import ProjectsList from './components/ProjectsList'
import SubmissionTab from './components/SubmissionTab'
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

const _ProjectsList = styled(ProjectsList)``
const _GroupsList = styled(GroupsList)``
const _GroupsAssessmentList = styled(GroupsAssessmentList)``
const Dashboard = () => {
  const [activeKey, setActiveKey] = useState('projectList')
  const _AllocationList = styled(AllocationList)``
  useEffect(() => {
    const savedActiveKey = sessionStorage.getItem('activeTabKey')
    if (savedActiveKey) {
      setActiveKey(savedActiveKey)
    }
  }, [])

  const items: TabsProps['items'] = [
    {
      key: 'projectList',
      label: 'Projects',
      children: <_ProjectsList />,
    },
    {
      key: 'groupList',
      label: 'Groups',
      children: <_GroupsList />,
    },
    {
      key: 'allocation',
      label: 'Allocation',
      children: <_AllocationList />,
    },
    {
      key: 'submission',
      label: 'Submission',
      children: <SubmissionTab />,
    },
    {
      key: 'assessment',
      label: 'Assessment',
      children: <_GroupsAssessmentList />,
    },
  ]
  const handleTabChange = (key: string) => {
    setActiveKey(key)
    sessionStorage.setItem('activeTabKey', key)
  }
  return (
    <Wrapper vertical gap={'large'}>
      <_Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        indicator={{ size: (origin) => origin - 20, align: 'center' }}
        tabBarStyle={{
          padding: '0 1rem',

          marginBottom: 0,
        }}
        items={items}
      ></_Tabs>
    </Wrapper>
  )
}

export default Dashboard
