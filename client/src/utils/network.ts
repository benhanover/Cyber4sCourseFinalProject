import axios from 'axios';
import { AxiosResponse, Method } from 'axios';
import Cookies from 'js-cookie';

async function Network(
  method: Method,
  endpoint: string,
  body: any = {}
): Promise<AxiosResponse> {
  const headers = {
    'Content-Type': "application/json;charset=utf-8'",
    Authorization: Cookies.get('accessToken'),
  };
  const options = {
    method: method,
    headers: headers,
    data: body,
    url: endpoint,
  };
  console.log('in the network');

  return await axios(options)
    .then((response: AxiosResponse) => {
      return response;
    })
    .catch((e) => {
      return e.response.data;
    });
}
export default Network;
