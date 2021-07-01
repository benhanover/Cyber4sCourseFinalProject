import axios from 'axios';
import { AxiosResponse, Method } from 'axios';
import { recreateAccessToken } from './functions';
import Cookies from 'js-cookie';

async function Network(
  method: Method,
  endpoint: string,
  body: any = {}
): Promise<any> {
  const accessToken = Cookies.get('accessToken');

  const headers = {
    'Content-Type': "application/json;charset=utf-8'",
    authorization: accessToken,
  };
  const options = {
    method: method,
    headers: headers,
    data: body,
    url: endpoint,
  };

  return axios(options)//awawit
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        // if (endpoint === 'http://localhost:4000/user/validator') return true;
          
        return response.data;
      }
    })
    .catch(async (e) => {
      switch (e.message) { // e.response.status
        case 'Request failed with status code 401':
          return await recreateAccessToken(method, endpoint, body);
        case 'Network Error':
          return "Image too big, please try a smaller one.."
        case 'Request failed with status code 413':
          return "Image too big, please try a smaller one.."
        default:
          console.log('default from Network function');
          console.log(e.message);
          
      }
      return e.message;
    });
}
export default Network;
 //401
 //200    //403