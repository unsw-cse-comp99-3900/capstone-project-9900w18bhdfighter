import { Flex, Tabs } from 'antd'
import type { TabsProps } from 'antd/es/tabs'
import styled, { useTheme } from 'styled-components'
import ProjectsList from './components/ProjectsList'
import { getThemeToken } from '../../utils/styles'
import GroupsList from './components/GroupsList'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const _Tabs = styled(Tabs)`
  width: 100%;
  height: 100%;
`
const _ProjectsList = styled(ProjectsList)``
const _GroupsList = styled(GroupsList)``
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
    children: <_GroupsList />,
  },
]
const Dashboard = () => {
  const theme = useTheme()
  return (
    <Wrapper justify="center" align="start" gap={'large'}>
      <_Tabs
        indicator={{ size: (origin) => origin - 20, align: 'center' }}
        tabBarStyle={{
          padding: '0 1rem',
          backgroundColor: theme.themeColor.highlight,
          marginBottom: 0,
        }}
        items={items}
      ></_Tabs>
    </Wrapper>
  )
}

export default Dashboard
