import { Flex } from 'antd'
import styled from 'styled-components'
import ProjectsList from './components/ProjectsList'
import { getThemeToken } from '../../utils/styles'
import GroupsList from './components/GroupsList'
const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const _ProjectsList = styled(ProjectsList)`
  width: 100%;
  height: 100%;
`
const _GroupsList = styled(GroupsList)`
  width: 100%;
  height: 100%;
`
const Dashboard = () => {
  return (
    <Wrapper justify="center" align="start" gap={'large'}>
      <_ProjectsList />
      <_GroupsList />
    </Wrapper>
  )
}

export default Dashboard
