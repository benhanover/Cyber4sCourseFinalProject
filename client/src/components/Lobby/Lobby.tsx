import React, { useState, useEffect } from 'react';
import { ImessageBox, Iroom } from './interfaces';
import axios from 'axios';
import { v1 as uuid } from 'uuid';
import Network from '../../utils/network';
import LogoutButton from '../Common/LogoutButton/LougoutButton';
import { send } from 'process';




const Lobby: React.FC = () => {
  const [rooms, setRooms] = useState<Iroom[] | undefined>();

  useEffect(() => {
    // const ws = new WebSocket('ws://localhost:4000');
    // ws.addEventListener('open', (socket) => {
    //   console.log("connected to server");
    // })
    // ws.addEventListener('message', (messageBoxString: MessageEvent<ImessageBox>) => {
    //   const messageBox: ImessageBox = JSON.parse(messageBoxString.data)
    //   switch (messageBox.type) {
    //     case 'rooms':
    //       if (typeof messageBox.message === 'string') return;
    //       setRooms(messageBox.message);
    //       break;
        
    //     default:
    //       break;
    //   }
    // })
    Network('GET', 'http://localhost:4000/room/all').then((rooms: any) => {
      if (!Array.isArray(rooms)) return;
      setRooms(rooms);
    });

    //
    return () => {
      // ws.close()
    }
  }, []);
  const createRoom = (): void => {
    const mockRoom: Iroom = {
      host: 'fjkednj-fafd56-324fsh-3asdsr3e',
      subject: 'Mathmatics',
      subSubject: 'Geometric',
      title: 'Geomtric is so awsome!',
      description: 'high school level geometric, doing some bagrut excercises',
      participants: [
        'sdffdh-hsasw-jsh63-sdfs-gfd',
        'fdshj-s4e5t-neswdcvyj-63e',
        'dfrdy6c-dsf2qch6-a24g-2sdg',
      ],
      limit: 3,
      isLocked: true,
    };
    Network('POST', 'http://localhost:4000/room/new', mockRoom)
      .then(({ data }) => {
        rooms?.push(data.newRoom);
        setRooms(rooms?.slice());
      })
      .catch(console.log);
  };

  return (
    <div>
      <LogoutButton />
      <button onClick={createRoom}>Create Room</button>
      {rooms?.map((room: Iroom, i: number) => {
        return (
          <div className='room'>
            <p key={i}>{room.title}</p>
            <p key={i}>{room._id}</p>
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
