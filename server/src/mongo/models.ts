import { roomSchema, userSchema } from "./schema/index";
import mongoose from "mongoose";
import { Iuser, Iroom } from "../types/index";
export const Room = mongoose.model<Iroom>("Room", roomSchema);
export const User = mongoose.model<Iuser>("User", userSchema);
