// import libraries
import React, { useEffect, useState } from 'react'

// import functions 
import { getUserProfile, formatDate } from './function';

// import interfaces
import {props} from './interfaces/interfaces';

// import css
import './OtherUserProfile.css';

const OtherUserProfile: React.FC<props> = ({user}) => {
  const [userProfile, setUserProfile] = useState<any>();
  const userWithoutTypescriptProblems: any = user; 
  useEffect(() => {
    getUserProfile(userWithoutTypescriptProblems.match.params.user)
      .then((res) => {
        setUserProfile(res);
      })
  }, [userWithoutTypescriptProblems])
  return (
    <div className='user-profile profile'>

      <div className='personal-details'>
        <div className='image-container'>
          <img src={userProfile?.profile.img} className="other-profile-image" />
          <h2>{userProfile?.username}</h2>
        </div>
        <div className='details-items-container'>
          <div className='details-item-div'>
            <span className='bold'>First Name: </span>
            <span>{userProfile?.firstName}</span>
          </div>
          <div className='details-item-div'>
            <span className='bold'>Last Name: </span>
            <span>{userProfile?.lastName}</span>
          </div>
          <div className='details-item-div'>
            <span className='bold'>Address: </span>
            <span>{userProfile?.profile.address}</span>
          </div>
          <div className='details-item-div'>
            <span className='bold'>Gender: </span>
            <span>{userProfile?.profile.gender}</span>
          </div>
          <div className='details-item-div'>
            <span className='bold'>Relationship Status: </span>
            <span>{userProfile?.profile.relationship}</span>
          </div>
          <div className='details-item-div'>
            <span className='bold'>Birth Date: </span>
            <span>{userProfile?.birthDate ? formatDate(userProfile?.birthDate) : userProfile?.birthDate}</span>
          </div>
          <div className='details-item-div'>
            <span className='bold'>activeTime: </span>
            <span>{userProfile?.profile.activeTime}</span>
          </div>

        </div>  
      </div>

        <div className='information'>
          <div className='information-items-container'>
            <div className='information-item-div'> 
              <label className='bold'>About</label>
              <p className='information-p'>{userProfile?.profile.about}</p>
            </div>
            <div className='information-item-div'> 
              <label className='bold'>Hobbys</label>
              <p className='information-p'>{userProfile?.profile.hobbys}</p>
            </div>
            <div className='information-item-div'> 
              <label className='bold'>Intrests</label>
              <p className='information-p'>{userProfile?.profile.intrests}</p>
            </div>
            <div className='information-item-div'> 
              <label className='bold'>Status</label>
              <p className='information-p'>{userProfile?.profile.status}</p>
            </div>
          </div>
       
      </div>

    </div>
  )
}

export default OtherUserProfile
