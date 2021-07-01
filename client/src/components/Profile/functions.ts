// import network
import Network from '../../utils/network';

export const updateByField  = (field: any, update: any): any => {  
  return Network('PUT', 'http://192.168.1.111:4000/user/update', {field: field, update: update})
  .then((response) => {
    return(response);
  })
  .catch(console.log);
}
