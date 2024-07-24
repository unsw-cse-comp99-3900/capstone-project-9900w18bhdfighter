import { useState } from 'react'
import UserSearchBar from '../../../components/UserSearchBar'
import { UserProfileSlim } from '../../../types/user'
import {
  getAutoCompleteByParams,
  mapUserSlimProfileDTOUserProfileSlim,
} from '../../../api/userAPI'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import { useAuthContext } from '../../../context/AuthContext'
import { role } from '../../../constant/role'

type Props = {
  handleSelect: (_id: number) => Promise<void>
}

const CandidateSearchBar = ({ handleSelect }: Props) => {
  const [potentialMembers, setPotentialMembers] = useState<UserProfileSlim[]>(
    []
  )
  const { usrInfo } = useAuthContext()
  const autoCompUserWithoutSelf = potentialMembers.filter(
    (user) => user.email !== usrInfo?.email
  )
  const { msg } = useGlobalComponentsContext()
  return (
    <UserSearchBar
      handleChange={async (option) => {
        handleSelect(option.value)
      }}
      getAutoCompleteUsers={async (val) => {
        try {
          const res = await getAutoCompleteByParams(
            null,
            role.STUDENT,
            val,
            true
          )
          setPotentialMembers(
            res.data.data.map(mapUserSlimProfileDTOUserProfileSlim)
          )
          //清空搜索框
        } catch (e) {
          msg.err('Failed to fetch contacts')
        }
      }}
      setCurrAutoCompleteUser={setPotentialMembers}
      autoCompUserWithoutSelf={autoCompUserWithoutSelf}
      placeholder="Type name to add a member"
    />
  )
}

export default CandidateSearchBar
