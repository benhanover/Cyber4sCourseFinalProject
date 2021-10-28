import Cookies from "js-cookie";
import Network from "./network";
import axios, { AxiosResponse, Method } from "axios";

// import enums
import { enums } from "../utils/enums"

export const recreateAccessToken = async (
  method: Method,
  endpoint: string,
  body: any = {}
): Promise<AxiosResponse | string | void> => {
  const refreshToken = Cookies.get("refreshToken");
  try {
    const { data: response } = await axios.get(
      `${enums.baseUrl}/user/refreshToken`,
      {
        headers: { refreshtoken: refreshToken },
      }
    );
    if (response) {
      Cookies.set("accessToken", response.accessToken);

      return await Network(method, endpoint, body);
    }
    return;
  } catch (e) {
    return "error in recreateaccess:" + e.message;
  }
};

export const formatDate = (date: string): string => {
  const initArray: Array<String> = date.slice(0, 10).split('-')
  return initArray.sort((a,b)=> initArray.indexOf(b)- initArray.indexOf(a)).join("/");
}