import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Peer from "peerjs";
import Network from "../../utils/network";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { State, wsActionCreator } from "../../state";
import { useRef } from "react";
import { Iroom } from "../Lobby/interfaces";
import UserVideo from "./UserVideo/UserVideo";

function VideoRoom() {
  const { serverSocket, user } = useSelector((state: State) => state.ws);
  const { rooms } = useSelector((state: State) => state);
  const [peerState, setPeerState] = useState<Peer>();
  const dispatch = useDispatch();
  const { setUser } = bindActionCreators({ ...wsActionCreator }, dispatch);
  const location = useLocation();
  const [room, setRoom] = useState<any>()
  const [peerId, setPeerId] = useState<any>()
  const [videos, setVideos] = useState<any>([]);
  const [myStream , setMyStream] = useState<any>();
  const roomId = location.search.slice(8);
  
  useEffect(() => {
    Network("GET", `http://192.168.1.111:4000/room/${roomId}`)
      .then((roomFromDb) => {
        setRoom(roomFromDb);
        createConnection(roomFromDb);
      })
      .catch((e) => {
        console.log("could not get room in VideoRoom Component", e); ///add reaction
      });
  }, []);
 
    useEffect(() => {
      Network("GET", `http://192.168.1.111:4000/room/${roomId}`)
      .then((roomFromDb) => {
        setRoom(roomFromDb);
      })
      .catch((e) => {
        console.log("could not get room in VideoRoom Component", e); ///add reaction
      }); 

    }, [rooms])
    useEffect(()=>{
      console.log("room was updated" , room);
      
    }, [room])
    
  return (
    <div>
          <h1>videoRoom</h1>
          <button onClick={leaveRoom}>Leave</button>
          {videos?.map((videoStream: any, i: number) => {
              //   if(!myStream) return null;
              return <UserVideo key={i} muted={false} stream={videoStream} />
          })}
      
          {myStream &&
              <UserVideo  muted={true} stream={myStream} />}
    </div>
  );

    async function createConnection(room: any) {
        const myMedia = await getUserMedia()
        if (!myMedia) {
            console.log("No media... ")
        }
        setMyStream(myMedia)
        
        //creating new peer
        const mypeer = new Peer();

        //getting peer id
        let peerId: any;
        mypeer.on("open", async (id) => {
            user.peerId = id;
            peerId = id;
            setPeerId(peerId)
            setUser(user);

            serverSocket.send(
                JSON.stringify({
                    type: "join room",
                    message: {
                        participant: { peerId: peerId, streamId: myMedia.id, username: user.username},
                        roomId: room._id,
                        username: user.username,
                    },
                })
            );
           
           
           ///peer handler for receiving stream
            mypeer.on("call", (call) => {
                if (myMedia) {
                call.answer(myMedia);
                }
                call.on("stream", (remoteStream) => {
                    if (!videos.some((stream: any) => stream === remoteStream)) {
                        videos.push(remoteStream);
                        setVideos([...videos]);
                    }
                });
            });

        
            
            if(!room.participants)return
            //calling others
            // console.log(room.participants, "all participents");
            
            room.participants?.forEach((participent: any) => {
                // console.log("peerId", peerId);
                
                if (participent.peerId === peerId) return;
                const call = mypeer.call(participent.peerId, myMedia);
                if (!call) {
                     console.log("no call created, participant:", participent.peerId, "myMedia:", myMedia);
                    return;
                }
                call.on("error", (err) => {
                    console.log("error in the call", err);
                });
                call.on("stream", (remoteStream: any) => {
                    // console.log("setting on the video");
                    // const stream = new MediaStream();
                    // stream.addTrack(remoteStream);
                    //setVideos(true);
                    const isStreamExist = videos.some((stream: any) => stream === remoteStream);
                    console.log("isStreamExist", isStreamExist, "videos:", videos[0]);
                    
                    if (!isStreamExist) {
                        videos.push(remoteStream);
                        setVideos([...videos]);
                    }
                });
            });

        //  DataConnection
        // ===============

        //   //create peer hendlers
        //   mypeer.on("connection", (conn) => {
        //     conn.on("data", function (data) {
        //         console.log("received message from peer connection:", data);
        //     });
        // });

        // //calling all parrticipents
        // room.participants?.forEach((roomMate: any) => {
        //     console.log(roomMate);
        //     const connection = mypeer.connect(roomMate.peerId);
        //     connection.on("open", () => {
        //         console.log("connecting to", roomMate.peerId);
        //         connection.send("Hey, we've just connected");
        //     });
        // });
            
        });
        setPeerState(mypeer);
    };
    async function getUserMedia(){
        const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log(media);
        
        return media
        }
        async function leaveRoom (){
            console.log(roomId, peerId, user.peerId, "check")
            serverSocket.send(JSON.stringify({ type: "leave room", message: { participant: { roomId, peerId: user.peerId }, participants: room.participants} }));
            
        }
    }
        export default VideoRoom;

