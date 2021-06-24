import { Iroom } from "../../components/Lobby/interfaces"

const roomReducer = (state:Iroom[] = [] , action:any )=>{
    switch(action.type){
        case "setRooms":
            return action.payload
        default:
        return    
    }
}

export default roomReducer