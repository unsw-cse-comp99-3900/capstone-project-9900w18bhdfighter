import { Flex } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const Projects = () => {
  return <Wrapper>Projects</Wrapper>
}

export default Projects
