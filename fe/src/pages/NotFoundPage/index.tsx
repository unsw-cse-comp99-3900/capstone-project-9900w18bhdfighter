import { Flex } from 'antd'
import styled from 'styled-components'
import { getThemeColor as c } from '../../utils/styles'

const Wrapper = styled(Flex)`
  height: 100vh;
  background-color: ${c('basicBg')};
`
const NotFoundPage = () => {
  return (
    <Wrapper justify="center" align="center">
      404 Not Found
    </Wrapper>
  )
}

export default NotFoundPage
