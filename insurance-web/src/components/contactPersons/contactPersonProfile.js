import React, { useState, useContext, useEffect } from 'react';
import { ContactPersonContext } from '../../context/contactPerson';
import { GET_CONTACT_PERSON } from './queries'
import { useQuery } from '@apollo/react-hooks';
import Profile from '../common/profile'

export default function ContactPersonProfile({ props }) {
  const [user, setUser] = useState('records');
  const [fetched, setFetched] = useState(false);
  const context = useContext(ContactPersonContext);
  const userId = props.computedMatch.params.contactPersonId

  const { data: userData } = useQuery(GET_CONTACT_PERSON, { variables: { id: userId } })
  useEffect(() => {
    if (userData) {
      setUser(userData.contactPerson)
      if (!fetched) {
        context.getContactPerson(userData.contactPerson)
        setFetched(true)
      }
    }
  }, [context, fetched, userData])
  return (

    <div>
      {user && <Profile user={user} isContactPerson={true} />}
    </div>)
}
