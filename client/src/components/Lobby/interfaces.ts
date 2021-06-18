export interface RoomObj {
  _id: string,
  host: string,
  subject: string,
  subSubject: string,
  title: string,
  description: string,
  participants: Array<string>,
  limit: number,
  isLocked: boolean,
}
export interface NewRoomObj {
  host: string,
  subject: string,
  subSubject: string,
  title: string,
  description: string,
  participants: Array<string>,
  limit: number,
  isLocked: boolean,
}
