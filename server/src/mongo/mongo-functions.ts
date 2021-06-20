// import libraries
import mongoose, { Model, Document } from 'mongoose';

// import models
import { User, Room, RefreshToken, AccessToken } from './models';

// import intefaces
import { Iuser, Iroom, IreturnInfo } from '../interfaces/index';
import { errorEnums } from '../enums';

import { getModel } from './assistance-functions';

// src/controllers/userControllers
export const canRegister = async (
  email: string,
  username: string
): Promise<IreturnInfo> => {
  try {
    const users: Array<Iuser> = await User.find({
      $or: [{ email }, { username }],
    });
    let returnObjCaseExist;
    users.find((user) => {
      if (user.email === email) {
        returnObjCaseExist = { return: false, message: 'Email Already Exist' };
      } else if (user.username === username) {
        returnObjCaseExist = {
          return: false,
          message: 'Username Already Exist',
        };
      }
    });
    if (returnObjCaseExist) {
      return returnObjCaseExist;
    }
    return { return: true };
  } catch (e) {
    return { return: false, message: e.message };
  }
};

// src/controllers/userControllers
export const registerUser = async (user: Iuser): Promise<Boolean> => {
  try {
    User.create(user);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// src/controllers/roomControllers
export const saveRoom = async (room: Iroom) => {
  try {
    const updatedRoom = await Room.create(room);
    return updatedRoom;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getRooms = async () => {
  try {
    const rooms = await Room.find();
    return rooms;
  } catch (e) {
    console.log(errorEnums.UNREACHABLE_DB + e.message);
    return [];
  }
};

// finds a document by model and fiel
export const findDocument = async (
  modelString: string,
  field: string,
  fieldContent: any
): Promise<IreturnInfo | Iuser | Iroom> => {
  const model: typeof Model | undefined = getModel(modelString);
  if (!model) {
    console.log('No Model Enum Entered to findOne Function');
    return {
      return: false,
      message: 'Missing parameter line 68 ,mongo-functions',
    };
  }
  try {
    const foundDocument: Iuser | null = await model.findOne({
      [field]: fieldContent,
    });

    return foundDocument
      ? foundDocument
      : { return: false, message: modelString + errorEnums.NOT_FOUND };
  } catch (e) {
    return { return: false, message: errorEnums.UNREACHABLE_DB + e };
  }
};

export const removeAccessToken = async (
  accessToken: string
): Promise<boolean> => {
  try {
    const accessDeleted: any = await AccessToken.deleteOne({ accessToken });
    console.log('accessDeleted:', accessDeleted);
    if (accessDeleted.deletedCount > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};
export const removeRefreshToken = async (
  refreshToken: string
): Promise<boolean> => {
  try {
    const refreshDeleted: any = await RefreshToken.deleteOne({ refreshToken });
    console.log('refreshDeleted:', refreshDeleted);
    if (refreshDeleted.deletedCount > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};
export const saveRefreshToken = async (
  refreshToken: string
): Promise<boolean> => {
  try {
    await RefreshToken.create({ refreshToken });
    return true;
  } catch (e) {
    console.log('Could Not Add Refresh Token:', e);
    return false;
  }
};

export const saveAccessToken = async (
  accessToken: string
): Promise<boolean> => {
  try {
    await AccessToken.create({ accessToken });
    return true;
  } catch (e) {
    console.log('Could Not save Acsses Token to mongo:', e);
    return false;
  }
};

export const isValidRefresh = async (refreshToken: string) => {
  return Boolean(await RefreshToken.findOne({ refreshToken }));
};
export const isValidAccess = async (accessToken: string) => {
  return Boolean(await AccessToken.findOne({ accessToken }));
};
