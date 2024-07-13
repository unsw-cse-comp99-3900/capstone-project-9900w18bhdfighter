import {
  UserProfileDTO,
  UserProfileSlim,
  UserProfileSlimDTO,
} from '../types/user'
import api from './config'

const getUserById = async (id: number) => {
  return api.get<{ data: UserProfileDTO }>(`api/users/${id}`)
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
export { getUserById, mapUserSlimProfileDTOUserProfileSlim }
