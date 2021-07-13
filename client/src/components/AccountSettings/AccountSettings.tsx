// import libraries
import React, {useState, useRef} from 'react'

// import functions
import { updateDetailsByField } from '../Profile/functions'

// import interfaces
import {Ifield} from '../Profile/interfaces'
import {Iprops} from './interfaces';

// import css
import './AccountSettings.css'



export const AccountSettings: React.FC<Iprops> = ({user, setUser, setDisplayAccountSettings, displayAccountSettings}) => {

  // redux
  const [fieldToUpdate, setFieldToUpdate] = useState<Ifield | boolean>(false);
  const profileUpdateRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className='account-settings-container form-div'>
      <svg onClick={() => setDisplayAccountSettings(!displayAccountSettings)} xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="currentColor" className="exit-button hover bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
</svg>
        {/* <img className='exit-button hover' onClick={() => setDisplayAccountSettings(!displayAccountSettings)} src="https://img.icons8.com/fluent-systems-regular/48/000000/xbox-x.png"/>   */}
        {
          displayAccountSettings&&
          <div className='credentials'>
            <div className='keys'>
              <span className='key edit'>Email:</span>
              <span className='key edit'>Username:</span>
              <span className='key edit'>Password:</span>
            </div>
            <div className='values'>
              <div className="value edit">
                <span>{user.email}</span>
                <img className="hover" src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png'  onClick={() => setFieldToUpdate({place: 'user', field: 'email'})}/>
              </div>
              <div className="value edit">
                <span>{user.username}</span>
                <img className="hover" src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png'  onClick={() => setFieldToUpdate({place: 'user', field: 'username'})} />
              </div>
              <div className="value edit">
                <span>********</span>
                <img className="hover" src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png'  onClick={() => setFieldToUpdate({place: 'user', field: 'password'})} />
              </div>
            </div>
          </div>
        }
        {
          fieldToUpdate&& 
            <div className='credentials-update-div'>
              <input className='input' ref={profileUpdateRef} />
              <button className='update-button' onClick={async () => {
                if (!profileUpdateRef.current?.value) {
                setFieldToUpdate(false);
                }
                const updated = await updateDetailsByField(fieldToUpdate, profileUpdateRef.current?.value);
                setUser(updated);
                setFieldToUpdate(false);
              }}>Update
              </button>
            </div>
        }
          
        </div>
  )
}

export default AccountSettings
