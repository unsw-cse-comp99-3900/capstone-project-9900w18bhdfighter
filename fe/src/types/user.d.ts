type UserRole = 'ADMIN' | 'USER' | 'TUTOR' | 'STUDENT' | 'CORD'

interface UserInfo {
  id: number
  name: string
  email: string
  role: UserRole
}

export { UserInfo }
