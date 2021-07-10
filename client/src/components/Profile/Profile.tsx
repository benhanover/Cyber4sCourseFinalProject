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
  const [displayImageButtons, setDisplayImageButtons] = useState<any>(false);
  const [error, setError] = useState<string | null>();
  const [imgFile, setImgFile] = useState<any>();
  const [imageSourceButton, setImageSourceButton] = useState<any>('https://img.icons8.com/material-outlined/24/000000/edit--v1.png')
  
  // refs
  const profileUpdateRef = useRef<HTMLInputElement>(null);
  
  return (
      <div className="my-profile">

        {fieldToUpdate&& 
          <div className='change-input-div'>
            <div>
              <input ref={profileUpdateRef} className='change-input'/>
              <img src='https://img.icons8.com/ios/50/000000/circled-v.png' className='hover' onClick={async () => {
                if (!profileUpdateRef.current?.value) {
                  setFieldToUpdate(false);
                }
                const updated = await updateDetailsByField(fieldToUpdate, profileUpdateRef.current?.value)
                setUser(updated);
                setFieldToUpdate(false);
              }} />
              <img src='https://img.icons8.com/fluent-systems-regular/48/000000/xbox-x.png' onClick={() => setFieldToUpdate(false)} className='hover'/>
            </div>
          </div>
        }

        <div className='personal-details-container'>
          <div className="personal-details">
            <div>
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
                  <label className='hover' onClick={async () => {
                    const response: any = await saveImageToS3(imgFile, user.username);
                    await updateDetailsByField({place: 'profile', field: 'img'}, response.data.imageUrl);
                  }
                  }>save</label>
                </div>
                }
            </div>

            <div>

          </div>

              <div>

                <div className='details-item-div'>
                  <span className='bold'>First Name:</span>
                  <span>{user.firstName}</span>
                  <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'user', field: 'firstName'})} className='hover update'/>
                </div>

                <div className='details-item-div'>
                  <span className='bold'>Last Name: </span>
                  <span>{user.lastName}</span>
                  <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'user', field: 'lastName'})} className='hover update'/>
                </div>

                <div className='details-item-div'>
                  <span className='bold'>Address: </span>
                  <span>{user.profile.address}</span>
                  <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'profile', field:'address'})} className='hover update'/>
                </div>

                <div className='details-item-div'>
                  <span className='bold'>Gender: </span>
                  <span>{user.profile.gender}</span>
                  <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'profile', field:'gender'})} className='hover update'/>
                </div>

                <div className='details-item-div'>
                  <span className='bold'>Relationship Status: </span>
                  <span>{user.profile.relationship}</span>
                  <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'profile', field:'relationship'})} className='hover update'/>
                </div>

                <div className='details-item-div'>
                  <span className='bold'>BirthDate</span>
                  <span>{formatDate(user.birthDate)}</span>
                  <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'user', field: 'birthDate'})} className='hover update'/>
                </div>

                <div className='details-item-div'>
                  <span className='bold'>Active Times:</span>
                  <span>{user.profile.activeTime}</span>
                  <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'profile', field:'activeTime'})} className='hover update'/>
                </div>

              </div>
          </div>
        </div>
       
        <div className='information'>
          
          <div className='information-2item-div-container'>
            <div>
              <div className='information-item-div'>              
                <label className='bold'>About</label>
                <p>{user.profile.about}</p>
                <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'profile', field: 'about'})} className='hover update' /> 
              </div>
            </div>

            <div>
              <div className='information-item-div'>              
                <label className='bold'>Status</label>
                <p>{user.profile.status}</p>
                <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'profile', field:'status'})} className='hover update' />
              </div>
            </div>
          </div>
          
          <div className='information-2item-div-container'>
            <div>
              <div className='information-item-div'>              
                <label className='bold'>Hobbys</label>
                <p>{user.profile.hobbys}</p>
                <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'profile', field:'hobbys'})} className='hover update' />
              </div>
            </div>

            <div>
              <div className='information-item-div'>
                <label className='bold'>Interests</label>
                <p>{user.profile.intrests}</p>
                <img src='https://img.icons8.com/material-outlined/24/000000/edit--v1.png' onClick={() => setFieldToUpdate({place: 'profile', field:'intrests'})} className='hover update'/>
              </div>
            </div>
          </div>  
         

          

        </div>
        </div>

  );
  // functions
  
}


export default Profile

