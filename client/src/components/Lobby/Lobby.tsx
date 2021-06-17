import React, { useState, useEffect } from "react";
import { RoomObj } from "./interfaces";
import axios from "axios";
import { v1 as uuid } from "uuid";
const Lobby: React.FC = () => {
  const [rooms, setRooms] = useState<RoomObj[] | undefined>();

  useEffect(() => {
    axios.get("http://localhost:4000/room/all").then(({ data: rooms }) => {
      console.log(rooms);
      setRooms(rooms);
    });

    //
    // setRooms(mockRooms);
  }, []);
  const createRoom = (): void => {
    rooms?.push({
      name: "first Room",
      id: uuid(),
      participants: ["firstUser", "secondUser", "thirdUser"],
    });
    setRooms(rooms?.slice());
  };

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      {rooms?.map((room: RoomObj, i: number) => {
        return (
          <div className="room">
            <p key={i}>{room.name}</p>
            <p key={i}>{room.id}</p>
            {room.participants.map((user: string, j: number) => {
              return <p key={j}>{user}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Lobby;
