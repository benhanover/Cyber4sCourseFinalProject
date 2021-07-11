import Network from "../../utils/network";

// import enums
import { enums } from "../../utils/enums"

export const getUserProfile = (username: any) => {
  return Network('GET', `${enums.baseUrl}/user/profile?username=${username}`)
  .then((res) => {
    return res
  });
};

export const formatDate = (date: string): string => {
  return date.slice(0, 10);
}