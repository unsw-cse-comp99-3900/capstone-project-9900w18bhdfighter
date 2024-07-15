import { useMemo } from 'react'
import { ids_to_channel_id } from '../../../utils/parse'
import { Contact, MsgGrouped } from '../../../types/msg'

type Props = {
  contactList: Contact[] | null
  msgMap: MsgGrouped | null
  id: number | undefined
}

const useContactsDiff = ({ contactList, msgMap, id }: Props) => {
  return useMemo(() => {
    if (!contactList || !id || !msgMap) return null

    const contactIds = contactList.map((contact) => contact.contact.id).sort()

    const channelKeys = Object.keys(msgMap)

    const currChannelKeys = contactIds.map((contact_id) =>
      ids_to_channel_id([id, contact_id])
    )

    const res = channelKeys.filter((key) => !currChannelKeys.includes(key))
    console.log('res', res)
    return Array.from(new Set(res)).sort()
  }, [contactList, msgMap, id])
}

export default useContactsDiff
