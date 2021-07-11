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
            <img onClick={() => setDisplayAccountSettings(!displayAccountSettings)} src="https://img.icons8.com/fluent-systems-regular/48/000000/xbox-x.png"/>
                {
                    fieldToUpdate&& 
                      <div>
                        <input ref={profileUpdateRef} />
                        <button onClick={async () => {
                          if (!profileUpdateRef.current?.value) {
                            setFieldToUpdate(false);
                          }
                          const updated = await updateDetailsByField(fieldToUpdate, profileUpdateRef.current?.value)
                          if(typeof updated === 'string') {
                            // setError(updated);
                          } else {
                            setUser(updated);
                          }
                          setFieldToUpdate(false);
                        }}>Update
                        </button>
                      </div>
                }  
                {
                  displayAccountSettings&&
                  <div className='credentials'>
                    <div className='credential-item'>
                      <label>Email: </label>
                      <p>{user.email}</p>
                      <label  onClick={() => setFieldToUpdate({place: 'user', field: 'email'})} className='hover update'>Update</label>
                    </div>
                    <div className='credential-item'>
                      <label>Username: </label>
                      <p>{user.username}</p>
                      <label  onClick={() => setFieldToUpdate({place: 'user', field: 'username'})} className='hover update'>Update</label>
                    </div>
                    <div className='credential-item'>
                      <label>Password:</label>
                      <p>********</p>
                      <label  onClick={() => setFieldToUpdate({place: 'user', field: 'password'})} className='hover update'>Update</label>
                    </div>
                  </div>
                }
          </div>
        </div>
  )
}

export default AccountSettings
