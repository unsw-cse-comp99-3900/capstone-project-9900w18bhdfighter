import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  getGroupDetailByGroupId,
  joinGroup,
  leaveGroup,
  mapGroupDTOToGroup,
  updateGroupMeta,
} from '../../api/groupAPI'
import { useParams } from 'react-router-dom'
import { Group, GroupPreferenceReqDTO, GroupReqDTO } from '../../types/group'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { errHandler } from '../../utils/parse'
import { useAuthContext } from '../AuthContext'
import { getUserById } from '../../api/userAPI'
import { mapUserProfileDTOToUserInfo } from '../AccountManagementContext/mapper'
import {
  lockGroupPreference,
  updateGroupPreference,
} from '../../api/groupPreferenceAPI'

interface GroupDetailContextType {
  fetchGroupDetail: () => Promise<void>
  group: Group | null
  joinOrLeave: () => Promise<void>
  updateGroupMetaData: (_groupReqDTO: GroupReqDTO) => Promise<void>
  addMember: (_studentId: number) => Promise<void>
  removeMember: (_studentId: number) => Promise<void>
  isUserInGroup: boolean
  creatorProfile: {
    id: number
    fullName: string
  } | null
  updatePreferences: (_preferences: GroupPreferenceReqDTO[]) => Promise<void>
  lockPreferences: () => Promise<void>
  isGroupPreferenceLocked: boolean
}

const GroupDetailContextType = createContext({} as GroupDetailContextType)

export const useGroupDetailContext = () =>
  useContext<GroupDetailContextType>(GroupDetailContextType)

const GroupDetailContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { usrInfo } = useAuthContext()
  const { id } = useParams()
  const [creatorProfile, setCreatorProfile] = useState<{
    id: number
    fullName: string
  } | null>(null)

  const { msg } = useGlobalComponentsContext()
  const [groupDetail, setGroupDetail] = useState<Group | null>(null)
  const isUserInGroup =
    groupDetail?.groupMembers.some((member) => member.id === usrInfo?.id) ||
    false
  const isGroupPreferenceLocked = useMemo(() => {
    if (!groupDetail) return false
    if (groupDetail.preferences.length === 0) return false
    const isLocked = groupDetail.preferences.some(
      (preference) => preference.lock
    )
    return isLocked
  }, [groupDetail])

  const fetchGroupDetail = async () => {
    if (!id) return
    try {
      const res = await getGroupDetailByGroupId(Number(id))
      setGroupDetail(mapGroupDTOToGroup(res.data))
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const updateGroupMetaData = async (groupReqDTO: GroupReqDTO) => {
    if (!id) return
    try {
      await updateGroupMeta(Number(id), groupReqDTO)
      await fetchGroupDetail()
      msg.success('Group updated successfully!')
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }

  const joinOrLeave = async () => {
    if (!id) return
    if (!usrInfo) return
    const api = isUserInGroup ? leaveGroup : joinGroup
    try {
      await api({
        group_id: Number(id),
        student_id: usrInfo.id,
      })
      await fetchGroupDetail()
      msg.success(`${isUserInGroup ? 'Left' : 'Joined'} group successfully!`)
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const addMember = async (studentId: number) => {
    if (!id) return
    try {
      await joinGroup({
        group_id: Number(id),
        student_id: studentId,
      })
      await fetchGroupDetail()
      msg.success('Added member successfully!')
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const removeMember = async (studentId: number) => {
    if (!id) return
    try {
      await leaveGroup({
        group_id: Number(id),
        student_id: studentId,
      })
      await fetchGroupDetail()
      msg.success('Removed member successfully!')
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const getCreatorProfile = async () => {
    if (!groupDetail) return
    try {
      const res = await getUserById(groupDetail.createdBy)
      const creator = mapUserProfileDTOToUserInfo(res.data.data)
      setCreatorProfile({
        id: creator.id,
        fullName: `${creator.firstName} ${creator.lastName}`,
      })
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const lockPreferences = async () => {
    if (!groupDetail) return
    try {
      await lockGroupPreference(groupDetail.groupId)
      await fetchGroupDetail()
      msg.success('Preferences locked successfully')
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const updatePreferences = async (preferences: GroupPreferenceReqDTO[]) => {
    if (!groupDetail) return
    try {
      await updateGroupPreference(preferences, groupDetail.groupId)
      await fetchGroupDetail()
      msg.success('Preferences updated successfully')
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  useEffect(() => {
    fetchGroupDetail()
  }, [])

  useEffect(() => {
    getCreatorProfile()
  }, [groupDetail])
  const ctx = {
    fetchGroupDetail,
    group: groupDetail,
    joinOrLeave,
    updateGroupMetaData,
    addMember,
    removeMember,
    isUserInGroup,
    creatorProfile,
    updatePreferences,
    lockPreferences,
    isGroupPreferenceLocked,
  }

  return (
    <GroupDetailContextType.Provider value={ctx}>
      {children}
    </GroupDetailContextType.Provider>
  )
}

export default GroupDetailContextProvider
