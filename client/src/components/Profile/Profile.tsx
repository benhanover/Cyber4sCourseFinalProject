// import libraries
import {useRef, useState} from 'react'

// import redux shit
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux';
import { State, wsActionCreator } from '../../state';

// import functions
import { updateProfileByField } from './functions';
import './Profile.css';


const Profile: React.FC = () => {
  
  const dispatch = useDispatch();
  const { user } = useSelector((state: State) => state.ws)
  console.log(user)
  const { setUser } = bindActionCreators({...wsActionCreator}, dispatch);
  const [profileFieldToUpdate, setProfileFieldToUpdate] = useState<string | boolean>(false);
  const [userFieldToUpdate, setUserFieldToUpdate] = useState<string | boolean>(false);
  const [error, setError] = useState<string | null>();
  const profileUpdateRef = useRef<HTMLInputElement>(null);
  const userUpdateRef = useRef<HTMLInputElement>(null);
  const imageBufferRef = useRef<any>(null);

  const [imgBlob, setImgBlob] = useState<any>(user.profile.imageBlob);
  
  async function fileSelectedHandler(e: any): Promise<void>  {
    
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImgBlob(reader.result); 
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  }
 
  
  return (
    <>
      {/* <img className="profile-image" src={user.profile.imageBlob} alt="profile" /> */}
      <p className="profile-username">{user.username}</p>
    <div className="my-profile-container">
      <div className="my-profile">
        <h1>Profile</h1>

        {/* update profile fields */}
        {profileFieldToUpdate&& 
          <div>
            <input ref={profileUpdateRef} />
            <button onClick={async () => {
              if (!profileUpdateRef.current?.value) setProfileFieldToUpdate(false);
              setUser(await updateProfileByField(profileFieldToUpdate, profileUpdateRef.current?.value));
              setProfileFieldToUpdate(false);
            }}>update</button>
          </div>
        }

        {/* update profile fields */}
        {userUpdateRef&& 
          <div>
            <input ref={userUpdateRef} />
            <button onClick={async () => {
              if (!userUpdateRef.current?.value) setUserFieldToUpdate(false);
              setUser(await updateProfileByField(profileFieldToUpdate, userUpdateRef.current?.value));
              setUserFieldToUpdate(false);
            }}>update</button>
          </div>
        }  

        {/* update images */}
        <label> change image: </label>
        <img className="new-profile-image" src={imgBlob} alt="profile" />
        <input type='file' accept='image/*' onChange={fileSelectedHandler} onClick={() => setError(null)}/>
        {error && <p className="error">{error}</p>}
        <button onClick={async () => {
          const updated =  await updateProfileByField('imageBlob', imgBlob);
          if (updated === "Image too big, please try a smaller one..") setError(updated);
        }
        }>save</button>

        <label onClick={() => setUserFieldToUpdate('username')}>username</label>
        <p>{user.username}</p>
        <label onClick={() => setUserFieldToUpdate('password')}>password</label>
        <p>********</p>
        <label onClick={() => setUserFieldToUpdate('email')}>email</label>
        <p>{user.email}</p>
        <label onClick={() => setUserFieldToUpdate('firstName')}>first name</label>
        <p>{user.firstName}</p>
        <label onClick={() => setUserFieldToUpdate('lastName')}>last name</label>
        <p>{user.lastName}</p>
        <label onClick={() => setUserFieldToUpdate('birthDate')}>birth dath</label>
        <p>{user.birthDate}</p>

        <label onClick={() => setProfileFieldToUpdate('about')}>about</label>
        <p>{user.profile.about}</p>
        <label onClick={() => setProfileFieldToUpdate('status')}>status</label>
        <p>{user.profile.status}</p>
        <label onClick={() => setProfileFieldToUpdate('hobbys')}>hobbys</label>
        <p>{user.profile.hobbys}</p>
        <label onClick={() => setProfileFieldToUpdate('activeTime')}>activeTime</label>
        <p>{user.profile.activeTime}</p>
        <label onClick={() => setProfileFieldToUpdate('address')}>address</label>
        <p>{user.profile.address}</p>
        <label onClick={() => setProfileFieldToUpdate('intrests')}>intrests</label>
        <p>{user.profile.intrests}</p>
        <label onClick={() => setProfileFieldToUpdate('relationship')}>relationship status</label>
        <p>{user.profile.relationship}</p>
        <label onClick={() => setProfileFieldToUpdate('gender')}>gender</label>
        <p>{user.profile.gender}</p>
      </div>
      </div>
      </>
  );
}


export default Profile

