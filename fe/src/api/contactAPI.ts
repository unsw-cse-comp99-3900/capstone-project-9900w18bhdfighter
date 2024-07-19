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
  }>('api/users/autocomplete-email', {
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

// const getAutoCompleteProjects = async (nameSubstring: string) => {
//   const response = await api.get<{
//     data: ProjectProfileSlimDTO[]
//   }>('api/projects/autocomplete-name', {
//     params: {
//       name_substring: nameSubstring,
//     },
//   })
//   console.log(response.data) // Add this line to log the response
//   return response
// }

export {
  getMyContactList,
  getAutoCompleteContacts,
  addOneContact,
  getAutoCompleteProjects,
}
