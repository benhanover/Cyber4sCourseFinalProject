// import libraries
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import "./Lobby.css";
import { useHistory } from "react-router-dom";
// import enums
import { enums } from "../../utils/enums";

// import types
import { ImessageBox, Iroom } from "./interfaces";
// import redux-states
import { wsActionCreator, roomsActionCreator, State } from "../../state/index";
import NewRoomForm from "./NewRoomForm/NewRoomForm";
import Room from "./Room/Room";
import JoinRoomFilter from "./JoinRoomFilter/JoinRoomFilter";
import { ReactElement } from "react";

/*================================================================================================*/

//  creates a WebSocket connection with the server, display all rooms through the WebSocket.
const Lobby: React.FC = () => {
  const dispatch = useDispatch();
  const { ws, rooms } = useSelector((state: State) => state);
  const { user, chosenRoom, serverSocket } = ws;
  const { setWS, setUser } = bindActionCreators(
    { ...wsActionCreator },
    dispatch
  );
  const { setRooms, addRoom, removeRoom } = bindActionCreators(
    { ...roomsActionCreator },
    dispatch
  );
  const [showCreateRoom, setShowCreateRoom] = useState<any>(false);
  const history = useHistory();
  const [joinFormStateManager, setJoinFormStateManager] = useState<any>({
    subject: "Math",
    subSubject: "",
    search: "",
    limit: "",
    isLocked: false,
  });

  useEffect(() => {
    if (serverSocket) return;
    // create connection to the websocket server
    const newWS = new WebSocket(`ws://${enums.wsUrl}`);
    newWS.onopen = () => {
      console.log("connected to server");
    };

    newWS.onmessage = messageHandler;
    setWS(newWS);
  }, []);

  // useEffect(() => {
  //   console.log(joinFormStateManager);
  // }, [joinFormStateManager])

  // Functions
  /*------------------------------------------------------------------------------------------------------*/

  // handles all message events from the server
  function messageHandler(messageBoxEvent: MessageEvent<string>) {
    const messageData: ImessageBox = JSON.parse(messageBoxEvent.data);

    switch (messageData.type) {
      case "rooms":
        // console.log("rooms", messageData.message);
        if (typeof messageData.message === "string") return;
        setRooms(messageData.message);
        break;
      case "new room was created":
        if (typeof messageData.message === "string") return;
        // console.log("got in", messageData.message, "and", rooms);

        addRoom(messageData.message);
        break;
      case "room deleted":
        removeRoom(messageData.message);
        break;
      case "socket":
        user.mySocket = messageData.message;
        setUser(user);
        break;
      case "the room you created  is ready":
        history.push("/room?roomId=" + messageData.message);
        break;
      default:
        break;
    }
  }
  return (
    <>
      <JoinRoomFilter
        joinFormStateManager={joinFormStateManager}
        setJoinFormStateManager={setJoinFormStateManager}
      />
      {showCreateRoom && <NewRoomForm />}
      <button onClick={() => setShowCreateRoom(!showCreateRoom)}>
        Create Room
      </button>
      {chosenRoomDisplay(chosenRoom)}
      {/* <NewRoomForm /> */}
      <div className="rooms-container">
        {rooms.length > 0 &&
        rooms
        ?.filter((room: any) => room?.isClosed === false && room.participants.length < room.limit)
        .filter((room: any) => {
          if (
            (room.subject === joinFormStateManager.subject || joinFormStateManager.subject === "") &&
            (room.subSubject.match(joinFormStateManager.subSubject) || joinFormStateManager.subSubject === "") &&
            (room.limit === Number(joinFormStateManager.limit) || joinFormStateManager.limit === "") &&
            (room.isLocked === joinFormStateManager.isLocked) &&
            (room.title.match(joinFormStateManager.search)  || joinFormStateManager.search === "" || room.description.match(joinFormStateManager.search))
          ) 
            return true
        })
        .map((room: Iroom | null, i: number) => {
          if (!room) return;
          return <Room key={i} room={room} chosen={false} />;
        })}
      </div>
    </>
  );

  function chosenRoomDisplay(chosenRoom: Iroom | null): ReactElement | null {
    if (chosenRoom === null) return null;
    const roomChosed: Iroom = chosenRoom;
    return <Room room={roomChosed} chosen={true} />;
  }
};

export default Lobby;
