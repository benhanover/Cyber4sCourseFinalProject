import { Iroom } from "../../components/Lobby/interfaces"

const roomReducer = (state: Iroom[] = [], action: any) => {
    
    switch(action.type){
        case "setRooms":
            console.log("newRooms in reducer", action.payload);
            state = action.payload;
            break;
        case "addRoom":
            console.log("newRooms in reducer", action.payload);
            state.push(action.payload)
            break;
        default:
        return state;  
    }
    return [...state]
}

export default roomReducer