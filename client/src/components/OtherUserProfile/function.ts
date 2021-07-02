import Network from '../../utils/network';

export const getUserProfile = (username: any) => {
  return Network('GET', `http://localhost:4000/user/profile?username=${username}`)
  .then((res) => {
    return res
  });
}

