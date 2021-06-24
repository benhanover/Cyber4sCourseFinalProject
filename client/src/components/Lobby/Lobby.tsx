// import libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v1 as uuid } from 'uuid';
import { useDispatch, useSelector,  } from 'react-redux';
import { bindActionCreators } from 'redux';

// import types
import { ImessageBox, Iroom } from './interfaces';

// import network
import Network from '../../utils/network';

// import components
import LogoutButton from '../Common/LogoutButton/LougoutButton';

// import redux-states
import { wsActionCreator } from '../../state/index';



const Lobby: React.FC = () => {
  
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState<Iroom[] | undefined>();
  const { ws } = useSelector((state: any) => state)
  const {setWS } = bindActionCreators({...wsActionCreator} ,dispatch)
  
  useEffect(() => {
    // create connection to the websocket server  
    const newWS = new WebSocket('ws://localhost:4000');
    newWS.onopen = () => {
      console.log("connected to server");
    }
    
    // message handler
    newWS.onmessage = messageHandler;
    setWS(newWS)
    // Network('GET', 'http://localhost:4000/room/all').then((rooms: any) => {
    //   if (!Array.isArray(rooms)) return;
    //   setRooms(rooms);
    // });
        
    //cleanup
    return () => {
      newWS.close()
    }
  }, []);

  useEffect(() => {
   console.log(ws);
  }, [ws])
  

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
      <button onClick={() => {
        ws.send({type: "creating new room", message: {}})
        // setWS("dddddddd")
      }}>test</button>
    </div>
  );



// Functions
// ===========
  
function messageHandler(messageBoxEvent: MessageEvent<string>){
  const messageData: ImessageBox = JSON.parse(messageBoxEvent.data);
  
  switch (messageData.type) {
    case 'rooms':
      console.log("in rooms!");
      if (typeof messageData.message === 'string') return;
      setRooms(messageData.message);
      break;
      
    default:
      break;
  }
}

function createRoom(): void {
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
  ws.send(JSON.stringify({type: "creating new room", message: mockRoom}))
  Network('POST', 'http://localhost:4000/room/new', mockRoom)
    .then(({ data }) => {
      rooms?.push(data.newRoom);
      setRooms(rooms?.slice());
    })
    .catch(console.log);
};


};

export default Lobby;
