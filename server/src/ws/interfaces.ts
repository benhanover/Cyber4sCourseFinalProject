import { Iroom } from "../types";

export interface ImessageBox {
    type: string;
    message: string | Iroom[] | Iroom | any
  }