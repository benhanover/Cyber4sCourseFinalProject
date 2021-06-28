// import network
import Network from '../../utils/network';

export const updateByField  = (field: any, update: any): any => {  
  return Network('PUT', 'http://localhost:4000/user/update', {field: field, update: update})
  .then((response) => {
    return(response);
  })
  .catch(console.log);
}
