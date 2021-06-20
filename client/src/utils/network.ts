import axios from 'axios';
import { AxiosResponse, AxiosError, Method } from 'axios';
import { recreateAccessToken } from './functions';
import Cookies from 'js-cookie';

async function Network(
  method: Method,
  endpoint: string,
  body: any = {}
): Promise<AxiosResponse> {
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

  return await axios(options)
    .then((response: AxiosResponse) => {
      if (response.status === 200) return response.data;
    })
    .catch(async (e) => {
      switch (e.message) {
        case 'Request failed with status code 401':
          return await recreateAccessToken(method, endpoint, body);

          break;
        default:
          console.log('defaulttt');
      }
      return e.message;
    });
}
export default Network;
