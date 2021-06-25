export interface Iroom {
  _id?: string;
  host?: any;
  subject: string;
  subSubject: string;
  title: string;
  description: string;
  participants?: string[];
  limit: number;
  isLocked: boolean;
}

export interface ImessageBox {
  type: string;
  message: any //string | Iroom[]
}
// export interface InewRoom {
//   _id?: string,
//   host: string;
//   subject: string;
//   subSubject: string;
//   title: string;
//   description: string;
//   participants: Array<string>;
//   limit: number;
//   isLocked: boolean;
// }
