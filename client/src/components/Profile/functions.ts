import Cookies from 'js-cookie';

// import network
import Network from '../../utils/network';
import axios from 'axios';

// import interfaces
import { Ifield } from './interfaces';

// fieldAndLocation = {place: , field}
export const updateDetailsByField  = async (fieldAndLocation: Ifield | boolean, update: any): Promise<any> => {
  if (typeof fieldAndLocation === 'boolean') return;  
  const { place, field } = fieldAndLocation;
  try {
    
    if (field === 'password' || field === 'email' || field === 'username') {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');

      // TODO: tell the user he needs to login again.
      // if (!window.confirm("To Procceed you will need to relog")) return;
      // if (!promptRes) return;
      console.log("why are you here? ehh?");
      
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');

      const { data: response } = await axios.put('http://192.168.1.111:4000/user/update', { place, field, update }, { headers: { authorization: accessToken, refreshToken } });
      Cookies.set('accessToken', response.accessToken);
      Cookies.set('refreshToken', response.refreshToken);
    }
    else {
      return Network('PUT', 'http://192.168.1.111:4000/user/update', { place, field, update })
    }
} catch (e) {  
      console.log('Profile > functions.ts > updatedDetailsByField');
      console.log(e);
    };
  }



export async function fileSelectedHandler(e: any): Promise<any>  {
  return new Promise ((resolve, reject) => {
    const reader = new FileReader();
     reader.onload = () => {
      if (reader.readyState === 2) {
        resolve(reader.result); 
      }
    }
    if(!e.target.files[0]) return;
    reader.readAsDataURL(e.target.files[0]);
  })
}