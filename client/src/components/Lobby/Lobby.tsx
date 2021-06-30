// import libraries
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import './Lobby.css'
// import types
import { ImessageBox, Iroom } from "./interfaces";
// import redux-states
import { wsActionCreator, roomsActionCreator, State } from "../../state/index";
import NewRoomForm from "./NewRoomForm/NewRoomForm";
import Room from "./Room/Room";
import { ReactElement } from "react";

/*================================================================================================*/

//  creates a WebSocket connection with the server, display all rooms through the WebSocket.
const Lobby: React.FC = () => {
  const dispatch = useDispatch();
  const { ws, rooms } = useSelector((state: State) => state);
  const { user, chosenRoom } = ws;
  const { setWS, setUser } = bindActionCreators(
    { ...wsActionCreator },
    dispatch
  );
  const { setRooms, addRoom, removeRoom } = bindActionCreators(
    { ...roomsActionCreator },
    dispatch
  );
  useEffect(() => {
    // create connection to the websocket server
    const newWS = new WebSocket("ws://192.168.1.111:4000");
    newWS.onopen = () => {
      console.log("connected to server");
    };

    // // message handler
    newWS.onmessage = messageHandler;

    //set the state
    setWS(newWS);

    //cleanup
    // return () => {
    //   newWS.close()

    // }
  }, []);

  // Functions
  /*------------------------------------------------------------------------------------------------------*/

  //  handles all message events from the server
  function messageHandler(messageBoxEvent: MessageEvent<string>) {
    const messageData: ImessageBox = JSON.parse(messageBoxEvent.data);
    // console.log("in message hendler");

    switch (messageData.type) {
      case "rooms":
        // console.log("rooms", rooms);

        if (typeof messageData.message === "string") return;
        setRooms(messageData.message);
        break;
      case "new room was created":
        if (typeof messageData.message === "string") return;
        addRoom(messageData.message);
        break;
      case "room deleted":
        removeRoom(messageData.message);
        break;
      case "socket":
        user.mySocket = messageData.message;
        setUser(user);
        break;
      default:
        break;
    }
  }

  return (
  <>
    {chosenRoomDisplay(chosenRoom)}
    <NewRoomForm />
  <div className="rooms-container">
    {rooms?.map((room: Iroom | null, i: number) => {
      if (!room) return;
      return (
        <Room key={i} room={ room } chosen={false} />
        
        );
    })}
      </div>
      </>
); 
  
  function chosenRoomDisplay(chosenRoom: Iroom | null): ReactElement | null{
    if (chosenRoom === null) return null;
    const roomChosed: Iroom = chosenRoom;
    return <Room room={roomChosed} chosen={true} />;
  }
};

export default Lobby;
