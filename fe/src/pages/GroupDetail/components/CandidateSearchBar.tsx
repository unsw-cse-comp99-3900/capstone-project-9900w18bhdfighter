import React, { useState } from 'react'
import UserSearchBar from '../../../components/UserSearchBar'
import { UserProfileSlim } from '../../../types/user'
import { getAutoCompleteContacts } from '../../../api/contactAPI'
import { mapUserSlimProfileDTOUserProfileSlim } from '../../../api/userAPI'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import { useAuthContext } from '../../../context/AuthContext'

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
        //this will get the user id of the selected user
        console.log(option.value)
        handleSelect(option.value)
      }}
      getAutoCompleteUsers={async (val) => {
        try {
          const res = await getAutoCompleteContacts(val)
          setPotentialMembers(
            res.data.data.map(mapUserSlimProfileDTOUserProfileSlim)
          )
        } catch (e) {
          msg.err('Failed to fetch contacts')
        }
      }}
      setCurrAutoCompleteUser={setPotentialMembers}
      autoCompUserWithoutSelf={autoCompUserWithoutSelf}
    ></UserSearchBar>
  )
}

export default CandidateSearchBar
