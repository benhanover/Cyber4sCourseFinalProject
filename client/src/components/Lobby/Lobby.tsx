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
   
  }, []);
  const createRoom = (): void => {
    const mockRoom = {
      id: 'dsfjhnb43-32jfdsfds-fb2-ajsdbna2',
      host: 'fjkednj-fafd56-324fsh-3asdsr3e',
      subject: 'Mathmatics',
      subSubject: 'Geometric',
      title: 'Geomtric is so awsome!',
      description: 'high school level geometric, doing some bagrut excercises',
      participants: ['sdffdh-hsasw-jsh63-sdfs-gfd', 'fdshj-s4e5t-neswdcvyj-63e', 'dfrdy6c-dsf2qch6-a24g-2sdg'],
      limit: 3,
      isLocked: true
    }
    axios.post('http://localhost:4000/room/new', mockRoom)
      .then(() => {
        setRooms(rooms?.slice());
      })
      .catch(console.log);
  }

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
