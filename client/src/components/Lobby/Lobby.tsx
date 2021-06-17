import React, { useState, useEffect } from 'react';
import { RoomObj } from './interfaces';
import { v1 as uuid } from 'uuid';
const Lobby: React.FC = () => {
  const [rooms, setRooms] = useState<RoomObj[] | undefined>();

  useEffect(() => {
    const mockRooms: RoomObj[] = [
      {
        name: 'first Room',
        id: 'adgrfadf-54656afdg-5sdf4g65-sdfg465dfg',
        participants: ['firstUser', 'secondUser', 'thirdUser'],
      },
      {
        name: 'second Room',
        id: 'adgrfadf-54656afdg-5sdf4g65-sdfg465dfg',
        participants: ['firstUser', 'secondUser', 'thirdUser'],
      },
      {
        name: 'third Room',
        id: 'adgrfadf-54656afdg-5sdf4g65-sdfg465dfg',
        participants: ['firstUser', 'secondUser', 'thirdUser'],
      },
      {
        name: 'fourth Room',
        id: 'adgrfadf-54656afdg-5sdf4g65-sdfg465dfg',
        participants: ['firstUser', 'secondUser', 'thirdUser'],
      },
    ];
    setRooms(mockRooms);
  }, []);
  const createRoom = (): void => {
    rooms?.push({
      name: 'first Room',
      id: uuid(),
      participants: ['firstUser', 'secondUser', 'thirdUser'],
    });
    setRooms(rooms?.slice());
  };

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      {rooms?.map((room: RoomObj, i: number) => {
        return (
          <div className='room'>
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
