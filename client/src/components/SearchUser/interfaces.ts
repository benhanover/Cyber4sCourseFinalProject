

export interface Iimg {
  data: Buffer;
  contentType: string;
}

export interface Iprofile {
  img?: Iimg;
  address?: string;
  status?: string;
  about?: string;
  intrests?: string;
  hobbys?: string;
  relationship?: string;
  activeTime?: string;
}

export interface Iuser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: Date;
  username: string;
  profileUrl: string;
  profile?: Iprofile;
}
