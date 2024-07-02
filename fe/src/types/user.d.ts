type UserRole = 1 | 2 | 3 | 4 | 5

interface Area {
  id: number
  name: string
}
interface AreaDTO {
  AreaID: number
  AreaName: string
}
interface UserInfo {
  id: number
  firstName: string
  lastName: string
  email: string
  role: UserRole
  description: string
  interestAreas: Area[]
}

interface UserDTO {
  UserID: number
  FirstName: string
  LastName: string
  EmailAddress: string
  Passwd: string
}
interface UserProfileDTO {
  UserID: number
  FirstName: string
  LastName: string
  EmailAddress: string
  UserRole: UserRole
  UserInformation: string
  Areas: AreaDTO[]
}
interface UserUpdate {
  FirstName: string
  LastName: string
  EmailAddress: string
  Passwd?: string
  UserRole: UserRole
  UserInformation: string
  Areas: number[]
}

type UserSignup = Omit<UserDTO, 'UserID'>
type UserLogin = Pick<UserDTO, 'EmailAddress' | 'Passwd'>
type UserInfoSlimDTO = Omit<UserDTO, 'Passwd'> & { UserRole: UserRole }
export {
  UserInfo,
  UserDTO,
  UserSignup,
  UserLogin,
  UserRole,
  UserInfoSlimDTO,
  Area,
  AreaDTO,
  UserUpdate,
  UserProfileDTO,
}
