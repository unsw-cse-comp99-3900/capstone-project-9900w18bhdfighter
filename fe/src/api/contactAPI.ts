import { ContactPostDTO, ContactRspDTO } from '../types/msg'
import { UserProfileSlimDTO } from '../types/user'
import api from './config'

const getMyContactList = () => {
  return api.get<{
    data: ContactRspDTO[]
  }>('api/contacts')
}
const getAutoCompleteContacts = (emailSubstring: string) => {
  return api.get<{
    data: UserProfileSlimDTO[]
  }>('api/users/autocomplete', {
    params: {
      email_substring: emailSubstring,
    },
  })
}
const addOneContact = (
  body: ContactPostDTO & {
    ContactUser: number
  }
) => {
  return api.post('api/contacts', {
    ...body,
  })
}
export { getMyContactList, getAutoCompleteContacts, addOneContact }
