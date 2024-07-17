import { useMemo } from 'react'
import { useMessageContext } from '../../../context/MessageContext'
import UserSearchBar from '../../../components/UserSearchBar'
import { useAuthContext } from '../../../context/AuthContext'

const ContactSearchBar = () => {
  const { usrInfo } = useAuthContext()
  const {
    contactList,
    addContact,
    getContacts,
    currAutoCompleteContacts,
    getAutoCompleteContacts,
    setCurrAutoCompleteContacts,
  } = useMessageContext()
  const autoCompContactsWithoutSelf = useMemo(
    () =>
      currAutoCompleteContacts
        .filter((contact) => contact.email !== usrInfo?.email)
        .filter(
          (contact) =>
            !contactList?.find((c) => c.contact.email === contact.email)
        ),
    [currAutoCompleteContacts, usrInfo, contactList]
  )
  return (
    <UserSearchBar
      handleChange={async (val) => {
        await addContact({
          Contact: val.value,
        })
        await getContacts()
      }}
      getAutoCompleteUsers={async (val) => {
        await getAutoCompleteContacts(val)
      }}
      setCurrAutoCompleteUser={setCurrAutoCompleteContacts}
      autoCompUserWithoutSelf={autoCompContactsWithoutSelf}
    />
  )
}

export default ContactSearchBar
