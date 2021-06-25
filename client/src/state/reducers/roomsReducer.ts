import { Iroom } from "../../components/Lobby/interfaces"

const roomReducer = (state: Array<Iroom | null> = [], action: any) => {
    
    switch(action.type){
        case "setRooms":
            state = action.payload;
            break;
        case "addRoom":
            state.push(action.payload)
            break;
        case "removeRoom":
            const roomIndex = state.findIndex(room => action.payload);
            state[roomIndex] = null;
            break;
        default:
        return state;  
    }
    return [...state]
}

export default roomReducer