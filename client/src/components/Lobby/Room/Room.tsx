import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { wsActionCreator, State, roomsActionCreator } from "../../../state";
import { IroomProps } from "./interfaces";
import { useHistory } from "react-router-dom";
import "./Room.css";
import { setRooms } from "../../../state/action-creators/roomsActionCreator";

// import components
import ProfileTicket from './ProfileTicket/ProfileTicket';

const Room: FC<IroomProps> = ({ room, chosen }) => {
  const dispatch = useDispatch();
  const { chosenRoom } = useSelector((state: State) => state.ws);
  const rooms = useSelector((state: State) => state.rooms);
  const { setChosenRoom } = bindActionCreators(
    { ...wsActionCreator },
    dispatch
  );
  const history = useHistory();

  useEffect(() => {
    return () => {
      setChosenRoom(null);
    };
  }, []);
  if (chosen) {
    return (
      <div className="chosen-background" onClick={(e)=> setChosenRoom(null)}>
        <div key={42} className="chosen room" onClick={(e) => e.stopPropagation()}>

        <span key={1} className="close-chosen-button" onClick={() => setChosenRoom(null)}>
          X
        </span>
        <p key={2} className="title">{room.title}</p>
        <p key={3} className="subject">{`${room.subject} > ${room.subSubject}`}</p>
        <p key={5} className="description">{room.description}</p>
        <p key={7} className="isLocked">{room.isLocked ? "Locked" : "opened"}</p>
        <ProfileTicket participants={room.participants}/>

        {room.participants.length > 0
              ?
          <div className="room-participants">
              <p key={6} className="limit">{ room.participants.length}/{room.limit}</p>
                {room.participants.map((profile: any, i: number) => {
                  return <p key={i} className="username">{profile.username}</p>;
                })}
                </div>
          : null}
          <button key={9} className="button" onClick={() => goToRoom(room._id)}>
          Join Room
        </button>
    </div>
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
      <p className="title">{room.title}</p>
      <p className="subject">{`${room.subject} > ${room.subSubject}`}</p>
      <p className="description">{room.description}</p>
      <p className="limit">{ room.participants.length}/{room.limit}</p>
      <p className="isLocked">{room.isLocked ? "Locked" : "opened"}</p>
      

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
