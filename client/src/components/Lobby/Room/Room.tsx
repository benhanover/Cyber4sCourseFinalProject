import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { wsActionCreator, State, roomsActionCreator } from "../../../state";
import { IroomProps } from "./interfaces";
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { useHistory } from "react-router-dom";
import "./Room.css";
import { setRooms } from "../../../state/action-creators/roomsActionCreator";
import Network from '../../../utils/network';

// import components
import ProfileTicket from './ProfileTicket/ProfileTicket';
import { convertCompilerOptionsFromJson } from "typescript";

// import enums
import { enums } from '../../../utils/enums';
import { Tooltip } from "@material-ui/core";
import { Category } from "@material-ui/icons";

const Room: FC<IroomProps> = ({ room, chosen }) => {
  const dispatch = useDispatch();
  const { chosenRoom } = useSelector((state: State) => state.ws);
  const [errorDiv, setErrorDiv] = useState<any>(false);
  const [showParticipants, setShowParticipants] = useState<string>('');
  const rooms = useSelector((state: State) => state.rooms);
  const roomPasswordRef = useRef<HTMLInputElement | null>(null);
  const { setChosenRoom } = bindActionCreators({ ...wsActionCreator }, dispatch);
  
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
      <div className="chosen-background" onClick={(e) => setChosenRoom(null)}>

        <div key={42} className="chosen room" onClick={(e) => e.stopPropagation()}>
          <span key={1} className="close-chosen-button" onClick={() => setChosenRoom(null)}>X</span>
          <Tooltip title={"Room Subject"} placement="top-start">
            <p key={3} className="subject"><Category className="category-icon icon" />{`${chosenRoom.subject} > ${chosenRoom.subSubject}`}
            </p>
          </Tooltip>
          <p key={2} className="title">{chosenRoom.title}</p>
        <p key={5} className="description">{chosenRoom.description}<div className="under-div"></div></p>
        
        
          <div className="room-participants">
          <ProfileTicket participants={chosenRoom.participants}/>
          </div>
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
    <div className="room-details" >
      <Tooltip title={"Room Subject" } placement="top-start">
        <p className="subject"><Category className="category-icon icon" />{`${room.subject} > ${room.subSubject}`}</p>
        </Tooltip>
      <p className="title">{room.title}</p>
      {/* <p className="description">{room.description}</p> */}
              
      <Tooltip title={room.participants.length+" users of "+room.limit + " are currently in this room" } placement="top">
      <p className="limit"><PeopleAltIcon className="people-icon icon" />{ room.participants.length}/{room.limit}</p>
          </Tooltip>
      </div>
        
        <div className={`small-participants-display-container ${showParticipants}`}>
        <div className="blur-div"></div>
        {room.participants.map((participant: any, i: number) => {
          return <div key={i} className="small-participant">
            <div className="profile-left">

            <img className="profile-image" src={participant.user.profile.imageBlob} alt="" />
            <p className="profile-username">{participant.user.username}</p>
            </div>
            <div className="profile-age-container"><p className="profile-age">{participant.user.age}</p> <p className="profile-years-old">years old</p></div>
          </div>
        })}
          </div>
      <div className="show-participants-button" onClick={(e) => {
        e.stopPropagation();
        setShowParticipants(showParticipants === '' ? 'active' : '');
      }}>Show Participants</div>
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
