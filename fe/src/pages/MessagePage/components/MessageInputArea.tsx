import { Button, Flex, Input } from 'antd'
import styled from 'styled-components'
import { getThemeColor } from '../../../utils/styles'
import { useState } from 'react'
import { useMessageContext } from '../../../context/MessageContext'
import { WSMsgReqDTO } from '../../../types/msg'

const InputBox = styled(Flex)`
  width: 100%;
  background-color: ${getThemeColor('basicBg')};
  flex-direction: column;
  justify-self: flex-end;
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
  const [value, setValue] = useState('')
  const { params, conversationType, sendWSMsg } = useMessageContext()
  return (
    <InputBox>
      <InputArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoSize={{ minRows: 1, maxRows: 6 }}
        placeholder="Type a message"
      />
      <SendButton
        onClick={() => {
          if (!value || !params.receiverId || !conversationType) return
          const msg: WSMsgReqDTO = {
            action: 'NEW_MESSAGE',
            type: conversationType,
            payload: {
              content: value,
              receiverId: parseInt(params.receiverId),
            },
          }
          sendWSMsg(msg)
          setValue('')
        }}
        type="link"
      >
        Send
      </SendButton>
    </InputBox>
  )
}

export default MessageInputArea
