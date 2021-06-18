// import from liraries
import { Request, Response } from 'express';
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

// import interfaces
import { Iuser } from '../interfaces/index';

// import mongo-functions
import { canRegister, registerUser } from '../mongo/mongo-functions';
import { User } from '../mongo/models';

const { hashSync, compare } = bcrypt;
const pass = hashSync('sfdgnakjasdf', 10);
console.log(pass);


  export const register =  async (req: Request, res: Response) => {
      const { lastName, firstName, email, password, birthDate, username } = req.body;
      
      const registrationAvailability = await canRegister(email, username);
      if (!registrationAvailability.return){
       return res.status(409).send('Could Not Register: ' + registrationAvailability.message);
      }
      console.log(birthDate);
      
      const hashPassword: string = hashSync(password, 10);
      const user: Iuser = { lastName, firstName, email, password: hashPassword, birthDate, username }
      
      const registered = await registerUser(user);
      if (registered) return res.send("Registered Successfully")
      return res.status(500).send("Could Not Register")

    }
  
  export const login =  async (req: Request, res: Response) => {
//     // const { email, password } = req.body;
//     // ////////////if there are no usuername or password
//     let foundUser: Iuser | undefined
//     // try 
//     {foundUser = await User.findOne({email});}
//     // catch(e){
//     //   console.log(e);
//     //   res.send("Coulnt login -internal error")// add status
//     // }
//     // if (!foundUser) {
//     //   return res.status(409).send("One or tow of the following is incorrect");
//     // }
  
//     // try {
//     //   const isPasswordCorrect = await compare(password, foundUser.password);
//     //   if (!isPasswordCorrect) {
//     //     return res.status(409).send("password is incorrect");
//     //   }
//     //   const userData = { username };
//     //   const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
//     //     expiresIn: "10s",
//     //   });
//     //   const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
//     //     expiresIn: "4h",
//     //   });
  
//     //   RefreshTokens.create(
//     //     {
//     //       refresh_token: refreshToken,
//     //       expires_at: new Date().getTime() / 1000 + 14400,
//     //       username,
//     //     },
//     //     { fields: ["refresh_token", "expires_at", "username"] }
//     //   );
//     //   return res.json({ accessToken, refreshToken });
//     // } catch (error) {
//     //   console.log(error);
//     //   res.sendStatus(500);
//     // }
  }