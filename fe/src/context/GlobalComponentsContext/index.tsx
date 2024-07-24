import { message } from 'antd'
import type { MessageInstance, NoticeType } from 'antd/es/message/interface'
import { ReactNode, createContext, useContext } from 'react'
//for Message,Notification...
type Props = {
  children: ReactNode
}
export interface MsgHandler {
  success: ReturnType<typeof useMessageHandler>
  err: ReturnType<typeof useMessageHandler>
  warn: ReturnType<typeof useMessageHandler>
  info: ReturnType<typeof useMessageHandler>
}
interface GlobalComponentsContextType {
  msg: MsgHandler
}
const GlobalComponentsContext = createContext<GlobalComponentsContextType>(
  {} as GlobalComponentsContextType
)
export const useGlobalComponentsContext = () =>
  useContext(GlobalComponentsContext)

export const useMessageHandler = (msg: MessageInstance, type: NoticeType) => {
  return (content: string) => msg.open({ type, content })
}
export const GlobalComponentProvider = ({ children }: Props) => {
  const [_msg, ctxHolder] = message.useMessage()

  const msg = {
    success: useMessageHandler(_msg, 'success'),
    err: useMessageHandler(_msg, 'error'),
    warn: useMessageHandler(_msg, 'warning'),
    info: useMessageHandler(_msg, 'info'),
  }
  const ctx = {
    msg,
  }
  return (
    <GlobalComponentsContext.Provider value={ctx}>
      {ctxHolder}
      {children}
    </GlobalComponentsContext.Provider>
  )
}

export default GlobalComponentProvider
