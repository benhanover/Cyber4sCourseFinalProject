
export interface Iroom {
  _id?: any;
  host: string;
  subject: string;
  subSubject: string;
  title: string;
  description: string;
  participants: any[];
  limit: number;
  isLocked: boolean;
  isClosed: boolean;
  roomPassword: string;

}

/*---------------------------------------------------------------------------------------------------------- */
export interface Iprofile {
  img?: string;
  gender?: string;
  address?: string;
  status?: string;
  about?: string;
  intrests?: string;
  hobbys?: string;
  relationship?: string;
  activeTime?: string;
}

/*---------------------------------------------------------------------------------------------------------- */
export interface IreturnInfo {
  return: boolean;
  message?: string | unknown;
}

/*---------------------------------------------------------------------------------------------------------- */
export interface Itokens {
  accessToken: string;
  refreshToken: string;
}
/*---------------------------------------------------------------------------------------------------------- */

export interface Iuser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: Date;
  username: string;
  profile?: Iprofile;
}
