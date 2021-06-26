import React, { useEffect, useState } from 'react'
import {useLocation} from "react-router-dom";
import Network from '../../utils/network';


export default function VideoRoom() {
   const location = useLocation();
   const [ room, setRoom] = useState()
    useEffect(() => {
       const roomId = location.search.slice(8);
        Network('GET', `http://localhost:4000/room/${roomId}`)
        .then((room)=>{
            setRoom(room);
            console.log(room);
             
       }).catch((e)=>{
           console.log("could not get room in VideoRoom Component", e) ///add reaction 
       })
       
   }, [])
   
    return (
        <div>
            
        </div>
    )
}
