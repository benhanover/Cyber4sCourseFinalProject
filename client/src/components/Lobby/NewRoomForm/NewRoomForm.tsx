import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../state";
import Network from "../../../utils/network";
import { Iroom } from "../interfaces";

// import enums
import { enums } from "../../../utils/enums"

// import css
import "./NewRoomForm.css";

function NewRoomForm() {
  //redux states
  const { serverSocket, user } = useSelector((state: State) => state.ws);
  //  creates all refs for the form's inputs
  const subjectRef = useRef<HTMLSelectElement | null>(null);
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
            placeholder="title"
            required
            onFocus={() => setErrorDiv(false)}
          />
          <div>
            <select ref={subjectRef} required>
              <option value="Math">Math</option>
              <option value="Programming">Programming</option>
            </select>
            <input ref={subSubjectRef} placeholder="subSubject" required />
          </div>
          <textarea
            className="new-room-form-description"
            ref={descriptionRef}
            placeholder="description"
            required
          />
          <div>
            <input
              className="limit-input"
              type="number"
              ref={limitRef}
              placeholder="limit"
              min="2"
              max="4"
              defaultValue="4"
              onFocus={() => setErrorDiv(false)}
              required
            />
            <label onClick={() => !isLocked ? setIsLocked(true) : setIsLocked(false)}>Private</label>
            {isLocked &&
            <input placeholder='Room Password' ref={roomPasswordRef} onFocus={() => setErrorDiv(false)} />
            }
          </div>
        </div>
        <button className="button" onClick={createNewRoom}>
          Create Room
        </button>
        {
          errorDiv &&
          <div>
            <p>{errorDiv}</p>
          </div>
        }
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

    if(isLocked) {
      if(roomPasswordRef.current && !roomPasswordRef.current.value) {
        setErrorDiv('Cant Lock Room Without A Password')
        return
      }
    }
    if(limitRef.current) {
      if(limitRef.current.value !== '2' &&  limitRef.current.value !== '3' && limitRef.current.value !== '4') {
        setErrorDiv('Cannot Only Create Room For 2, 3, 4 People.');
        return
    }
    }

      
    const subject: string = subjectRef.current?.value!;
    const subSubject: string = subSubjectRef.current?.value!;
    const title: string = titleRef.current?.value!;
    const description: string = descriptionRef.current?.value!;
    const limit: number = Number(limitRef.current?.value)!;
    // const isLocked: boolean = isLockedRef.current?.checked!;
    const roomPassword: string = roomPasswordRef.current?.value!;
    const host: any = JSON.stringify({
      userId: user._id,
      userSocket: user.mySocket,
    });
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

    //  inputs cleanup
    cleanup();

    // creates new room in db
    Network("POST", `${enums.baseUrl}/room/new`, newRoom)
      .then((response) => {
        if(response === 'Room Title Is Taken') {
          setErrorDiv(response);
        }
        const newRoom: Iroom = response.newRoom;
        serverSocket.send(
          JSON.stringify({ type: "creating new room", message: newRoom })
        );
      })
      .catch ((e) => {
        console.log(e);
      })
  }
}

export default NewRoomForm;
