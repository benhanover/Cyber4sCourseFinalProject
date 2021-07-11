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
    <div className='account-settings-container'>
      <div className='account-settings'>
        <img className='exit-button hover' onClick={() => setDisplayAccountSettings(!displayAccountSettings)} src="https://img.icons8.com/fluent-systems-regular/48/000000/xbox-x.png"/>  
        {
          displayAccountSettings&&
          <div className='credentials'>
            <div className='keys'>
              <span className='bold'>Email:</span>
              <span className='bold'>Username:</span>
              <span className='bold'>Password:</span>
            </div>
            <div className='values'>
              <div>
                <span>{user.email}</span>
                <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png'  onClick={() => setFieldToUpdate({place: 'user', field: 'email'})}/>
              </div>
              <div>
                <span>{user.username}</span>
                <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png'  onClick={() => setFieldToUpdate({place: 'user', field: 'username'})} />
              </div>
              <div>
                <span>********</span>
                <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png'  onClick={() => setFieldToUpdate({place: 'user', field: 'password'})} />
              </div>
            </div>
          </div>
        }
        {
          fieldToUpdate&& 
            <div className='credentials-update-div'>
              <input className='input' ref={profileUpdateRef} />
              <button className='button' onClick={async () => {
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
        </div>
  )
}

export default AccountSettings
