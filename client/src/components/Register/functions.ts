import axios, { AxiosResponse } from "axios";

// import enums
import { enums } from "../../utils/enums"


export function register(
  username: string,
  firstName: string,
  lastName: string,
  birthDate: string,
  email: string,
  password: string
): Promise<AxiosResponse<any>> {
  return axios.post(`${enums.baseUrl}/user/register`, {
    username,
    firstName,
    lastName,
    birthDate,
    email,
    password,
  });
}
