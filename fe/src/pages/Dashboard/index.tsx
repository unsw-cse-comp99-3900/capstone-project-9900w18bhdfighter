import { Flex, Tabs } from 'antd'
import type { TabsProps } from 'antd/es/tabs'

import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { role } from '../../constant/role'
import { useAuthContext } from '../../context/AuthContext'
import { useGlobalConstantContext } from '../../context/GlobalConstantContext'
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
const _AllocationList = styled(AllocationList)``

const Dashboard = () => {
  const [activeKey, setActiveKey] = useState('projectList')
  const { isInRoleRange } = useAuthContext()
  const { isDueGroupFormation } = useGlobalConstantContext()
  const reRender = useRef(0)
  const showSubmission = useMemo(() => {
    if (isInRoleRange([role.STUDENT])) {
      if (isDueGroupFormation) {
        return true
      }
    }
    return false
  }, [isDueGroupFormation, isInRoleRange])
  useEffect(() => {
    const savedActiveKey = sessionStorage.getItem('activeTabKey')

    if (savedActiveKey) {
      if (savedActiveKey === 'submission' && !showSubmission) {
        setActiveKey('projectList')
      } else {
        setActiveKey(savedActiveKey)
      }
    }
  }, [])

  const items: TabsProps['items'] = [
    {
      key: 'projectList',
      label: 'Projects',
      children: <_ProjectsList reRender={reRender} />,
    },
    {
      key: 'groupList',
      label: 'Groups',
      children: <_GroupsList />,
    },
    ...(isInRoleRange([role.ADMIN, role.CORD, role.TUTOR])
      ? [
          {
            key: 'allocation',
            label: 'Allocation',
            children: <_AllocationList reRender={reRender} />,
          },
        ]
      : []),
    ...(showSubmission
      ? [
          {
            key: 'submission',
            label: 'Submission',
            children: <SubmissionTab />,
          },
        ]
      : []),
    ...(isInRoleRange([role.ADMIN, role.CORD, role.TUTOR])
      ? [
          {
            key: 'assessment',
            label: 'Assessment',
            children: <_GroupsAssessmentList />,
          },
        ]
      : []),
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
