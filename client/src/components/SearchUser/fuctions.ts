import Network from "../../utils/network";

export const getAllUsers = () => {
<<<<<<< HEAD
  return Network("GET", "http://localhost:4000/user/get-all").then((res) => {
    return res;
=======
  return Network('GET', 'http://localhost:4000/user/get-all')
  .then((res) => {
    return res
>>>>>>> 51332d41f5feabc854ad3d5e8fbf9073243e2695
  });
};

export const filterSearchedList = (list: any, str: any) => {
  const regex = new RegExp(str, "gi");
  const filteredList = list.filter((user: any) => user.username.match(regex));

  if (filteredList.length === list.length) {
    return null;
  }
  return filteredList;
};
