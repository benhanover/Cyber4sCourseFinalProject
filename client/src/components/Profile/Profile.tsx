// import libraries
import {useRef, useState} from 'react'

// import redux shit
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux';
import { State, wsActionCreator } from '../../state';

// import functions
import { updateDetailsByField, fileSelectedHandler, formatDate, saveImageToS3 } from './functions';
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
  const [displayCredentials, setDisplayCredentials] = useState<any>(false);
  const [displayImageButtons, setDisplayImageButtons] = useState<any>(false);
  const [error, setError] = useState<string | null>();
  const [imgFile, setImgFile] = useState<any>();
  const [imageSourceButton, setImageSourceButton] = useState<any>('https://img.icons8.com/material-outlined/24/000000/edit--v1.png')
  
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
            <div className='image-container'>
              <img className="profile-image" src={user.profile.img} alt="profile" />
              <img src={imageSourceButton} className='change-image' onClick={() => {
                imageSourceButton === 'https://img.icons8.com/material-outlined/24/000000/edit--v1.png'
                ? setImageSourceButton('https://img.icons8.com/fluent-systems-regular/48/000000/xbox-x.png')
                : setImageSourceButton('https://img.icons8.com/material-outlined/24/000000/edit--v1.png')
                setDisplayImageButtons(!displayImageButtons)}}
                />
            </div>
            {
              displayImageButtons&&
              <div className='image-buttons'>
                <label htmlFor='files' className='hover'>Choose File</label>
                <input id="files" type='file' className="hidden" accept='image/*' onChange={(async e => {
                  if(e.target.files) {
                    setImgFile(e.target.files[0]);
                    const blobBeforeSave = await fileSelectedHandler(e);
                    user.profile.img = blobBeforeSave;
                    setUser({...user})
                  }
                })} onClick={() => setError(null)}/>
                {error && <p className="error">{error}</p>}
                <label className='hover' onClick={async () => {
                  const response: any = await saveImageToS3(imgFile, user.username);
                  await updateDetailsByField({place: 'profile', field: 'img'}, response.data.imageUrl);
                }
                }>save</label>
              </div>
              }
          </div>
          <div className='details-container'>

            <div className='details'>

              <div className='details-item-div'>
                <span className='bold'>First Name:</span>
                <span>{user.firstName}</span>
                <label onClick={() => setFieldToUpdate({place: 'user', field: 'firstName'})} className='hover update'>Update</label>
              </div>

              <div className='details-item-div'>
                <span className='bold'>Last Name: </span>
                <span>{user.lastName}</span>
                <label onClick={() => setFieldToUpdate({place: 'user', field: 'lastName'})} className='hover update'>Update</label>
              </div>

              <div className='details-item-div'>
                <span className='bold'>Address: </span>
                <span>{user.profile.address}</span>
                <label onClick={() => setFieldToUpdate({place: 'profile', field:'address'})} className='hover update'>Update</label>
              </div>

              <div className='details-item-div'>
                <span className='bold'>Gender: </span>
                <span>{user.profile.gender}</span>
                <label onClick={() => setFieldToUpdate({place: 'profile', field:'gender'})} className='hover update'>Update</label>
              </div>

              <div className='details-item-div'>
                <span className='bold'>Relationship Status: </span>
                <span>{user.profile.relationship}</span>
                <label onClick={() => setFieldToUpdate({place: 'profile', field:'relationship'})} className='hover update'>Update</label>
              </div>

              <div className='details-item-div'>
                <span className='bold'>BirthDate</span>
                <span>{formatDate(user.birthDate)}</span>
                <label onClick={() => setFieldToUpdate({place: 'user', field: 'birthDate'})} className='hover update'>Update</label>
              </div>
            </div>
          </div>
        </div>
        {/* <div className='credentials-container'>
          <label onClick={() => setDisplayCredentials(!displayCredentials)} className='hover account-settings'>Account Settings</label>
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
        </div> */}
        <div className='information'>

          <div>
            <div className='information-item-div'>              
              <label className='information-title'>1Most Likely To Find Me Logged</label>
              <p>{user.profile.activeTime}</p>
              <label onClick={() => setFieldToUpdate({place: 'profile', field:'activeTime'})} className='information-update-button hover update' >Update</label>
            </div>
          </div>

          <div>
            <div className='information-item-div'>              
              <label className='information-title'>2About</label>
              <p>{user.profile.about}</p>
              <label onClick={() => setFieldToUpdate({place: 'profile', field: 'about'})} className='information-update-button hover update' >Update</label> 
            </div>
          </div>

          <div>
            <div className='information-item-div'>              
              <label className='information-title'>3Status</label>
              <p>{user.profile.status}</p>
              <label onClick={() => setFieldToUpdate({place: 'profile', field:'status'})} className='information-update-button hover update' >Update</label>
            </div>
          </div>

          <div>
            <div className='information-item-div'>              
              <label className='information-title'>4Hobbys</label>
              <p>{user.profile.hobbys}</p>
              <label onClick={() => setFieldToUpdate({place: 'profile', field:'hobbys'})} className='information-update-button hover update' >Update</label>
            </div>
          </div>

          <div>
            <div className='information-item-div'>
              <label className='information-title'>5Interests</label>
              <p>{user.profile.intrests}</p>
              <label onClick={() => setFieldToUpdate({place: 'profile', field:'intrests'})} className='information-update-button hover update' >Update</label>
            </div>
          </div>

        </div>
        </div>

  );
  // functions
  
}


export default Profile

