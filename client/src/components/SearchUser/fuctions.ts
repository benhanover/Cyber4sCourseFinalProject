import Network from '../../utils/network';


// import enums
import { enums } from "../../utils/enums"

export const getAllUsers = () => {
  return Network('GET', `${enums.baseUrl}/user/get-all`)
  .then((res) => {
    return res
  });
}

export const filterSearchedList = (list: any, str: any) => {
  if (!str) return;
  const regex = new RegExp(str, 'gi');
  return list.filter((user: any) => user.username.match(regex));
}

