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
  const regex = new RegExp(str, 'gi');
  const filteredList = list.filter((user: any) => user.username.match(regex));

  if (filteredList.length === list.length) {
    return null;
  }
  return filteredList;
}

