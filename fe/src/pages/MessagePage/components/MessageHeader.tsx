import { Flex, Typography } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { getThemeColor, getThemeToken } from '../../../utils/styles'
import Avatar from '../../../components/Avatar'

const Header = styled(Flex)`
  width: 100%;
  padding-bottom: ${getThemeToken('paddingXS', 'px')};
  border-bottom: 1px solid ${getThemeColor('grayscalePalette', 5)};
  align-items: center;
`
const MessageHeader = () => {
  return (
    <Header gap={'0.5rem'}>
      <Avatar
        style={{
          width: '2.5rem',
          height: '2.5rem',
        }}
        firstName="Hang"
        lastName="H"
        emailForHashToColor="asd"
      />
      <Typography.Title level={4}>Hang</Typography.Title>
    </Header>
  )
}

export default MessageHeader
