type UserRole = 1 | 2 | 3 | 4 | 5

interface UserInfo {
  id: number
  firstName: string
  lastName: string
  email: string
  role: UserRole
  description: string
  interestAreas: string[]
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
export { UserInfo, UserDTO, UserSignup, UserLogin, UserRole }
