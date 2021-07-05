//imports
/*-------------------------------------------------------------------------------------*/
import "./VideoRoom.css";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Peer from "peerjs";

/*-------------------------------------------------------------------------------------*/
// import network
import Network from "../../utils/network";

/*-------------------------------------------------------------------------------------*/
//redux states
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { State, wsActionCreator } from "../../state";

/*-------------------------------------------------------------------------------------*/
// import enums
import { enums } from "../../utils/enums";

/*-------------------------------------------------------------------------------------*/
//components
import UserVideo from "./UserVideo/UserVideo";

/*-------------------------------------------------------------------------------------*/
// import functions
import { getUserByStreamId, shareScreen, selfMuteToggle, selfVideoToggle, getCleanedUser, getUserMedia, leaveRoom } from './functions';
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
  const [room, setRoom] = useState<any>();
  const [peerId, setPeerId] = useState<any>();
  const [videos, setVideos] = useState<any>([]);
  const [myStream, setMyStream] = useState<any>();
  const [myVideoIsOn, setMyVideoIsOn] = useState<any>(true);
  const roomId = location.search.slice(8);
  
  //hapens on 2 cases:
  //on componnent did mount:  get the room details and creat the peer js connection
  // on roomstate change: update  the room details from db
  /*-------------------------------------------------------------------------------------*/
  useEffect(() => {
    console.log('useEffect rooms:', videos)
    Network("GET", `${enums.baseUrl}/room/${roomId}`)
      .then((roomFromDb) => {
        if (!room) createConnection(roomFromDb);
        setRoom(roomFromDb);
        const participantsStreams = roomFromDb.participants.map((participant: any) => participant.streamId);
        console.log("stream id in videos", participantsStreams)

        // clear all leave participants. bad idea.
        setVideos(videos.filter((video: any) =>  participantsStreams.includes(video.stream.id)));
      })
      .catch((e) => {
        console.log("could not get room in VideoRoom Component", e);
      });
      
  }, [rooms]);
useEffect(() => {
 console.log("useEffect videos:", videos);
 
}, [videos])

  //component renders:
  /*-------------------------------------------------------------------------------------*/

  return (
    <>
    {
    videos && room &&
    <div className="video-room">
        {videos?.map((video: any, i: number) => {
        
          return <UserVideo key={i} muted={false} stream={video.stream} username="video.username" userImage={getUserByStreamId(room, video.call._remoteStream.id)} isVideoOn={video.isVideoOn} />;
      })}

      {myStream && <UserVideo muted={true} stream={myStream} userImage={user.profile.imageBlob} username="peerState"  isVideoOn={myVideoIsOn}  />}
      <button  className="leave-button" onClick={() => {
        leaveRoom(roomId, peerId, serverSocket, videos, user, myStream, room);
        history.push('/lobby');
      }}>Leave</button>
      <button  className="self-mute-button" onClick={() => selfMuteToggle(myStream)}>Mute</button>
      <button  className="stop-self-video-button" onClick={() => setMyVideoIsOn(selfVideoToggle(myStream))}>Stop Video</button>
      <button  className="share-screen-button" onClick={() => shareScreen(videos, myStream)}>Share Screen</button>
      </div>
    }
    </>
  );

  //functions:
  /*-------------------------------------------------------------------------------------*/
  
  async function createConnection(room: any) {
    let myMedia: MediaStream | undefined = await getUserMedia();
    if (!myMedia) {
      console.log("no myMedia", myMedia);
      return;
    }
    setMyStream(myMedia);
    
    //creating new peer
    const mypeer = new Peer();
    mypeer.on("open", async (id) => {
      if (!myMedia) {
        console.log("no myMedia", myMedia);
        return;
      }
      // if (!myMedia === false) {
      //   console.log("no myMedia", myMedia);
      //   return;
      // }
      user.peer= mypeer;
      user.peerId = id;
      setUser({ ...user });
      const peerId = id;
      setPeerId(peerId);
      console.log("user", getCleanedUser(user));
      console.log("myMedia", myMedia);
      let mediaStreamId = myMedia.id;
      if (mediaStreamId.match(/^{.+}$/)) {
        mediaStreamId = mediaStreamId.slice(1, -1);
      }
      //tell the server to update room participant in db and at other clients
      serverSocket.send(
        JSON.stringify({
          type: "join room",
          message: {
            participant: {
              peerId: peerId,
              streamId: mediaStreamId,
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
          // console.log("removing participant video");
          // setVideos(
          //   videos.filter((video: any) => {
          //     if (video.call.connectionId === call.connectionId) {
          //       console.log("removed this call with this connectionId:", call.connectionId);
                
          //     }
          //     return video.call.connectionId !== call.connectionId;
          //   })
          // );
        });
        //
        //recieving new participant stream
        call.on("stream", (remoteStream: any) => {
          // console.log("in the stream");
          // console.log("remoteStream", remoteStream, "call", call, "tracks", remoteStream.getVideoTracks()[0]?.enabled || remoteStream.getTracks()[0]?.enabled || null );
          
          
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
          ) {
            // participant create a call with this this one.
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
        if (!myMedia) {
          console.log("no myMedia", myMedia);
          return;
        }
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
          // console.log("removing participant video");
          // setVideos(
          //   videos.filter((video: any) => {
          //     if (video.call.connectionId === call.connectionId) {
          //       console.log("removed this call with this connectionId:", call.connectionId);
                
          //     }
          //     return video.call.connectionId !== call.connectionId;
          //   })
          // );
        });
        //recieving new participant stream
        call.on("stream", (remoteStream: any) => {
          // console.log("stream of creating call");
          // console.log("remoteStream", remoteStream, "call", call, "tracks", remoteStream.getVideoTracks()[0]?.enabled || remoteStream.getTracks()[0]?.enabled || null );
          
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
          ) {
            // participant answered this user's call with media.
              videos.push({ stream: remoteStream, call: call, isVideoOn: remoteStream.getVideoTracks()[0]?.enabled});
              setVideos([...videos]);
          }
        });
      });
    });
  }
}
export default VideoRoom;
