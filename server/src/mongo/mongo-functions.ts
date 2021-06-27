// import libraries
import mongoose, { Model, Document } from 'mongoose';

// import models
import { User, Room, RefreshToken, AccessToken } from './models';

// import intefaces
import { Iuser, Iroom, IreturnInfo, Umodels } from '../types/index';
import { errorEnums } from '../enums';

// import models
import { getModel } from './assistance-functions';

/*---------------------------------------------------------------------------------------------------------- */
// used in: userControllers | checks wether the username and email are avalable.
export const canRegister = async ( email: string, username: string ): Promise<IreturnInfo> => {
  try {
    const users: Iuser[] = await User.find({
      $or: [{ email }, { username }],
    });
    let returnObjCaseExist: IreturnInfo | undefined;
    users.find((user: Iuser): void => {
      if (user.email === email) {
        console.log(errorEnums.EMAIL_TAKEN)
        returnObjCaseExist = { return: false, message: errorEnums.EMAIL_TAKEN };
      } else if (user.username === username) {  
        console.log(errorEnums.USERNAME_TAKEN)
        returnObjCaseExist = {
          return: false,
          message: errorEnums.USERNAME_TAKEN,
        };
      }
    });
    if (returnObjCaseExist) {
      return returnObjCaseExist;
    }
    return { return: true };
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_GETTING_DATA + e);
    return { return: false, message: e };
  }
};

/*---------------------------------------------------------------------------------------------------------- */
//   used in: userControllers | saves a given user in db
export const registerUser = async (user: Iuser): Promise<false | Iuser> => {
  try {
    const registeredUser: Iuser = await User.create(user);
    
    if (Boolean(registeredUser)) return registeredUser;
    console.log(errorEnums.FAILED_ADDING_DATA);
    return false;
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_ADDING_DATA + e);
    return false;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
//   used in: roomControllers | saves a given room in db
export const saveRoom = async (room: Iroom): Promise<Iroom | false> => {
  try {
    console.log("room.host:", room.host);
    
    const updatedRoom: Iroom = await Room.create(room);
    if (Boolean(updatedRoom)) return updatedRoom;
    console.log(errorEnums.FAILED_ADDING_DATA);
    return false;
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_ADDING_DATA + e);
    return false;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
//  used in: roomControllers | returns all rooms from db
export const getRooms = async () :Promise<Iroom[]> => {
  try {
    const rooms: Iroom[] = await Room.find();
    return rooms;
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_GETTING_DATA + e);
    return [];
  }
};

/*---------------------------------------------------------------------------------------------------------- */
// used in: userControllers | finds a document by model and field
export const findDocument = async ( modelString: string, field: string, fieldContent: any): Promise<Umodels> =>  {
  const model: typeof Model | undefined = getModel(modelString);
  if (!model) {
    console.log(errorEnums.NO_MODEL_ENUM);
    return {
      return: false,
      message: 'Missing parameter line 68 ,mongo-functions',
    };
  }
  try {
    const foundDocument : Umodels = await model.findOne({
      [field]: fieldContent,
    });

    return foundDocument ? foundDocument : { return: false, message: modelString + errorEnums.NOT_FOUND };
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_GETTING_DATA + e);
    return { return: false, message: errorEnums.FAILED_GETTING_DATA + e };
  }
};
/*---------------------------------------------------------------------------------------------------------- */
// used in: userControllers | finds a document by model and field
export const updateDocument = async ( modelString: string, fieldToFind: string, fieldToFindContent: any, fieldToUpdate: string, fieldToUpdateContent: any): Promise<Umodels> =>  {
  const model: typeof Model | undefined = getModel(modelString);
  if (!model) {
    console.log(errorEnums.NO_MODEL_ENUM);
    return {
      return: false,
      message: 'Missing parameter line 68 ,mongo-functions',
    };
  }
  try {
    console.log("before updating");
    
    const updatedDocument : any = await model.updateOne({
      [fieldToFind]: fieldToFindContent,
    }, {[fieldToUpdate]: fieldToUpdateContent}, {returnOriginal: false});

    console.log("updatedDocument:", updatedDocument);
    
    return updatedDocument ? updatedDocument : { return: false, message: modelString + errorEnums.NOT_FOUND };
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_GETTING_DATA + e);
    return { return: false, message: errorEnums.FAILED_GETTING_DATA + e };
  }
};

/*---------------------------------------------------------------------------------------------------------- */
// used in: userControllers | removes accessToken from db
export const removeAccessToken = async (
  accessToken: string
): Promise<boolean> => {
  try {
    const { deletedCount: accessDeleted }: { deletedCount?: number | undefined } = await AccessToken.deleteOne({ accessToken });
    console.log('Access Token Deleted');
    if (accessDeleted && accessDeleted > 0) {
      return true;
    }
    console.log(errorEnums.NOT_FOUND);
    return false;
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_DELETING_DATA + e);
    return false;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
// used in: userController | removes refreshToken from db
export const removeRefreshToken = async (
  refreshToken: string
): Promise<boolean> => {
  try {
    const { deletedCount: refreshDeleted }: { deletedCount?: number | undefined } = await RefreshToken.deleteOne({ refreshToken });
    if (refreshDeleted && refreshDeleted > 0) {
      console.log('Refresh Token Deleted');
      return true;
    }
    console.log(errorEnums.NOT_FOUND);
    return false;
  } catch (e) {
    console.log(errorEnums.FAILED_DELETING_DATA + e);
    return false;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
//  used in: userControllers | saves a refreshToken in db
export const saveRefreshToken = async (
  refreshToken: string
): Promise<boolean> => {
  try {
    await RefreshToken.create({ refreshToken });
    console.log('Refresh Token Saved');

    return true;
  } catch (e) {
    console.log(errorEnums.FAILED_ADDING_DATA + e);
    return false;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
//  used in: userControllers | saves a accessToken in db
export const saveAccessToken = async (
  accessToken: string
): Promise<boolean> => {
  try {
    await AccessToken.create({ accessToken });
    console.log('Access Token Saved');
    return true;
  } catch (e) {
    console.log(errorEnums.FAILED_ADDING_DATA + e);
    return false;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
// used in: userController | checks if refreshToken exists in db 
export const isRefreshSaved = async (refreshToken: string):Promise<Boolean> => {
  return Boolean(await RefreshToken.findOne({ refreshToken }));
};

/*---------------------------------------------------------------------------------------------------------- */
//  used in: middlewares/index | checks if accessToken exists in db 
export const isAccessSaved = async (accessToken: string):Promise<Boolean>=> {
  return Boolean(await AccessToken.findOne({ accessToken }));
};
