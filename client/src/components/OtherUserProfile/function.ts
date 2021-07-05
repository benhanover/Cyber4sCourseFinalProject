import Network from "../../utils/network";

export const getUserProfile = (username: any) => {
<<<<<<< HEAD
  return Network(
    "GET",
    `http://localhost:4000/user/profile?username=${username}`
  ).then((res) => {
    return res;
=======
  return Network('GET', `http://localhost:4000/user/profile?username=${username}`)
  .then((res) => {
    return res
>>>>>>> 51332d41f5feabc854ad3d5e8fbf9073243e2695
  });
};
