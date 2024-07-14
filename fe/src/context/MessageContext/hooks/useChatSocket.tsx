import { useEffect, useRef } from 'react'
import { Contact, MsgGrouped } from '../../../types/msg'
import { MsgRespDTOMapper } from '../mapper'
import { MsgHandler } from '../../GlobalComponentsContext'

interface Props {
  id: number | undefined
  setMsgMap: React.Dispatch<React.SetStateAction<MsgGrouped | null>>
  setContactList: React.Dispatch<React.SetStateAction<Contact[] | null>>
  msg: MsgHandler
}

const useChatSocket = ({ id, setMsgMap, setContactList, msg }: Props) => {
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!id) return

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/user/${id}`)
    socketRef.current = socket

    socket.onopen = () => {
      console.log('Connected to the chat server')
    }

    socket.onmessage = (event) => {
      const res = JSON.parse(event.data)
      if (res.status_code === 201) {
        // a msg is sent
      }
      // a msg is received or a msg is sent
      if (res.status_code >= 200 && res.status_code < 300) {
        const msgDto = res.data
        const new_msg = MsgRespDTOMapper(msgDto)
        setMsgMap((prev) => {
          const key = new_msg.ChannelId
          const updatedMap = { ...prev }
          updatedMap[key] = [...(updatedMap[key] || []), new_msg]
          return updatedMap
        })
        // if new_msg is not read, increment unreadMsgsCount
        if (new_msg.isRead === false) {
          setContactList((prev) => {
            if (!prev) return prev
            const updatedList = prev.map((contact) => {
              if (contact.contact.id === new_msg.senderId) {
                return {
                  ...contact,
                  unreadMsgsCount: contact.unreadMsgsCount + 1,
                }
              }
              return contact
            })
            return updatedList
          })
        }
      } else if (res.status_code >= 400) {
        msg.err(res.message)
      } else {
        msg.err('Unknown error')
      }
    }

    return () => {
      console.log('closing socket')
      socketRef.current?.close()
      socketRef.current = null
    }
  }, [id])

  return socketRef
}

export default useChatSocket
