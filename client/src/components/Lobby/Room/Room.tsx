import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { wsActionCreator, State, roomsActionCreator } from "../../../state";
import { IroomProps } from "./interfaces";
import { useHistory } from "react-router-dom";
import "./Room.css";
import { setRooms } from "../../../state/action-creators/roomsActionCreator";

const Room: FC<IroomProps> = ({ room, chosen }) => {
  const dispatch = useDispatch();
  const { chosenRoom } = useSelector((state: State) => state.ws);
  const rooms = useSelector((state: State) => state.rooms);
  const { setChosenRoom } = bindActionCreators(
    { ...wsActionCreator },
    dispatch
  );
  const history = useHistory();
  // useEffect(()=>{
  //  const updatedRoom = rooms.filter((roomItem)=>{
  //     return roomItem._id = room._id
  //   });
  //   setRoom(updatedRoom[0])
  // },[rooms])
  useEffect(() => {
    return () => {
      setChosenRoom(null);
    };
  }, []);
  if (chosen) {
    return (
      <div key={42} className="chosen room">
        <span key={1} onClick={() => setChosenRoom(null)}>
          X
        </span>
        <p key={2}>{room.title}</p>
        <p key={3}>{`${room.subject} > ${room.subSubject}`}</p>
        <p key={4}>{room.subSubject}</p>
        <p key={5}>{room.description}</p>
        <p key={6}>{room.limit}</p>
        <p key={7}>{room.isLocked ? "Locked" : "opened"}</p>
        {room.participants
          ? room.participants.map((profile: any, i: number) => {
              return <p key={i}>{profile.username}</p>;
            })
          : null}
        <button key={9} onClick={() => goToRoom(room._id)}>
          Join Room
        </button>
      </div>
    );
  }
  return (
    <div
      className="room"
      onClick={() =>
        chosenRoom !== room ? setChosenRoom(room) : setChosenRoom(null)
      }
    >
      <p>{room.title}</p>
      <p>{`${room.subject} > ${room.subSubject}`}</p>
      <p>{room.subSubject}</p>
      <p>{room.description}</p>
      <p>{room.limit}</p>
      <p>{room.isLocked ? "Locked" : "opened"}</p>
    </div>
  );
  function goToRoom(roomId: string | undefined) {
    if (!roomId) return;
    // console.log(roomId);
    history.push("/room?roomId=" + roomId);
  }
};

export default Room;
//
