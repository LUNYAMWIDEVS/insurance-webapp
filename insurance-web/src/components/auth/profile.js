import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/auth';
import { USER_PROFILE_QUERY } from './queries'
import { useQuery } from '@apollo/react-hooks';
import Profile from '../common/profile'
export default function UserProfile({props}) {
  const [user, setUser] = useState({});
  const [userId, setUserID] = useState('');
  const [fetched, setFetched] = useState(false);
  const context = useContext(AuthContext);

  useEffect(() => {
    const userId = props.computedMatch.params.userId
    setUserID(userId)

  }, [props.computedMatch.params.userId])

  const { data: userData } = useQuery(USER_PROFILE_QUERY, { variables: { id: userId } })
  useEffect(() => {
    if (userData) {
      setUser(userData.user)
      if (!fetched) {
        context.userProfile(userData.user)
        setFetched(true)
      }
    }
  }, [context, fetched, userData])
  return (

    <div>
      {user && <Profile user={user} />}
    </div>)
}
