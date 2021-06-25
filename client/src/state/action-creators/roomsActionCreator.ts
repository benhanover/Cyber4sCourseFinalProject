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

export const addRoom = (room: Iroom) => {
    return (dispatch: Dispatch<any>)=>{
        dispatch({
            type: "addRoom" , 
            payload:room
        })
    }
}