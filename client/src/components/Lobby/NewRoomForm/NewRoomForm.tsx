import { useRef } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../state";
import Network from "../../../utils/network";
import { Iroom } from "../interfaces";

// import css
import './NewRoomForm.css';

function NewRoomForm() {
    const { serverSocket, user } = useSelector((state: State) => state.ws)
    //  creates all refs for the form's inputs
    const subjectRef = useRef<HTMLSelectElement | null>(null);
    const subSubjectRef = useRef<HTMLInputElement | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const limitRef = useRef<HTMLInputElement | null>(null);
    const isLockedRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className='form-container'>
      <form className="new-room-form" >
        <h3>Create New Room</h3>
        <div className='form-content'>
          <input className='new-room-form-title-input' ref={titleRef} placeholder="title" required />
          <div>
            <select ref={subjectRef} required>
              <option value="Math">Math</option>
              <option value="Programming">Programming</option>
            </select>
            <input ref={subSubjectRef} placeholder="subSubject" required />
          </div>
          <textarea className='new-room-form-description' ref={descriptionRef} placeholder="description" required />
          <div>
            <input className='limit-input' type="number" ref={limitRef} placeholder="limit" min="2" max="4" defaultValue="4" required />
            <label>Private</label>
            <input type="checkbox" ref={isLockedRef} placeholder="isLocked" defaultValue="0" required />
          </div>

        </div>
        <button className='button' onClick={createNewRoom}>Create Room</button>
      </form>
    </div>);

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
      isLockedRef?.current
    )    
)
      return;
    subjectRef.current.value = "Math";
    subSubjectRef.current.value = "";
    titleRef.current.value = "";
    descriptionRef.current.value = "";
    limitRef.current.value = "";
    isLockedRef.current.checked = false;
  }

  //  creates a new room.
  function createNewRoom(e: any) {
    e.preventDefault();

    if (
      !subjectRef?.current &&
      !subSubjectRef?.current &&
      !titleRef?.current &&
      !descriptionRef?.current &&
      !limitRef?.current &&
      !isLockedRef?.current
    )
      return;

    const subject: string = subjectRef.current?.value!;
    const subSubject: string = subSubjectRef.current?.value!;
    const title: string = titleRef.current?.value!;
    const description: string = descriptionRef.current?.value!;
    const limit: number = Number(limitRef.current?.value)!;
    const isLocked: boolean = isLockedRef.current?.checked!;
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
      host,
    }; //host participents

    //  inputs cleanup
    cleanup();

    // creates new room in db
    Network("POST", "http://localhost:4000/room/new", newRoom)
      .then((response) => {
        const newRoom: Iroom = response.newRoom;

        //  sends a WebSocket message to pass the new room to all connected sockets.
        serverSocket.send(
          JSON.stringify({ type: "creating new room", message: newRoom })
        );
      })
      .catch(console.log);
  }
}

export default NewRoomForm;
