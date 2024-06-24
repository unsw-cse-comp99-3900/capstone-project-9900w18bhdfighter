type UserRole = 'ADMIN' | 'USER' | 'TUTOR' | 'STUDENT' | 'CORD'

interface UserInfo {
  id: number
  name: string
  email: string
  role: UserRole
}
interface UserDTO {
  UserID: number
  FirstName: string
  LastName: string
  EmailAddress: string
  Passwd: string
}

type UserSignup = Omit<UserDTO, 'UserID'>
export { UserInfo, UserDTO, UserSignup }
