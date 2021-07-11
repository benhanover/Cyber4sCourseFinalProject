import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../state";
import Network from "../../../utils/network";
import { Iroom } from "../interfaces";
import { useHistory } from "react-router-dom";
import LockIcon from '@material-ui/icons/Lock';
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';

// import enums
import { enums } from "../../../utils/enums";

// import css
import "./NewRoomForm.css";
import { Category, PeopleAlt } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";

function NewRoomForm() {
  //redux states
  const { serverSocket, user } = useSelector((state: State) => state.ws);

  //  creates all refs for the form's inputs
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const subSubjectRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const limitRef = useRef<HTMLInputElement | null>(null);
  const [isLocked, setIsLocked] = useState<any>(false);
  const roomPasswordRef = useRef<HTMLInputElement | null>(null);
  const [errorDiv, setErrorDiv] = useState<any>(false);
  return (

    <div className="form-container">
      <form className="new-room-form">
        <h3>Create New Room</h3>
        <div className="form-content">
          <input
            className="new-room-form-title-input"
            ref={titleRef}
            placeholder="Title"
            required
            onFocus={() => setErrorDiv(false)}
            />
            <Tooltip title="Room Subject" placement="top">
          <div className="subjects-container">
            <Category className="category-icon icon" />
              <div className="subjects">
            <input className="subject" ref={subjectRef}  placeholder="Subject" required />
            <input ref={subSubjectRef} placeholder="SubSubject" required />
                </div>
          </div>
          </Tooltip>
          <textarea
            className="new-room-form-description"
            ref={descriptionRef}
            placeholder="Description"
            required
            />

          <div className="room-details">
          <Tooltip title={"Participants Limit"} placement="top">
            <div className="limit">

          <PeopleAlt className="people-icon icon" />
            <input
              className="limit-input"
              type="number"
              ref={limitRef}
              placeholder="Limit"
              min="2"
              max="4"
              defaultValue="4"
              onFocus={() => setErrorDiv(false)}
              required
              />
              </div>
            </Tooltip>
              <Tooltip title={isLocked?"Click To Remove Password": "Click To Add Password"} placement="top">
            <div className="lock-room">
              {isLocked
                ?
                <>
              <NoEncryptionIcon className="lock-icon icon" onClick={() => setIsLocked(!isLocked)} /> <input placeholder="Room Password" ref={roomPasswordRef} onFocus={() => setErrorDiv(false)}
                  />
                  </>: <LockIcon className="lock-icon icon" onClick={() => setIsLocked(!isLocked)
              } />}
              </div>
              </Tooltip>
          </div>
        </div>
        <button className="button" onClick={createNewRoom}>
          Create Room
        </button>
        {errorDiv && (
          <div>
            <p>{errorDiv}</p>
          </div>
        )}
      </form>
    </div>
  );

  //      Functions
  /*------------------------------------------------------------------------------------------------------*/
  // cleanup
  function cleanup(): void {
    if (
      !(
        subjectRef?.current &&
        subSubjectRef?.current &&
        titleRef?.current &&
        descriptionRef?.current &&
        limitRef?.current &&
        roomPasswordRef?.current
      )
    )
      return;
    subjectRef.current.value = "Math";
    subSubjectRef.current.value = "";
    titleRef.current.value = "";
    descriptionRef.current.value = "";
    limitRef.current.value = "2";
    roomPasswordRef.current.value = "";
  }

  //  creates a new room.
  function createNewRoom(e: any) {
    e.preventDefault();

    if (
      !subjectRef?.current &&
      !subSubjectRef?.current &&
      !titleRef?.current &&
      !descriptionRef?.current &&
      !limitRef?.current
    )
      return;

    if (isLocked) {
      if (roomPasswordRef.current && !roomPasswordRef.current.value) {
        setErrorDiv("Cant Lock Room Without A Password");
        return;
      }
    }
    if (limitRef.current) {
      if (
        limitRef.current.value !== "2" &&
        limitRef.current.value !== "3" &&
        limitRef.current.value !== "4"
      ) {
        setErrorDiv("Cannot Only Create Room For 2, 3, 4 People.");
        return;
      }
    }

    const subject: string = subjectRef.current?.value!;
    const subSubject: string = subSubjectRef.current?.value!;
    const title: string = titleRef.current?.value!;
    const description: string = descriptionRef.current?.value!;
    const limit: number = Number(limitRef.current?.value)!;
    // const isLocked: boolean = isLockedRef.current?.checked!;
    const roomPassword: string = roomPasswordRef.current?.value!;
    const host: any = {
      userId: user._id,
      userSocket: user.mySocket,
    };
    const newRoom: Iroom = {
      subject,
      subSubject,
      title,
      description,
      limit,
      isLocked,
      roomPassword,
      host,
    }; //host participents
    // console.log(newRoom);

    //  inputs cleanup
    cleanup();

    // creates new room in db
    Network("POST", `${enums.baseUrl}/room/new`, newRoom)
      .then(async (response) => {
        if (response === "Room Title Is Taken") {
          setErrorDiv(response);
          return;
        }
        const newRoom: Iroom = response.newRoom;

        //  sends a WebSocket message to pass the new room to all connected sockets.

        await serverSocket.send(
          JSON.stringify({ type: "creating new room", message: newRoom })
        );
        // console.log(newRoom);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

export default NewRoomForm;
