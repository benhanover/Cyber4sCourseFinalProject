// import libraries
import mongoose from 'mongoose';

// import models
import {User, Room} from './models'

// import intefaces
import { Iuser, IcanRegister } from '../interfaces/index';


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

export const registerUser = async (user: Iuser): Promise<Boolean> => {
  try {
    User.create({
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      password: user.password,
      birthDate: user.birthDate ? new Date(user.birthDate) : new Date(),
      username: user.username
    })
    return true;
  } catch (e) {
    console.log(e)
    return false;
  }

}
