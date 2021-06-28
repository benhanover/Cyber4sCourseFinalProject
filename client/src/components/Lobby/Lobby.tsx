// import libraries
import React, {  FC, useEffect, useState } from 'react';
import { useDispatch, useSelector,  } from 'react-redux';
import { bindActionCreators } from 'redux';

// import types
import { ImessageBox, Iroom } from './interfaces';

// import redux-states
import { wsActionCreator, roomsActionCreator, State} from '../../state/index';
import NewRoomForm from './NewRoomForm/NewRoomForm';
import Room from './Room/Room';
import { ReactElement } from 'react';

/*================================================================================================*/

//  creates a WebSocket connection with the server, display all rooms through the WebSocket.
const Lobby: React.FC = () => {
  const dispatch = useDispatch();
  const { ws, rooms } = useSelector((state: State) => state);
  const { user, chosenRoom } = ws;
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
    {rooms?.map((room: Iroom | null, i: number) => {
      if (!room) return;
      return (
        <Room key={i} room={ room } chosen={false} />
        
        );
    })}
    {chosenRoomDisplay(chosenRoom)}
    <NewRoomForm />
  </div>
); 
  
  function chosenRoomDisplay(chosenRoom: Iroom | null): ReactElement | null{
    if (chosenRoom === null) return null;
    const roomChosed: Iroom = chosenRoom
    return (<Room room={roomChosed} chosen={true} />)
  }
};

export default Lobby;
