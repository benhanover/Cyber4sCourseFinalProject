// import libraries
import mongoose from 'mongoose';

// import models
import {User, Room} from './models'

// import intefaces
import { Iuser, IcanRegister, Iroom } from '../interfaces/index';

// src/controllers/userControllers
export const canRegister = async (email: string, username: string): Promise<IcanRegister> => {
  try {
    const users: Array<Iuser> = await User.find({ $or: [{ email }, { username }] });
    let returnObjCaseExist;
      users.find((user) => {
      if (user.email === email) {
        returnObjCaseExist = {return: false, message: 'Email Already Exist'}
      } else if (user.username === username) {
        returnObjCaseExist = {return: false, message: 'UserName Already Exist'}
      }
    });
    if (returnObjCaseExist) {
      return returnObjCaseExist
    }
    return {return: true};
  } catch (e) {
    return {return: false, message: e.message}
  }
}

// src/controllers/userControllers
export const registerUser = async (user: Iuser): Promise<Boolean> => {
  try {
    User.create(user)
    return true;
  } catch (e) {
    console.log(e)
    return false;
  }
}

// src/controllers/roomControllers
export const saveRoom = async (room: Iroom) => {
  try {
    Room.create(room)
    return true;
  } catch (e) {
    console.log(e)
    return false;
  }
}

