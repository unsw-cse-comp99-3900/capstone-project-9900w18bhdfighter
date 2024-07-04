import { Button, Flex, Input } from 'antd'
import styled from 'styled-components'
import { getThemeColor } from '../../../utils/styles'

const InputBox = styled(Flex)`
  width: 100%;
  background-color: ${getThemeColor('basicBg')};
  flex-direction: column;
`
const InputArea = styled(Input.TextArea)`
  width: 100%;
  background-color: ${({ theme }) => theme.colorBgBase};
  border: none;
  border-top: 2px solid transparent;

  &:hover {
    border: none;
    border-top: 2px solid transparent;
    box-shadow: none;
    outline: none;
  }
  &:focus {
    border: none;
    border-top: 2px solid ${getThemeColor('highlight')};
    box-shadow: none;
    outline: none;
  }
`
const SendButton = styled(Button)`
  width: fit-content;
  align-self: flex-end;
`

const MessageInputArea = () => {
  return (
    <InputBox>
      <InputArea
        autoSize={{ minRows: 1, maxRows: 6 }}
        placeholder="Type a message"
      />
      <SendButton type="link">Send</SendButton>
    </InputBox>
  )
}

export default MessageInputArea
