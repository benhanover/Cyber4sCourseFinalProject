// import libraries
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// import functions 
import { getUserProfile } from './function';

const OtherUserProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any>();
  const location = useLocation();
  useEffect(() => {
    getUserProfile(location.search.slice(10))
      .then((res) => {
        setUserProfile(res);
      })
  }, [])
  return (
    <div>
      {JSON.stringify(userProfile)}
    </div>
  )
}

export default OtherUserProfile
