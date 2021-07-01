import Network from '../../utils/network';

export const getAllUsers = () => {
  return Network('GET', 'http://192.168.1.111:4000/user/get-all')
  .then((res) => {
    return res
  });
}

export const filterSearchedList = (list: any, str: any) => {
  const regex = new RegExp(str);
  return list.filter((user: any) => user.username.match(regex))
}

