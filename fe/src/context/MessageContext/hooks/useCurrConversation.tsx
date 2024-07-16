import { useMemo } from 'react'
import { ids_to_channel_id } from '../../../utils/parse'
import { Contact, MsgGrouped } from '../../../types/msg'

interface Props {
  contactList: Contact[] | null
  receiverId: string | number | undefined
  msgMap: MsgGrouped | null
  id: number | undefined
  type: 'user' | 'group' | undefined
}
const useCurrConversation = ({
  contactList,
  receiverId,
  msgMap,
  id,
  type,
}: Props) => {
  return useMemo(() => {
    if (!contactList || !receiverId || !id || !msgMap || type !== 'user')
      return null

    const currContact = contactList.find(
      (contact) => contact.contact.id === Number(receiverId)
    )
    if (!currContact) return null

    const channelKey = ids_to_channel_id([id, currContact.contact.id])
    return {
      ...currContact,
      messages: msgMap[channelKey] || [],
    }
  }, [contactList, receiverId, msgMap, id, type])
}

export default useCurrConversation
