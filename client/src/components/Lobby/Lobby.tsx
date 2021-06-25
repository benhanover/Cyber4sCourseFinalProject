// import libraries
import React, {  useEffect } from 'react';
import { useDispatch, useSelector,  } from 'react-redux';
import { bindActionCreators } from 'redux';
// import types
import { ImessageBox, Iroom } from './interfaces';
// import components
import LogoutButton from '../Common/LogoutButton/LougoutButton';
// import redux-states
import { wsActionCreator, roomsActionCreator, State} from '../../state/index';
import NewRoomForm from './NewRoomForm/NewRoomForm';

/*================================================================================================*/


//  creates a WebSocket connection with the server, display all rooms through the WebSocket.
const Lobby: React.FC = () => {
  const dispatch = useDispatch();
  const { ws, rooms } = useSelector((state: State) => state);
  const { user } = ws;
  const { setWS, setUser } = bindActionCreators({ ...wsActionCreator }, dispatch)
  const { setRooms, addRoom } = bindActionCreators({ ...roomsActionCreator}, dispatch)
  
  useEffect(() => {
    console.log("rooms useEffect",  rooms);
    
  },[rooms]);
  useEffect(() => {
    // create connection to the websocket server  
    const newWS = new WebSocket('ws://localhost:4000');
    newWS.onopen = () => {
      console.log("connected to server");

    }
    
    // message handler
    newWS.onmessage = messageHandler;
    
    //set the state
    setWS(newWS)
  
    //cleanup
    return () => {
      newWS.close()
    }
  }, []);

 



// Functions
/*------------------------------------------------------------------------------------------------------*/
  
  //  handles all message events from the server
  const messageHandler=(messageBoxEvent: MessageEvent<string>, ) => {
    const messageData: ImessageBox = JSON.parse(messageBoxEvent.data);
    console.log(rooms);
    
    switch (messageData.type) {
      case 'rooms':
        console.log("in rooms!" , rooms);
        if (typeof messageData.message === 'string') return;////??
        console.log("rooms from server:", messageData.message);
        
        setRooms(messageData.message);
        break;
      case "new room was created":
        console.log("in here?",rooms );
        if (typeof messageData.message === 'string') return;////??
        console.log(messageData.message , "and" , rooms);
        addRoom(messageData.message);
        break;  
      case "room deleted":
        setRooms(rooms?.filter((room: Iroom) => { //???
          return room._id !== messageData.message._id
        }));
        break;
      case "socket":
        
        user.mySocket=messageData.message
        setUser(user)
        break;
      default:
        break;
    }
  }

return (
  <div>
    <LogoutButton />
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
    <NewRoomForm />
  </div>
); 
  
};

export default Lobby;
