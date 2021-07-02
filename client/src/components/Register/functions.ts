import axios, { AxiosResponse } from "axios";

export function register(
  username: string,
  firstName: string,
  lastName: string,
  birthDate: string,
  email: string,
  password: string
): Promise<AxiosResponse<any>> {
  return axios.post("http://192.168.1.111:4000/user/register", {
    username,
    firstName,
    lastName,
    birthDate,
    email,
    password,
  });
}
