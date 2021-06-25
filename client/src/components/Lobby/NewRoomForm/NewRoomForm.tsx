import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { roomsActionCreator, State, wsActionCreator } from '../../../state';
import Network from '../../../utils/network';
import { Iroom } from '../interfaces';

function NewRoomForm() {
    const { serverSocket, user } = useSelector((state: State) => state.ws)
    
    //  creates all refs for the form's inputs
    const subjectRef = useRef<HTMLSelectElement | null>(null);
    const subSubjectRef = useRef<HTMLInputElement | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLInputElement | null>(null);
    const participantsRef = useRef<HTMLInputElement | null>(null);
    const limitRef = useRef<HTMLInputElement | null>(null);
    const isLockedRef = useRef<HTMLInputElement | null>(null);

    return (
        <form className="new-room-form" >
            <select ref={subjectRef} required>
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
    // cleanup
    function cleanup(): void {
        console.log("VLLRASAISDFGNJAFSDGBKAJSDFGAKLDGSNKJSADF");
        console.log(subjectRef
            ,subSubjectRef
            ,titleRef
            ,descriptionRef
            ,participantsRef
            ,limitRef
            ,isLockedRef);
        
        if (!(subjectRef?.current &&
            subSubjectRef?.current &&
            titleRef?.current &&
            descriptionRef?.current &&
            participantsRef?.current &&
            limitRef?.current &&
            isLockedRef?.current)) return;
        subjectRef.current.value = "Math"
        subSubjectRef.current.value = ""
        titleRef.current.value = ""
        descriptionRef.current.value = ""
        participantsRef.current.value = "";  // should not be sent here!!!
        limitRef.current.value = "";
        isLockedRef.current.checked = false;
    }


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
            const host: any = JSON.stringify({userId: user._id, userSocket: user.mySocket })
        const newRoom: Iroom = { subject, subSubject, title, description, participants, limit, isLocked, host }//host participents
            console.log(subject);
        
            cleanup();
            
            // creates new room in db
            Network('POST', 'http://localhost:4000/room/new', newRoom)
                .then((response) => {
                    const newRoom: Iroom = response.newRoom;
            serverSocket.send(JSON.stringify({ type: "creating new room", message: newRoom }));
        })
        .catch(console.log);
        cleanup();
    }
}

export default NewRoomForm
