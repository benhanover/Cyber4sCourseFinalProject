// import libraries
import {useRef, useState} from 'react'

// import redux shit
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux';
import { State, wsActionCreator } from '../../state';

// import functions
import { updateByField } from './functions';

// import components
import LogoutButton from '../Common/LogoutButton/LougoutButton';



const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: State) => state.ws)
  const { setUser } = bindActionCreators({...wsActionCreator}, dispatch);
  
  const [fieldToUpdate, setFieldToUpdate] = useState<string | boolean>(false);
  const updateRef = useRef<HTMLInputElement>(null);

  // const [img, setImg] = useState<any>(user.profile.img);
  // // try 1
  // async function fileSelectedHandler(e: any): Promise<void>  {
  //   const jsonString = JSON.stringify(e.target.files[0]);
  //   console.log(jsonString)
  //   await updateByField('img', e.target.files[0]);
  //   console.log('2');
    
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     console.log('3');
  //     if(reader.readyState === 2) {
  //       // console.log(reader.result);
  //       setImg(reader.result); //workss
  //       // updateByField('img', reader.result);
  //     }
  //   }
  //   reader.readAsDataURL(e.target.files[0]);
  //   console.log('4');
  // }
 
  
  return (
    <div>
    <h1>Profile</h1>
    {fieldToUpdate&& 
      <div>
        <input ref={updateRef} />
        <button onClick={async () => {
          if (!updateRef.current?.value) setFieldToUpdate(false);
          setUser(await updateByField(fieldToUpdate, updateRef.current?.value));
          setFieldToUpdate(false);
        }}>update</button>
      </div>
    
    }
    {/* <label>Profile Image</label>
    {
      img&&
        <>
          <img src={img} />
        </>
    }
    <input type='file' accept='image/*' onChange={fileSelectedHandler} /> */}
    <label onClick={() => setFieldToUpdate('about')}>about</label>
    <p>{user.profile.about}</p>
    <label onClick={() => setFieldToUpdate('status')}>status</label>
    <p>{user.profile.status}</p>
    <label onClick={() => setFieldToUpdate('hobbys')}>hobbys</label>
    <p>{user.profile.hobbys}</p>
    <label onClick={() => setFieldToUpdate('activeTime')}>activeTime</label>
    <p>{user.profile.activeTime}</p>
    <label onClick={() => setFieldToUpdate('address')}>address</label>
    <p>{user.profile.address}</p>
    <label onClick={() => setFieldToUpdate('intrests')}>intrests</label>
    <p>{user.profile.intrests}</p>
    <label onClick={() => setFieldToUpdate('relationship')}>relationship status</label>
    <p>{user.profile.relationship}</p>
    <LogoutButton />
  </div>
  );
}


export default Profile

