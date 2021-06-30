// import network
import Network from '../../utils/network';

export const updateProfileByField  = (field: any, update: any): any => {  
  try {
    return Network('PUT', 'http://localhost:4000/user/update-profile', { field, update })
  }
  catch (e) {
    console.log("saiokdlkdnsgfa");
    
    return "Image too big, please try a smaller one.."
  };
  }

export const updateUserByField = (field: any, update: any): any => {
  try {
    return Network('PUT', 'http://localhost:4000/user/update-user', {field, update})
  } catch(e) {
    console.log(e)
  }
}