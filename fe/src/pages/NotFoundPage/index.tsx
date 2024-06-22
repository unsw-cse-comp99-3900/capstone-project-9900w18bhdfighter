import { Flex, Typography } from 'antd'
import styled from 'styled-components'
import { getThemeColor as c } from '../../utils/styles'

const Wrapper = styled(Flex)`
  height: 100%;
  background-color: ${c('basicBg')};
`
const NotFoundPage = () => {
  return (
    <Wrapper justify="center" align="center">
      <Typography.Title> 404 Page Not Found</Typography.Title>
    </Wrapper>
  )
}

export default NotFoundPage
