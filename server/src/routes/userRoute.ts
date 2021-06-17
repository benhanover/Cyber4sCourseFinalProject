import { Router, Request, Response } from "express";
import { User } from "../mongo/models";
import { Iuser } from "../types";
const users = Router();

users.post("/login", (req: Request, res: Response) => {
  console.log("Holas!!");

  const { email, password } = req.body;
});

users.post("/register", (req: Request, res: Response) => {
  const { lastName, firstName, email, password, birthDate, username } =
    req.body;
  User.find({ $or: [{ email }, { username }] }).then((users: Array<Iuser>) => {
    const alreadyExist = users.find((user) => {
      if (user.email === email) {
        res.send("email allready exist");
        return true;
      } else if (user.username === username) {
        res.send("username allready exist");
        return true;
      }
    });
    if (alreadyExist) return;

    User.create({
      lastName,
      firstName,
      email,
      password,
      birthDate,
      username,
    })
      .then(() => {
        console.log("register succesfuly");
        res.send("register succesfuly");
      })
      .catch((e: Error) => {
        console.log("could not register:", e);
        res.send("could not register: " + e.message);
      });
  });
});

export default users;
