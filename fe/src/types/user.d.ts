import { Course, CourseRspDTO } from './course'

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
  courseCode: Course | null
}

interface UserProfileDTO {
  UserID: number
  FirstName: string
  LastName: string
  EmailAddress: string
  UserRole: UserRole
  UserInformation: string
  Areas: AreaDTO[]
  CourseCode: CourseRspDTO | null
}
interface UserUpdate {
  FirstName: string
  LastName: string
  EmailAddress: string
  Passwd?: string
  UserRole: UserRole
  UserInformation: string
  CourseCode: number | null
  Areas: number[]
}
interface UserDTO {
  UserID: number
  FirstName: string
  LastName: string
  EmailAddress: string
  Passwd: string
}
type UserSignup = Omit<UserDTO, 'UserID'>
type UserLogin = Pick<UserDTO, 'EmailAddress' | 'Passwd'>
type UserInfoSlimDTO = Omit<UserDTO, 'Passwd'> & { UserRole: UserRole }

type UserProfileSlimDTO = Pick<
  UserProfileDTO,
  'UserID' | 'FirstName' | 'LastName' | 'EmailAddress' | 'UserRole'
>
type UserProfileSlim = Pick<
  UserInfo,
  'id' | 'firstName' | 'lastName' | 'email' | 'role'
>
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
  UserProfileSlimDTO,
  UserProfileSlim,
}
