import { RoleNumber } from '../constant/role'
import {
  UserProfileDTO,
  UserProfileSlim,
  UserProfileSlimDTO,
} from '../types/user'
import api from './config'

const getUserById = async (id: number) => {
  return api.get<{ data: UserProfileDTO }>(`api/users/${id}`)
}

const getAutoCompleteByParams = async (
  emailSubstring: string | null = null,
  role: RoleNumber | null = null,
  nameSubstring: string | null = null,
  notInGroup: boolean | null = null
) => {
  return api.get<{
    data: UserProfileSlimDTO[]
  }>('api/users/autocomplete', {
    params: {
      email_substring: emailSubstring,
      role: role,
      nameSubstring: nameSubstring,
      not_in_group: notInGroup,
    },
  })
}
//mapper
const mapUserSlimProfileDTOUserProfileSlim: (
  _userProfileDTO: UserProfileSlimDTO
) => UserProfileSlim = (userProfileDTO: UserProfileSlimDTO) => {
  return {
    id: userProfileDTO.UserID,
    firstName: userProfileDTO.FirstName,
    lastName: userProfileDTO.LastName,
    email: userProfileDTO.EmailAddress,
    role: userProfileDTO.UserRole,
  }
}
export {
  getUserById,
  mapUserSlimProfileDTOUserProfileSlim,
  getAutoCompleteByParams,
}
