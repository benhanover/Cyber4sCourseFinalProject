import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { wsActionCreator, State, roomsActionCreator } from "../../../state";
import { IroomProps } from "./interfaces";
import { useHistory } from "react-router-dom";
import "./Room.css";
import { setRooms } from "../../../state/action-creators/roomsActionCreator";
import Network from '../../../utils/network';

// import components
import ProfileTicket from './ProfileTicket/ProfileTicket';
import { convertCompilerOptionsFromJson } from "typescript";

// import enums
import { enums } from '../../../utils/enums';

const Room: FC<IroomProps> = ({ room, chosen }) => {
  const dispatch = useDispatch();
  const { chosenRoom } = useSelector((state: State) => state.ws);
  const [errorDiv, setErrorDiv] = useState<any>(false);
  const rooms = useSelector((state: State) => state.rooms);
  const { setChosenRoom } = bindActionCreators(
    { ...wsActionCreator },
    dispatch
  );
  const roomPasswordRef = useRef<HTMLInputElement | null >(null);
  const history = useHistory();
  useEffect(() => {
    return () => {
      setChosenRoom(null);
    };
  }, []);

  //  keeps chosenRoom updated.
  useEffect(() => {
  if (!chosenRoom || chosenRoom._id !== room?._id) return;
    setChosenRoom({ ...room })
}, [rooms])

  if (chosen) {
    return (
      <div className="chosen-background" onClick={(e)=> setChosenRoom(null)}>
        <div key={42} className="chosen room" onClick={(e) => e.stopPropagation()}>
          <span key={1} className="close-chosen-button" onClick={() => setChosenRoom(null)}>X</span>
          <p key={2} className="title">{chosenRoom.title}</p>
          <p key={3} className="subject">{`${chosenRoom.subject} > ${chosenRoom.subSubject}`}</p>
          <p key={5} className="description">{chosenRoom.description}</p>
          <p key={7} className="isLocked">{chosenRoom.isLocked ? "Locked" : "opened"}</p>
          <ProfileTicket participants={chosenRoom.participants}/>
          {chosenRoom.participants.length > 0
            ?
            <div className="room-participants">
              <p key={6} className="limit">{ chosenRoom.participants.length}/{chosenRoom.limit}</p>
              {chosenRoom.participants.map((profile: any, i: number) => <p key={i} className="username">{profile.username}</p>)}
            </div>
            : null
          }
          {room.isLocked && 
            <input placeholder='Room Password' ref={roomPasswordRef}/>

          }
          <button key={9} className="button" onClick={() => {
            if (!roomPasswordRef.current) {
              goToRoom(room._id);
            } else {
              goToRoom(room._id, roomPasswordRef.current.value)
            }
            }}>Join Room</button>
            {
              errorDiv &&
              <div>
                <p>{errorDiv}</p>
              </div>
            }
        </div>
      </div>
    );
  }
  return (
    <div className="room" onClick={() => chosenRoom !== room ? setChosenRoom(room) : setChosenRoom(null)}>
      <p className="title">{room.title}</p>
      <p className="subject">{`${room.subject} > ${room.subSubject}`}</p>
      <p className="description">{room.description}</p>
      <p className="limit">{ room.participants.length}/{room.limit}</p>
      <p className="isLocked">{room.isLocked ? "Locked" : "opened"}</p>
    </div>
  );
  async function goToRoom(roomId: string | undefined, password?: any) {
    if(room.participants.length >= room.limit) {
      setErrorDiv('Room Is Full');
      return;
    }
    if(room.isLocked) {
      const isPasswordValid = await Network("POST", `${enums.baseUrl}/room/valid-password`, {roomId, password})
      if(!isPasswordValid) {
        setErrorDiv('Password Is Inccorect');
        return
      }
    }
    if (!roomId) return;
    // console.log(roomId);
    history.push("/room?roomId=" + roomId);
  }
};

export default Room;
//
