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
  
  const dispatch = useDispatch();
  const { user } = useSelector((state: State) => state.ws)
  const { setUser } = bindActionCreators({...wsActionCreator}, dispatch);
  // states
  const [fieldToUpdate, setFieldToUpdate] = useState<Ifield | boolean>(false);
  const [error, setError] = useState<string | null>();
  const [imgBlob, setImgBlob] = useState<any>(user.profile.imageBlob);

  // refs
  const profileUpdateRef = useRef<HTMLInputElement>(null);
  const imageBufferRef = useRef<any>(null); 
  
  return (
      <div className="my-profile-container">
        <div className="my-profile">
          <h1>Profile</h1>
          <p className="profile-username">{user.username}</p>

          {/* update profile fields */}
          {fieldToUpdate&& 
            <div>
              <input ref={profileUpdateRef} />
              <button onClick={async () => {
                if (!profileUpdateRef.current?.value) setFieldToUpdate(false);
            const updated = await updateDetailsByField(fieldToUpdate, profileUpdateRef.current?.value)
            if(typeof updated === 'string') {
              setError(updated);
            } else {
              setUser(updated);
            }
            setFieldToUpdate(false);
              }}>update</button>
            </div>
          }


          {/* update images */}
          <label> change image: </label>
          <img className="new-profile-image" src={imgBlob} alt="profile" />
          <input type='file' accept='image/*' onChange={async (e) => setImgBlob(await fileSelectedHandler(e))} onClick={() => setError(null)}/>
          {error && <p className="error">{error}</p>}
          <button onClick={async () => {
            const updated =  await updateDetailsByField({place: 'profile' , field: 'imageBlob'}, imgBlob);
            if (typeof updated === 'string') {
              console.log('IM IN THE IFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')
              setError(updated);
              return;
            }
            setUser(updated);
          }
          }>save</button>

          <label onClick={() => setFieldToUpdate({place: 'user', field: 'username'})}>username</label>
          <p>{user.username}</p>
          <label onClick={() => setFieldToUpdate({place: 'user', field: 'password'})}>password</label>
          <p>********</p>
          <label onClick={() => setFieldToUpdate({place: 'user', field: 'email'})}>email</label>
          <p>{user.email}</p>
          <label onClick={() => setFieldToUpdate({place: 'user', field: 'firstName'})}>first name</label>
          <p>{user.firstName}</p>
          <label onClick={() => setFieldToUpdate({place: 'user', field: 'lastName'})}>last name</label>
          <p>{user.lastName}</p>
          <label onClick={() => setFieldToUpdate({place: 'user', field: 'birthDate'})}>birth dath</label>
          <p>{user.birthDate}</p>

          <label onClick={() => setFieldToUpdate({place: 'profile', field: 'about'})}>about</label>
          <p>{user.profile.about}</p>
          <label onClick={() => setFieldToUpdate({place: 'profile', field:'status'})}>status</label>
          <p>{user.profile.status}</p>
          <label onClick={() => setFieldToUpdate({place: 'profile', field:'hobbys'})}>hobbys</label>
          <p>{user.profile.hobbys}</p>
          <label onClick={() => setFieldToUpdate({place: 'profile', field:'activeTime'})}>activeTime</label>
          <p>{user.profile.activeTime}</p>
          <label onClick={() => setFieldToUpdate({place: 'profile', field:'address'})}>address</label>
          <p>{user.profile.address}</p>
          <label onClick={() => setFieldToUpdate({place: 'profile', field:'intrests'})}>intrests</label>
          <p>{user.profile.intrests}</p>
          <label onClick={() => setFieldToUpdate({place: 'profile', field:'relationship'})}>relationship status</label>
          <p>{user.profile.relationship}</p>
          <label onClick={() => setFieldToUpdate({place: 'profile', field:'gender'})}>gender</label>
          <p>{user.profile.gender}</p>
        </div>
      </div>

  );
}


export default Profile

