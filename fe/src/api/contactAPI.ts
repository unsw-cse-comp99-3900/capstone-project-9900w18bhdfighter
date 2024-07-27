import { ContactPostDTO, ContactRspDTO } from '../types/msg'
import { UserProfileSlimDTO } from '../types/user'
import api from './config'
import { ProjectProfileSlimDTO } from '../types/proj'

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

const getAutoCompleteProjects = (nameSubstring: string) => {
  return api.get<{
    data: ProjectProfileSlimDTO[]
  }>('api/projects/autocomplete-name', {
    params: {
      name_substring: nameSubstring,
    },
  })
}

export {
  getMyContactList,
  getAutoCompleteContacts,
  addOneContact,
  getAutoCompleteProjects,
}
