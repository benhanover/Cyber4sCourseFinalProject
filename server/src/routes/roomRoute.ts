import { Router, Request, Response } from "express";
const rooms = Router();
import RoomObj from "../types/index";
const mockRooms: RoomObj[] = [
  {
    name: "first Room",
    id: "adgrfadf-54656afdg-5sdf4g65-sdfg465dfg",
    participants: ["firstUser", "secondUser", "thirdUser"],
  },
  {
    name: "second Room",
    id: "adgrfadf-54656afdg-5sdf4g65-sdfg465dfg",
    participants: ["firstUser", "secondUser", "thirdUser"],
  },
  {
    name: "third Room",
    id: "adgrfadf-54656afdg-5sdf4g65-sdfg465dfg",
    participants: ["firstUser", "secondUser", "thirdUser"],
  },
  {
    name: "fourth Room",
    id: "adgrfadf-54656afdg-5sdf4g65-sdfg465dfg",
    participants: ["firstUser", "secondUser", "thirdUser"],
  },
];

rooms.get("/all", (req: Request, res: Response) => {
  return res.json(mockRooms);
});

rooms.post("/new", (req: Request, res: Response) => {
  const { name, id, participants } = req.body;
  mockRooms.push({ name, id, participants });
  res.send("updated successfully");
});

export default rooms;
