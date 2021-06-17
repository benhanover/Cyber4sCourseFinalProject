import { Router, Request, Response } from "express";
const users = Router();

users.post("/login", (req: Request, res: Response) => {
  console.log("Holas!!");

  const { email, password } = req.body;
});

users.post("/register", (req: Request, res: Response) => {
  const { lastName, firstName, email, password } = req.body;
});

export default users;
