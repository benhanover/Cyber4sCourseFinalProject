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
  const { setRooms, addRoom, removeRoom } = bindActionCreators({ ...roomsActionCreator}, dispatch)
  
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
    
    switch (messageData.type) {
      case 'rooms':
        if (typeof messageData.message === 'string') return;
        setRooms(messageData.message);
        break;
      case "new room was created":
        if (typeof messageData.message === 'string') return;
        addRoom(messageData.message);
        break;  
      case "room deleted":
        removeRoom(messageData.message);
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
    {rooms?.map((room: Iroom | null, i: number) => {
      if (!room) return;
      return (
        <div key={i} className='room'>
          <p >{room.title}</p>
          <p >{room._id}</p>
        </div>
        
        );
      })}
    <NewRoomForm />
  </div>
); 
  
};

export default Lobby;
