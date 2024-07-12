import { UserProfileDTO } from '../types/user'
import api from './config'

const getUserById = async (id: number) => {
  return api.get<{ data: UserProfileDTO }>(`api/users/${id}`)
}

export { getUserById }
