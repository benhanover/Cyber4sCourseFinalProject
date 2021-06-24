import { Dispatch } from "react";
import { Iroom } from "../../components/Lobby/interfaces";

export const setRooms = (rooms: Iroom[])=>{
    return (dispatch: Dispatch<any>)=>{
        dispatch({
            type: "setRooms" , 
            payload:rooms
        })
    }
}