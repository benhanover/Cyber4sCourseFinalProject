import Cookies from 'js-cookie';
import Network from './network';
import axios, { AxiosResponse, Method } from 'axios';

export const recreateAccessToken = async (
  method: Method,
  endpoint: string,
  body: any = {}
): Promise<AxiosResponse | string | void> => {
  const refreshToken = Cookies.get('refreshToken');
  try {
    const { data: response } = await axios.get(
      'http://192.168.1.111:4000/user/refreshToken',
      {
        headers: { refreshtoken: refreshToken },
      }
    );
    if (response) {
      Cookies.set('accessToken', response.accessToken);
      
      return await Network(method, endpoint, body);
    }
    return;
  } catch (e) {
    return 'error in recreateaccess:' + e.message;
  }
};


