import { useMemo } from 'react'
import { GroupContact, MsgGrouped } from '../../../types/msg'

interface Props {
  groupsList: GroupContact[] | null
  receiverId: string | number | undefined
  msgMap: MsgGrouped | null
  id: number | undefined
  type: 'user' | 'group' | undefined
}
const useCurrGroupConversation = ({
  groupsList,
  receiverId,
  msgMap,
  id,
  type,
}: Props) => {
  return useMemo(() => {
    if (!groupsList || !receiverId || !id || !msgMap || type !== 'group')
      return null

    const currGroup = groupsList.find(
      (group) => group.groupId === Number(receiverId)
    )
    if (!currGroup) return null

    const channelKey = currGroup.groupId
    return {
      ...currGroup,
      messages: msgMap[channelKey] || [],
    }
  }, [groupsList, receiverId, msgMap, id, type])
}

export default useCurrGroupConversation
