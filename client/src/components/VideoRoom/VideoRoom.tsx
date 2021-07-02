//imports
/*-------------------------------------------------------------------------------------*/
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Peer from "peerjs";
import Network from "../../utils/network";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { State, wsActionCreator } from "../../state";
import { useRef } from "react";
import { Iroom } from "../Lobby/interfaces";
import UserVideo from "./UserVideo/UserVideo";

//conponnent
/*-------------------------------------------------------------------------------------*/

//redux states
/*-------------------------------------------------------------------------------------*/
function VideoRoom() {
  const { serverSocket, user } = useSelector((state: State) => state.ws);
  const { rooms } = useSelector((state: State) => state);
  const dispatch = useDispatch();
  const { setUser } = bindActionCreators({ ...wsActionCreator }, dispatch);

  //declerations-states and more
  /*-------------------------------------------------------------------------------------*/
  const history = useHistory();
  const location = useLocation();
  const [peerState, setPeerState] = useState<Peer>();
  const [room, setRoom] = useState<any>();
  const [peerId, setPeerId] = useState<any>();
  const [videos, setVideos] = useState<any>([]);
  const [myStream, setMyStream] = useState<any>();
  const [calls, setCalls] = useState<any>([]);
  const roomId = location.search.slice(8);

  //hapens on 2 cases:
  //on componnent did mount:  get the room details and creat the peer js connection
  // on roomstate change: update  the room details from db
  /*-------------------------------------------------------------------------------------*/
  useEffect(() => {
    Network("GET", `http://192.168.1.111:4000/room/${roomId}`)
      .then((roomFromDb) => {
        if (!room) createConnection(roomFromDb);
        setRoom(roomFromDb);
        const relevnatStream = roomFromDb.participants.map((user:any)=>user.streamId);
        setVideos(videos.filter((video:any)=>{
          return relevnatStream.includes(video.stream.id);
        }) )
      })
      .catch((e) => {
        console.log("could not get room in VideoRoom Component", e);
      });
      
  }, [rooms]);
  
  //component renders:
  /*-------------------------------------------------------------------------------------*/

  return (
    <div>
      <h1>{room?.title}</h1>

      {videos?.map((video: any, i: number) => {
        return <UserVideo key={i} muted={false} stream={video.stream} />;
      })}

      {myStream && <UserVideo muted={true} stream={myStream} />}
      <button onClick={leaveRoom}>Leave</button>
    </div>
  );

  //functions:
  /*-------------------------------------------------------------------------------------*/
  async function createConnection(room: any) {
    console.log("inside create connection");

    //get user media
    
    const myMedia: MediaStream = await getUserMedia();
      setMyStream(myMedia);
    

    //creating new peer
    const mypeer = new Peer();
    
    //getting peer id
    mypeer.on("open", async (id) => {
      user.peer= mypeer;
      user.peerId = id;
      setUser({ ...user });
      const peerId = id;
      setPeerId(peerId);
      
      //tell the server to update room participant in db and at other clients
      serverSocket.send(
        JSON.stringify({
          type: "join room",
          message: {
            participant: {
              peerId: peerId,
              streamId: myMedia.id,
              username: user.username,
            }, // username will be changed to profile.
            roomId: room._id,
            username: user.username,
          },
        })
      );

      ///peer handler for receiving calls
      mypeer.on("call", (call: any) => {
        // console.log("got a call")

        //hanle err
        call.on("error", (err: any) => {
          console.log("error in the call", err);
        });

        //remove participant`s stream how left the room
        call.on("close", () => {
        });
        
        //recieving new participent stream
        call.on("stream", (remoteStream: any) => {
          // console.log("in the stream");
          // console.log(remoteStream);
          
          
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
            ) {
              videos.push({ stream: remoteStream, call: call });
              setVideos([...videos]);
          }
        });
        //sending my stream to new participant
        
          // console.log("iam answering yor call" , call);
        call.answer(myMedia);
      });

      //calling others
      if (!room.participants) return;

      room.participants?.forEach((participent: any) => {
        //console.log("for each participants");
        
        if (participent.peerId === peerId) return;
        // console.log("1");
        const call: any = mypeer.call(participent.peerId, myMedia);
        // console.log("call", call);
          
          
          //unable to call
          if (!call) {
            console.log(
              "no call created, participant:",
              participent.peerId,
              "myMedia:",
              myMedia
              );
              return;
            }
            //handle err
            call.on("error", (err: any) => {
          console.log("error in the call", err);
        });

        //remove participant`s stream how left the room
        call.on("close", () => {
          console.log("removing participant video");
          setVideos(
            videos.filter((video: any) => {
              return video.call.connectionId !== call.connectionId;
            })
          );
        });
        //recieving new participant stream
        call.on("stream", (remoteStream: any) => {
          
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
            ) {
              videos.push({ stream: remoteStream, call: call });
              setVideos([...videos]);
          }
        });
      });
    });
    setPeerState(mypeer);
  }

  /*-----------------------------------------------------------------------------------*/
  async function getUserMedia(): Promise<MediaStream> {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      return media;
    } catch (e) {
     
      try {
          const media = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          return media;
        }
        catch (e) {
          // console.log("in the catch of the catch of usermedia", e.message);
         
            console.log("return nothing!!");
            
            return new MediaStream();
          }
        }
  }
  /*-----------------------------------------------------------------------------------------*/
  async function leaveRoom() {
    console.log(roomId, peerId, user.peerId, "check");
    serverSocket.send(
      JSON.stringify({
        type: "leave room",
        message: {
          participant: { roomId, peerId: user.peerId },
          participants: room.participants,
        },
      })
    );
    videos.forEach((video: any) => {
      console.log("closing the video");
      
      video.call.close();
    });
    user.peer.destroy()
    myStream?.getTracks().forEach((track: any)=>{
      track.stop()
    })

    history.push("/loby");
  }
}
export default VideoRoom;
