//imports
/*-------------------------------------------------------------------------------------*/
import "./VideoRoom.css";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Peer from "peerjs";
import Network from "../../utils/network";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { State, wsActionCreator } from "../../state";
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
  const [videoImages, setVideoImages] = useState<any>([]);
  const [myStream, setMyStream] = useState<any>();
  const [myVideoIsOn, setMyVideoIsOn] = useState<any>(true);
  const roomId = location.search.slice(8);
  
  //hapens on 2 cases:
  //on componnent did mount:  get the room details and creat the peer js connection
  // on roomstate change: update  the room details from db
  /*-------------------------------------------------------------------------------------*/
  useEffect(() => {
    Network("GET", `http://localhost:4000/room/${roomId}`)
      .then((roomFromDb) => {
        if (!room) createConnection(roomFromDb);
        setRoom(roomFromDb);
        const relevnatStream = roomFromDb.participants.map((user:any)=>user.streamId);
        console.log("stream id in videos", relevnatStream)
        setVideos(videos.filter((video: any) => {
          return relevnatStream.includes(video.stream.id);
        }));
        // setVideoImages(getAllRemoteProfileImages())
      })
      .catch((e) => {
        console.log("could not get room in VideoRoom Component", e);
      });
      
  }, [rooms]);

  //component renders:
  /*-------------------------------------------------------------------------------------*/

  return (
    videos && room ?
    <div className="video-room">
        {videos?.map((video: any, i: number) => {
        // console.log(peerState);
        
          return <UserVideo key={i} muted={false} stream={video.stream} username="video.username" userImage={getUserByStreamId(video.call._remoteStream.id)} isVideoOn={video.isVideoOn} />;
      })}

      {myStream && <UserVideo muted={true} stream={myStream} userImage={user.profile.imageBlob} username="peerState"  isVideoOn={myVideoIsOn}  />}
      <button  className="leave-button" onClick={leaveRoom}>Leave</button>
      <button  className="self-mute-button" onClick={selfMuteToggle}>Mute</button>
      <button  className="stop-self-video-button" onClick={selfVideoToggle}>Stop Video</button>
<button  className="share-screen-button" onClick={shareScreen}>Share Screen</button>
      </div>
      :
      null
  );

  //functions:
  /*-------------------------------------------------------------------------------------*/
  
  
  
  function getUserByStreamId(streamId: any) {
  if (!room) {
    console.log("was no room");
    return
  }
  const user = room.participants.find((u: any) => {
    // console.log("user", u);
    // console.log("streamId argument", streamId);
    // console.log("users streamId", u.streamId);
    
    return u.streamId === streamId
  });
    if (!user) return;
  return user.user.profile.imageBlob
}

  async function shareScreen  (){
    
    //@ts-ignore
    const screenMedia = await navigator.mediaDevices.getDisplayMedia({cursor:true});
    const screenTrack = screenMedia.getTracks()[0];
    videos.forEach((video:any) => {
     let videoSender = video.call.peerConnection.getSenders().find((sender: any)=>{
       return sender.track.kind === "video"
     });
     videoSender.replaceTrack(screenTrack);
    });
    screenTrack.onended= function(){
      videos.forEach((video:any) => {
        let videoSender = video.call.peerConnection.getSenders().find((sender: any)=>{
          return sender.track.kind === "video"
        });
        videoSender.replaceTrack(myStream.getVideoTracks()[0]);
       });
    }
  

  }
  
  
  
  function selfMuteToggle() {
    if (!myStream.getTracks()[0]) return;
    myStream.getTracks()[0].enabled = !myStream.getTracks()[0].enabled;
  }
  
  function selfVideoToggle() {
    if (!myStream.getVideoTracks()[0]) return;
    // if (myStream.getVideoTracks()[0].enabled) {
    // }

    const newState = !myStream.getVideoTracks()[0].enabled;
    console.log(myStream.getVideoTracks()[0]);
    myStream.getVideoTracks()[0].enabled = newState;
    // console.log(myStream.getVideoTracks()[0]);
    const videoState = myStream.getVideoTracks()[0].enabled
    setMyVideoIsOn(videoState);
  }


  function getCleanedUser(user: any) {
    return {
      username: user.username,
      profile: user.profile,
      firstname: user.firstName,
      lastname: user.lastName,
      age: 22,
      // age: user.birthDate
      //   ? new Date().getFullYear() - user.birthDate.getFullYear()
      //   : 22,
    };
  };
  
  async function createConnection(room: any) {
    console.log("inside create connection");

    //get user media

    // const myMedia: MediaStream = await getUserMedia();
    let myMedia: MediaStream = new MediaStream();
    myMedia.onaddtrack = (e) => {
      console.log('track added');
    }
    
    
    myMedia = await getUserMedia();
    myMedia.getVideoTracks()[0].addEventListener('muted' , () => {
      console.log("muted");
    
  });
    myMedia.getVideoTracks()[0].addEventListener('unmuted', () => {
      console.log("unmuted");
    });
    
    myMedia.addEventListener("addtrack", () => {
      console.log("event listener add track");
    });
      setMyStream(myMedia);
    

    //creating new peer
    const mypeer = new Peer();
    
    //getting peer id;
    mypeer.on("open", async (id) => {
      user.peer= mypeer;
      user.peerId = id;
      setUser({ ...user });
      const peerId = id;
      setPeerId(peerId);
      console.log("user", getCleanedUser(user));
      
      //tell the server to update room participant in db and at other clients
      serverSocket.send(
        JSON.stringify({
          type: "join room",
          message: {
            participant: {
              peerId: peerId,
              streamId: myMedia.id,
              user: getCleanedUser(user),
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
        //
        //recieving new participant stream
        call.on("stream", (remoteStream: any) => {
          console.log("in the stream");
          console.log("remoteStream", remoteStream, "call", call, "tracks", remoteStream.getVideoTracks()[0]?.enabled || remoteStream.getTracks()[0]?.enabled || null );
          
          
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
          ) {
            
            videos.push({ stream: remoteStream, call: call, isVideoOn: remoteStream.getVideoTracks()[0]?.enabled });
              setVideos([...videos]);
          }
        });
        //sending my stream to new participant
        
        console.log("myMedia", myMedia);
        call.answer(myMedia);
          // console.log("iam answering yor call" , call);
      });

      //calling others
      if (!room.participants) return;

      room.participants?.forEach((participant: any) => {
        //console.log("for each participants");
        
        if (participant.peerId === peerId) return;
        // console.log("1");
        const call: any = mypeer.call(participant.peerId, myMedia);
        // console.log("call", call);
          
          
          //unable to call
          if (!call) {
            console.log(
              "no call created, participant:",
              participant.peerId,
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
          console.log("stream of creating call");
          console.log("remoteStream", remoteStream, "call", call, "tracks", remoteStream.getVideoTracks()[0]?.enabled || remoteStream.getTracks()[0]?.enabled || null );
          
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
          ) {
            
              videos.push({ stream: remoteStream, call: call, isVideoOn: remoteStream.getVideoTracks()[0]?.enabled});
              setVideos([...videos]);
          }
        });
      });
    });

    //  DataConnection:
// ===============

  //create peer hendlers
//   mypeer.on("connection", (conn) => {
//     conn.on("data", function (data) {
//         console.log("received message from peer connection:", data);
//     });
// });

// // //calling all parrticipents
// room.participants?.forEach((roomMate: any) => {
//     console.log(roomMate);
//     const connection = mypeer.connect(roomMate.peerId);
//     connection.on("open", () => {
//         console.log("connecting to", roomMate.peerId);
//         connection.send("Hey, we've just connected");
//     });
//   roomMate.dataConnection = connection;
// });
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
        console.log("media", media);
        
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
