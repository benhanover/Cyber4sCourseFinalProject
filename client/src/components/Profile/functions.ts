// import network
import Network from '../../utils/network';

// import interfaces
import { Ifield } from './interfaces';

// fieldAndLocation = {place: , field}
export const updateDetailsByField  = (fieldAndLocation: Ifield | boolean, update: any): any => {
  if (typeof fieldAndLocation === 'boolean') return;  
  const { place, field } = fieldAndLocation;
  try {
    return Network('PUT', 'http://localhost:4000/user/update', { place, field, update })
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