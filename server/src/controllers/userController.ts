// import from liraries
import { Request, Response } from 'express';
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import {Document} from "mongoose"
const { hash, compare } = bcrypt;
// import interfaces
import { Iuser } from '../interfaces/index';

// import mongo-functions
import { canRegister, registerUser , findDocument} from '../mongo/mongo-functions';


export const register =  async (req: Request, res: Response) => {
    const { lastName, firstName, email, password, birthDate, username } = req.body;
    
    const registrationAvailability = await canRegister(email, username);
    if (!registrationAvailability.return){
      return res.status(409).send('Could Not Register: ' + registrationAvailability.message);
    }

    const hashPassword: string = await hash(password, 10);
    const user: Iuser = { lastName, firstName, email, password: hashPassword, birthDate, username }
    
    const registered = await registerUser(user);
  if (!registered) return res.status(500).send("Could Not Register")
    return res.send("Registered Successfully")
  }
  

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const foundUser = await findDocument("User", "email", email);
  console.log("email", email, "password", password);
  
  // all but Iuser
  if (!('username' in foundUser)) {
    return res.status(409).send("One or two of the following is incorrect");
  }
  
  try {
    const isPasswordCorrect = await compare(password, foundUser.password);
    if (!isPasswordCorrect) {
      return res.status(409).send("Password Is Incorrect");
    }
    
    return res.send("Connected Successfuly");
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }




















  
    // const userData = { username };
    // const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "10s",
    //   });
    //   const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    //       expiresIn: "4h",
    //     });
    }
      
      //   RefreshTokens.create(
  //     {
  //       refresh_token: refreshToken,
  //       expires_at: new Date().getTime() / 1000 + 14400,
  //       username,
  //     },
  //     { fields: ["refresh_token", "expires_at", "username"] }
  //   );
  //   return res.json({ accessToken, refreshToken });
  // } catch (error) {
  //   console.log(error);
  //   res.sendStatus(500);
  // }
