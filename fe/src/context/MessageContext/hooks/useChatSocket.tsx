import { useEffect, useRef } from 'react'
import { WSocket } from '../../../api/config'
import { mapGroupMsgRspDTOToMsg } from '../../../api/msgAPI'
import {
  Contact,
  GroupContact,
  GroupMsgDTO,
  MsgGrouped,
  MsgRspDTO,
  WSMsgRspDTO,
} from '../../../types/msg'
import { MsgHandler } from '../../GlobalComponentsContext'
import { MsgRespDTOMapper } from '../mapper'

interface Props {
  id: number | undefined
  setMsgMap: React.Dispatch<React.SetStateAction<MsgGrouped | null>>
  setGroupMsgMap: React.Dispatch<React.SetStateAction<MsgGrouped | null>>
  setContactList: React.Dispatch<React.SetStateAction<Contact[] | null>>
  setGroupContactList: React.Dispatch<
    React.SetStateAction<GroupContact[] | null>
  >
  msg: MsgHandler
}

const useChatSocket = ({
  id,
  setMsgMap,
  setContactList,
  msg,
  setGroupMsgMap,
  setGroupContactList,
}: Props) => {
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!id) return
    const socket = WSocket(`ws/chat/user/${id}`)
    console.log('socket', socket)

    socketRef.current = socket

    socket.onopen = () => {
      console.log('Connected to the chat server')
    }

    socket.onmessage = (event: MessageEvent) => {
      const res: WSMsgRspDTO = JSON.parse(event.data)
      console.log(event)

      if (res.status_code === 201) {
        console.log(res.data)

        // a msg is sent
        return console.log('msg sent')
      }
      // a msg is received or a msg is sent
      if (res.status_code === 200 && res.status_code < 300) {
        const msgDto = res.data
        const type = res.type

        if (type === 'user') {
          const usr_msg = MsgRespDTOMapper(msgDto as MsgRspDTO)
          console.log('user msg', usr_msg)

          setMsgMap((prev) => {
            const key = usr_msg.ChannelId
            const updatedMap = { ...prev }
            updatedMap[key] = [...(updatedMap[key] || []), usr_msg]
            return updatedMap
          })
          // if new_msg is not read, increment unreadMsgsCount
          if (usr_msg.isRead === false) {
            setContactList((prev) => {
              if (!prev) return prev
              const updatedList = prev.map((contact) => {
                if (contact.contact.id === usr_msg.senderId) {
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
        }
        if (type === 'group') {
          console.log('group msg', msgDto)

          const group_msg = mapGroupMsgRspDTOToMsg(msgDto as GroupMsgDTO, id)
          console.log(group_msg)

          const key = group_msg.receiverId
          setGroupMsgMap((prev) => {
            const updatedMap = { ...prev }
            updatedMap[key] = [...(updatedMap[key] || []), group_msg]
            return updatedMap
          })
          if (group_msg.isRead === false) {
            setGroupContactList((prev) => {
              if (!prev) return prev
              const updatedList = prev.map((group) => {
                if (group.groupId === group_msg.receiverId) {
                  return {
                    ...group,
                    unreadMsgsCount: group.unreadMsgsCount + 1,
                  }
                }
                return group
              })
              return updatedList
            })
          }
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
