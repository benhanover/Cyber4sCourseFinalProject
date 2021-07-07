// import libraries
import mongoose, { Model, Document } from "mongoose";

// import models
import { User, Room, RefreshToken, AccessToken } from "./models";

// import intefaces
import { Iuser, Iroom, IreturnInfo, Umodels } from "../types/index";
import { errorEnums } from "../enums";

// import models
import { getModel } from "./assistance-functions";

/*---------------------------------------------------------------------------------------------------------- */
// used in: userControllers | checks wether the username and email are avalable.
export const canRegister = async (
  email: string,
  username: string
): Promise<IreturnInfo> => {
  try {
    const users: Iuser[] = await User.find({
      $or: [{ email }, { username }],
    });
    let returnObjCaseExist: IreturnInfo | undefined;
    users.find((user: Iuser): void => {
      if (user.email === email) {
        console.log(errorEnums.EMAIL_TAKEN);
        returnObjCaseExist = { return: false, message: errorEnums.EMAIL_TAKEN };
      } else if (user.username === username) {
        console.log(errorEnums.USERNAME_TAKEN);
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
    // console.log("room.host:", room.host);
    const hostRooms = await Room.find({ host: room.host }, ['title']);
    if (hostRooms[0] && hostRooms.some(r => room.title === r.title )) {
      console.log("Host already has a room with this title");
      return false;
    }
    const updatedRoom: Iroom = await Room.create(room);
    console.log("mongofunction line 73 ", updatedRoom);
    if (Boolean(updatedRoom._id)) return updatedRoom;
    console.log(errorEnums.FAILED_ADDING_DATA);
    return false;
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_ADDING_DATA + e);
    return false;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
//  used in: roomControllers | returns all rooms from db
export const getRooms = async (): Promise<Iroom[]> => {
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
export const findDocument = async (
  modelString: string,
  field: string,
  fieldContent: any
): Promise<Umodels> => {
  const model: typeof Model | undefined = getModel(modelString);
  if (!model) {
    console.log(errorEnums.NO_MODEL_ENUM);
    return {
      return: false,
      message: "Missing parameter line 68 ,mongo-functions",
    };
  }
  try {
    const foundDocument: Umodels = await model.findOne({
      [field]: fieldContent,
    });

    return foundDocument
      ? foundDocument
      : { return: false, message: modelString + errorEnums.NOT_FOUND };
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_GETTING_DATA + e);
    return { return: false, message: errorEnums.FAILED_GETTING_DATA + e };
  }
};
/*---------------------------------------------------------------------------------------------------------- */
// used in: userControllers | finds a document by model and field
export const updateDocument = async (
  modelString: string,
  fieldToFind: string,
  fieldToFindContent: any,
  fieldToUpdate: string,
  fieldToUpdateContent: any
): Promise<Umodels> => {
  const model: typeof Model | undefined = getModel(modelString);
  if (!model) {
    console.log(errorEnums.NO_MODEL_ENUM);
    return {
      return: false,
      message: "Missing parameter line 68 ,mongo-functions",
    };
  }
  try {
    console.log("before updating");

    const updatedDocument: any = await model.updateOne(
      {
        [fieldToFind]: fieldToFindContent,
      },
      { $push: { [fieldToUpdate]: fieldToUpdateContent } },
      { new: true }
    );

    console.log("updatedDocument:", updatedDocument);

    return updatedDocument
      ? updatedDocument
      : { return: false, message: modelString + errorEnums.NOT_FOUND };
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
    const {
      deletedCount: accessDeleted,
    }: { deletedCount?: number | undefined } = await AccessToken.deleteOne({
      accessToken,
    });
    console.log("Access Token Deleted");
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
    const {
      deletedCount: refreshDeleted,
    }: { deletedCount?: number | undefined } = await RefreshToken.deleteOne({
      refreshToken,
    });
    if (refreshDeleted && refreshDeleted > 0) {
      console.log("Refresh Token Deleted");
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
    console.log("Refresh Token Saved");

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
    console.log("Access Token Saved");
    return true;
  } catch (e) {
    console.log(errorEnums.FAILED_ADDING_DATA + e);
    return false;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
// used in: userController | checks if refreshToken exists in db
export const isRefreshSaved = async (
  refreshToken: string
): Promise<Boolean> => {
  return Boolean(await RefreshToken.findOne({ refreshToken }));
};

/*---------------------------------------------------------------------------------------------------------- */
//  used in: middlewares/index | checks if accessToken exists in db
export const isAccessSaved = async (accessToken: string): Promise<Boolean> => {
  return Boolean(await AccessToken.findOne({ accessToken }));
};
/*---------------------------------------------------------------------------------------------------------- */
export const removePartecipentfromRoom = async (
  roomId: string,
  participant: any
): Promise<any> => {
  console.log("the room id", roomId);

  try {
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      console.log(room, "noooooot roooom");
      return false;
    }
    const modifiedParticipants = room.participants.filter((user: any) => {
      return user.peerId !== participant.peerId;
    });
    room.participants = modifiedParticipants;
    await room
      .save();
    return modifiedParticipants;
  } catch (e) {
    console.log(e, "cuoldnt find room");
    return e;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
// used in: userController update | change field in the profile
export const updateUserByField = async (
  email: string,
  place: string,
  fieldToUpdate: string,
  contentOfTheUpdate: unknown
) => {
  try {
    const user = await User.findOne({ email: email });
    switch (place) {
      case "user":
        user[fieldToUpdate] = contentOfTheUpdate;
        break;
      case "profile":
        user.profile[fieldToUpdate] = contentOfTheUpdate;
        break;
      default:
        console.log("mongo-functions updateUserByField default in switch");
    }
    await user.save();
    return user;
  } catch (e) {
    console.log(e);
    return false;
  }
};
/*---------------------------------------------------------------------------------------------------------- */
export const updateEmailOrUsername = async (email: string, place: string, field: string, update: string) => {
  const users = await User.find();
  const userExist = users.find((user) => user[field] === update);
  if (userExist) return false;
  const user = await User.findOne({ email });
  user[field] = update;
  await user.save();
  return user;
};

/*---------------------------------------------------------------------------------------------------------- */
// used in userController getAllUsers | get all users from the database
export const getUsers = async () => {
  try {
    return await User.find();
  } catch (e) {
    console.log(e);
  }
};

/*---------------------------------------------------------------------------------------------------------- */
// used in userController getUserProfile | get spesific user from the DB
export const getUser = async (username: any) => {
  try {
    return User.findOne({ username });
  } catch (e) {
    console.log(e);
  }
};
//find many document from a model
/*---------------------------------------------------------------------------------------------------------- */
export const findManyDocuments = async (
  modelString: string,
  field: string,
  contentsArray: []
): Promise<Umodels[] | Umodels> => {
  const model: typeof Model | undefined = getModel(modelString);
  if (!model) {
    console.log(errorEnums.NO_MODEL_ENUM);
    return {
      return: false,
      message: "Missing parameter line 68 ,mongo-functions",
    };
  }
  try {
    const Documents: Umodels[] = await model.find({
      [field]: { $in: contentsArray },
    });

    return Documents
      ? Documents
      : { return: false, message: modelString + errorEnums.NOT_FOUND };
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_GETTING_DATA + e);
    return { return: false, message: errorEnums.FAILED_GETTING_DATA + e };
  }
};

/*---------------------------------------------------------------------------------------------------------- */
export const isRoomPasswordValid = async (roomId: any, password: any) => {
  try {
    return await Room.findOne({_id: roomId})
  } catch(e) {
    console.log(e);
  }
} 
/*---------------------------------------------------------------------------------------------------------- */


export const closeRoom = async(roomId: any, value: any) => {
  console.log('im here');
  
  try {
    const room = await Room.findOne({_id: roomId});
    room.isClosed = value;
    console.log(room);
    await room.save();
  } catch(e) {
    console.log(e)
  }
}