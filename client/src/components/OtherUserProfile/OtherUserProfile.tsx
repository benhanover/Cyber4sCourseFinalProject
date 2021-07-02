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
        console.log(res);
        setUserProfile(res);
      })
  }, [])
  return (
    <div>
      <img src={userProfile?.profile.imageBlob} />
      <p>Username: {userProfile?.username}</p>
      <p>Email: {userProfile?.email}</p>
      <p>First Name: {userProfile?.firstName}</p>
      <p>Last Name: {userProfile?.lastName}</p>
      <p>About: {userProfile?.profile.about}</p>
      <p>activeTime: {userProfile?.profile.activeTime}</p>
      <p>Address: {userProfile?.profile.address}</p>
      <p>Gender: {userProfile?.profile.gender}</p>
      <p>Hobbys: {userProfile?.profile.hobbys}</p>
      <p>Intrests: {userProfile?.profile.intrests}</p>
      <p>Relationship Status: {userProfile?.profile.relationship}</p>
      <p>Status: {userProfile?.profile.status}</p>
    </div>
  )
}

export default OtherUserProfile
