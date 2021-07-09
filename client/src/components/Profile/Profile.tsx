// import libraries
import {useRef, useState} from 'react'

// import redux shit
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux';
import { State, wsActionCreator } from '../../state';

// import functions
import { updateDetailsByField, fileSelectedHandler } from './functions';
import './Profile.css';

// import interfaces
import { Ifield } from './interfaces';

const Profile: React.FC = () => {
  
  // redux
  const dispatch = useDispatch();
  const { user } = useSelector((state: State) => state.ws);
  const { setUser } = bindActionCreators({...wsActionCreator}, dispatch);

  // states
  const [fieldToUpdate, setFieldToUpdate] = useState<Ifield | boolean>(false);
  const [imgBlob, setImgBlob] = useState<any>(user.profile.imageBlob);
  const [displayCredentials, setDisplayCredentials] = useState<any>(false);
  const [displayImageButtons, setDisplayImageButtons] = useState<any>(false);
  // const [error, setError] = useState<string | null>();
  {/* {error && <p className="error">{error}</p>} */}
  // refs
  const profileUpdateRef = useRef<HTMLInputElement>(null);
  
  return (
      <div className="my-profile">

        {fieldToUpdate&& 
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

        <div className="personal-details">
          <div className='image-related'>
            <img className="new-profile-image" src={imgBlob} alt="profile" />
            <label onClick={() => setDisplayImageButtons(true)}>Edit Profile Image</label>
            {
              displayImageButtons&&
                <div className='image-buttons'>
                  <label
                      className='hover'
                      onClick={async () => {
                        setDisplayImageButtons(false);
                        const updated =  await updateDetailsByField({place: 'profile' , field: 'imageBlob'}, imgBlob);
                        // if (typeof updated === 'string') {
                        //   console.log('IM IN THE IFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')
                        //   setError(updated);
                        //   return;
                        // }
                        setUser(updated);
                      }}>
                    Save
                    </label>
                    <label htmlFor='files' className='hover'>Choose File</label>
                    <input 
                      type='file'
                      id='files'
                      accept='image/*'
                      onChange={async (e) => setImgBlob(await fileSelectedHandler(e))}
                      className='hidden'
                      // onClick={() => setError(null)}
                    />
                </div>
            }
          </div>
          <div className='details-container'>
            <div className='details'>
              <div className='details-item-div'>
                <p>{user.firstName}</p>
                <label onClick={() => setFieldToUpdate({place: 'user', field: 'firstName'})} className='hover update'>Update</label>
              </div>
              <div className='details-item-div'>
                <p>{user.lastName}</p>
                <label onClick={() => setFieldToUpdate({place: 'user', field: 'lastName'})} className='hover update'>Update</label>
              </div>
              <div className='details-item-div'>
                <p>{user.profile.address}</p>
                <label onClick={() => setFieldToUpdate({place: 'profile', field:'address'})} className='hover update'>Update</label>
              </div>
              <div className='details-item-div'>
                <p>{user.profile.gender}</p>
                <label onClick={() => setFieldToUpdate({place: 'profile', field:'gender'})} className='hover update'>Update</label>
              </div>
              <div className='details-item-div'>
                <p>{user.profile.relationship}</p>
                <label onClick={() => setFieldToUpdate({place: 'profile', field:'relationship'})} className='hover update'>Update</label>
              </div>
              <div className='details-item-div'>
                <p>{user.birthDate}</p>
                <label onClick={() => setFieldToUpdate({place: 'user', field: 'birthDate'})} className='hover update'>Update</label>
              </div>
              <label onClick={() => setDisplayCredentials(!displayCredentials)} className='hover account-settings'>Account Settings</label>
            </div>
            {
              displayCredentials&&
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

        <div className='information'>

          <div>
            <div className='information-item-div'>              
              <label className='information-title'>1Most Likely To Find Me Logged</label>
              <label onClick={() => setFieldToUpdate({place: 'profile', field:'activeTime'})} className='information-update-button hover update' >Update</label>
              <p>{user.profile.activeTime}</p>
            </div>
          </div>

          <div>
            <div className='information-item-div'>              
              <label className='information-title'>2About</label>
              <label onClick={() => setFieldToUpdate({place: 'profile', field: 'about'})} className='information-update-button hover update' >Update</label> 
              <p>{user.profile.about}</p>
            </div>
          </div>

          <div>
            <div className='information-item-div'>              
              <label className='information-title'>3Status</label>
              <label onClick={() => setFieldToUpdate({place: 'profile', field:'status'})} className='information-update-button hover update' >Update</label>
              <p>{user.profile.status}</p>
            </div>
          </div>

          <div>
            <div className='information-item-div'>              
              <label className='information-title'>4Hobbys</label>
              <label onClick={() => setFieldToUpdate({place: 'profile', field:'hobbys'})} className='information-update-button hover update' >Update</label>
              <p>{user.profile.hobbys}</p>
            </div>
          </div>

          <div>
            <div className='information-item-div'>
              <label className='information-title'>5Interests</label>
              <label onClick={() => setFieldToUpdate({place: 'profile', field:'intrests'})} className='information-update-button hover update' >Update</label>
              <p>{user.profile.intrests}</p>
            </div>
          </div>

        </div>
        </div>

  );
}


export default Profile

