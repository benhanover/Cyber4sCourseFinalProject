import Network from "../../utils/network";

export const getUserProfile = (username: any) => {
  return Network(
    "GET",
    `http://192.168.1.111:4000/user/profile?username=${username}`
  ).then((res) => {
    return res;
  });
};
