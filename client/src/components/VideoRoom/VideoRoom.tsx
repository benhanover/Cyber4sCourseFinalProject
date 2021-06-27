import React, { useEffect, useState } from 'react'
import {useLocation} from "react-router-dom";
import Peer from 'peerjs';
import Network from '../../utils/network';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { State, wsActionCreator } from '../../state';
import { useRef } from 'react';
import { Iroom } from '../Lobby/interfaces';


function VideoRoom() {
    const { serverSocket, user } = useSelector((state: State) => state.ws);
    const flagRef = useRef(false)
    const [peerState, setPeerState] = useState<Peer>()
    const dispatch = useDispatch();
    const { setUser } = bindActionCreators({ ...wsActionCreator }, dispatch)
   
   
   const location = useLocation();
    const [room, setRoom] = useState<Iroom | undefined>()
    useEffect(() => {
        const roomId = location.search.slice(8);
         Network('GET', `http://localhost:4000/room/${roomId}`)
         .then((room)=>{
             setRoom(room);
            
        }).catch((e)=>{
            console.log("could not get room in VideoRoom Component", e) ///add reaction 
        })
        const peer = new Peer();
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            user.peerId = id;
            setUser(user);        
        })
        setPeerState(peer);
   }, [])
 
    useEffect(() => {
        createConnection();
       
    }, [user])
    
    return (
        <div>
            
        </div>
    )

// Functions
// =========

//to pull the partcipents in the room, and call them
//add the user to the room participants on db
//
    function createConnection() {
        console.log("in createConnection");
        
        if (!room) return;
        console.log("there is a room");
        
        serverSocket
            .send(JSON.stringify({
                type: 'join-room', message: { peerId: user.peerId, roomId: room._id, username: user.username }
            }));
        if (!peerState) return;
        peerState.on('connection', (conn) => {
            conn.on('data', function(data){
                console.log(data);})
                
    
        });
        room.participants?.forEach(roomMate => {
            const connection = peerState?.connect(roomMate)
            console.log("connecting to", roomMate);
            connection.send("Hey, we've just connected")
            
            
        })
        //     if (!peerState) return;
        // peerState.on('open', (id) => {
        //     console.log('My peer ID is: ' + id);
        //     console.log("1");
        //     console.log(serverSocket);
              
            
        //     console.log("2");
        //     serverSocket.send(JSON.stringify({type: 'join-room', message:{peerId: id, roomId: room._id, username: user.username}}))
        //     console.log("3");
            
            // navigator.getUserMedia({ video: true, audio: true },
            //     (media) => {
            //         console.log("succceessss!")
            //         peer.on('call', (call) => {
            //             console.log("in the call!!! yeeaaa!!!");
            //             // console.log("stream", stream);
            //             call.answer(media);
            //             call.on("stream", (stream) => {
            //                 const newVideo = document.createElement('video', { autoplay: true })
            //                 newVideo.srcObject = stream;
            //                 newVideo.autoplay = true;
            //                 newVideo.muted = true;
            //                 document.body.appendChild(newVideo);
        
            //                 // Avideo.srcObject = stream;
            //                 // Avideo.muted = true;
            //             })
            //             call.on('error', e => console.log("B error!" + e));
            //         })
            //     },
            //     (e) => { console.log("errrorr!" + e) });
        //});
        
        
        // peerState.on('connection', (conn) => {

        //     conn.on("data", (msg) => {
        //         console.log("recieved from client A :", msg);
        //         conn.send("holas back to you")
        //     });
        
        // });
    }
}

export default VideoRoom;