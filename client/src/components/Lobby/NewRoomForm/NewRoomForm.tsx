import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { roomsActionCreator, State, wsActionCreator } from '../../../state';
import Network from '../../../utils/network';
import { Iroom } from '../interfaces';

function NewRoomForm() {
    const dispatch = useDispatch();
    const { ws, rooms } = useSelector((state: State) => state)
    const { setWS, setRooms } = bindActionCreators({ ...wsActionCreator, ...roomsActionCreator }, dispatch)
    
    //  creates all refs for the form's inputs
    const subjectRef = useRef<HTMLInputElement | null>(null);
    const subSubjectRef = useRef<HTMLInputElement | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLInputElement | null>(null);
    const participantsRef = useRef<HTMLInputElement | null>(null);
    const limitRef = useRef<HTMLInputElement | null>(null);
    const isLockedRef = useRef<HTMLInputElement | null>(null);

    return (
        <form className="new-room-form" >
            <select required>
                <option value="Math">Math</option>
                <option value="Programming">Programming</option>
            </select>
            <input ref={subSubjectRef} placeholder="subSubject" required />
            <input ref={titleRef} placeholder="title" required />
            <input ref={descriptionRef} placeholder="description" required />
            <input ref={participantsRef} placeholder="participants" required />
            <input type="number" ref={limitRef} placeholder="limit" min="2" max="4" required />
            <label>Private</label>
            <input type="checkbox" ref={isLockedRef} placeholder="isLocked" defaultValue="0" required />
            <button onClick={createNewRoom}>Create Room</button>
        </form>
    )

//      Functions
/*------------------------------------------------------------------------------------------------------*/
    //  creates a new room.
    function createNewRoom(e: any) {
    e.preventDefault();
        if (!subjectRef?.current &&
            !subSubjectRef?.current &&
            !titleRef?.current &&
            !descriptionRef?.current &&
            !participantsRef?.current &&
            !limitRef?.current &&
            !isLockedRef?.current) return;
    
        const subject: string = subjectRef.current?.value!;
        const subSubject: string = subSubjectRef.current?.value!;
        const title: string = titleRef.current?.value!;
        const description: string = descriptionRef.current?.value!;
        const participants: string[] = [];  // should not be sent here!!!
        const limit: number = Number(limitRef.current?.value)!;
        const isLocked: boolean = isLockedRef.current?.checked!
        
        const newRoom: Iroom = { subject, subSubject, title, description, participants, limit, isLocked }//host participents
        
        // creates new room in db
        Network('POST', 'http://localhost:4000/room/new', newRoom)
    .then(({ data }) => {
        ws.serverSocket.send(JSON.stringify({ type: "creating new room", message: data.newRoom }));
    })
    .catch(console.log);
        
//   function createRoom(): void {
//   const mockRoom: Iroom = {
//     host: 'fjkednj-fafd56-324fsh-3asdsr3e',
//     subject: 'Mathmatics',
//     subSubject: 'Geometric',
//     title: 'Geomtric is so awsome!',
//     description: 'high school level geometric, doing some bagrut excercises',
//     participants: [
//       'sdffdh-hsasw-jsh63-sdfs-gfd',
//       'fdshj-s4e5t-neswdcvyj-63e',
//       'dfrdy6c-dsf2qch6-a24g-2sdg',
//     ],
//     limit: 3,
//     isLocked: true,
//   };
//   ws.send(JSON.stringify({type: "creating new room", message: mockRoom}))
//   Network('POST', 'http://localhost:4000/room/new', mockRoom)
//     .then(({ data }) => {
//       rooms?.push(data.newRoom);
//       setRooms(rooms?.slice());
//     })
//     .catch(console.log);
// };

}
}

export default NewRoomForm
