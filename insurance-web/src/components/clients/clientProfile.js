import React, { useState, useContext, useEffect } from 'react';
import { ClientContext } from '../../context/clients';
import { GET_CLIENT_QUERY } from './queries'
import { useQuery } from '@apollo/react-hooks';
import IndividualClient from './individualClient';

export default function ClientProfile({ props }) {
  const [user, setUser] = useState({});
  const [fetched, setFetched] = useState(false);
  const context = useContext(ClientContext);
  const userId = props.computedMatch.params.clientId


  const { data: userData } = useQuery(GET_CLIENT_QUERY, { variables: { id: userId } })
  useEffect(() => {
    if (userData) {
      setUser(userData.individualClient)
      if (!fetched) {
        context.getClient(userData.individualClient)
        setFetched(true)
      }
    }
  }, [context, fetched, userData])
  return (

    <div>
      {user && <IndividualClient user={user} />}
    </div>)
}
