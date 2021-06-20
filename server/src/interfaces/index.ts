export interface Iroom {
  _id?: any;
  host: string;
  subject: string;
  subSubject: string;
  title: string;
  description: string;
  participants: string[];
  limit: number;
  isLocked: boolean;
}

/*---------------------------------------------------------------------------------------------------------- */
export interface Iuser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: Date;
  username: string;
}

/*---------------------------------------------------------------------------------------------------------- */
export interface IreturnInfo {
  return: boolean;
  message?: string;
}
