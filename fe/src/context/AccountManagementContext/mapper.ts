import { AreaDTO, UserInfo, UserProfileDTO } from '../../types/user'

const mapUserProfileDTOToUserInfo = (
  userProfileDTO: UserProfileDTO
): UserInfo => {
  return {
    id: userProfileDTO.UserID,
    firstName: userProfileDTO.FirstName,
    lastName: userProfileDTO.LastName,
    email: userProfileDTO.EmailAddress,
    role: userProfileDTO.UserRole,
    description: userProfileDTO.UserInformation,
    interestAreas: userProfileDTO.Areas.map((area: AreaDTO) => ({
      id: area.AreaID,
      name: area.AreaName,
    })),
  }
}

export { mapUserProfileDTOToUserInfo }
