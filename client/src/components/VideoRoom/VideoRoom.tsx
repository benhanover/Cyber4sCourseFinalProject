//imports
/*-------------------------------------------------------------------------------------*/
import "./VideoRoom.css";
import { useEffect, useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Peer from "peerjs";

/*-------------------------------------------------------------------------------------*/
//redux states
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { State, wsActionCreator } from "../../state";

/*-------------------------------------------------------------------------------------*/
// import enums
import { enums } from "../../utils/enums";

/*-------------------------------------------------------------------------------------*/

import Network from "../../utils/network";

/*-------------------------------------------------------------------------------------*/
//components
import UserVideo from "./UserVideo/UserVideo";

/*-------------------------------------------------------------------------------------*/
// import functions
import {
  getUserByStreamId,
  shareScreen,
  selfMuteToggle,
  selfVideoToggle,
  getCleanedUser,
  getUserMedia,
  leaveRoom,
  getVideos,
  closeRoom,
  getStreamId,
} from "./functions";
/*-------------------------------------------------------------------------------------*/
// import peer functions
// import { getPeerId } from './peer'

function VideoRoom() {
  const { serverSocket, user , chosenRoom} = useSelector((state: State) => state.ws);
  const { rooms } = useSelector((state: State) => state);
  // console.log(chosenRoom, "choosen");
  
  const dispatch = useDispatch();
  const { setUser } = bindActionCreators({ ...wsActionCreator }, dispatch);

  //declerations-states and more
  /*-------------------------------------------------------------------------------------*/
  const history = useHistory();
  const location = useLocation();
  const [room, setRoom] = useState<any>();
  const [isClosedButtonName, setIsClosedButtonName] = useState<any>("");
  const [peerId, setPeerId] = useState<any>();
  const [videos, setVideos] = useState<any>([]);
  const [myStream, setMyStream] = useState<any>();
  const [myVideoIsOn, setMyVideoIsOn] = useState<any>(true);
  const [myAudioIsOn, setMyAudioIsOn] = useState<any>(true);
  const roomId = location.search.slice(8);
  const [noUserDevices, SetNoUserDevices] = useState<boolean>(false);
  const [chooseNewHost, SetchooseNewHost] = useState<any>(null);
  const [options, setOptions] = useState<boolean>(false);

  //hapens on 2 cases:
  //on componnent did mount:  get the room details and creat the peer js connection
  // on roomstate change: update  the room details from db
  /*-------------------------------------------------------------------------------------*/
  useEffect(() => {
    const runAsyncFunction = async () => {
      const currentRoom = rooms.find((room: any) => room?._id === roomId);
      currentRoom?.isClosed
        ? setIsClosedButtonName("Open Room")
        : setIsClosedButtonName("Close Room");
      if (!room) {
        createConnection(currentRoom);
      } else if (currentRoom?.participants.length - 1 < videos.length) {
        let testVideos = [...(await getVideos(videos, myStream, roomId))];
        setVideos(testVideos);
      }
      setRoom({ ...currentRoom });
    };

    runAsyncFunction();
  }, [rooms]);

  //component renders:
  /*-------------------------------------------------------------------------------------*/

  return (
    <>
      {videos && room && (
        
        <div className="video-room">
         <div className="room-state">
         {isClosedButtonName==="Open Room" ?
         <svg xmlns="http://www.w3.org/2000/svg" width="40" height="35" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
         <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
       </svg>
          :
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="35" fill="currentColor" className="bi bi-unlock" viewBox="0 0 16 16">
        <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"/>
      </svg>
        }
        </div>
          <button className="close-room-btn"
            onClick={() => closeRoom(serverSocket, roomId, room.isClosed)}>
             
          {[isClosedButtonName.split(" ")[0],<br></br>,isClosedButtonName.split(" ")[1]]}
          </button>
          <button className="leave-button" onClick={handleLeaveBuuton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-door-open" viewBox="0 0 16 16">
  <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
  <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z"/>
</svg>
            Leave
          </button>
          
          
          {noUserDevices && (
            <div className="media-premision-err-div">
              <h1 className="h1-permission" style={{ color: "white" }}>
               we need permissions to access your microphone  and camera 
              </h1>
              <button className="button"
                onClick={(e) => {
                  createConnection(room);
                }}
              >
                try again
              </button>
            </div>
          )}

          {videos?.map((video: any, i: number) => {
            console.log(getUserByStreamId(room, video.streamId));
            
            return (
              <div className="others-video">
              <UserVideo
                key={i}
                muted={false}
                stream={video.stream}
                username={getUserByStreamId(room, video.streamId)?.username}
                userImage={getUserByStreamId(room, video.streamId)?.userImg}
                isVideoOn={video.isVideoOn}
              />
              </div>
            );
          })}
          {myStream && (
            <div className="self-video-box">
            <UserVideo
              muted={true}
              stream={myStream}
              userImage={user.profile.img}
              username={user.username}
              isVideoOn={myVideoIsOn}
            />
         
            
            <div className="video-buttons-div">
              
            {  myAudioIsOn ? 
            <div onClick={() => setMyAudioIsOn(selfMuteToggle(myStream))} className="svg-container svg-mute-container">
            <svg className="self-mute-button bi bi-mic-fill"
               xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="currentColor"  viewBox="0 0 16 16">
              <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
              <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
            
            </svg>
            <p>mute</p>
            </div>
            :
            <div onClick={() => setMyAudioIsOn(selfMuteToggle(myStream))} className="svg-container svg-mute-container">
            <svg className="self-mute-button bi bi-mic-mute-fill" xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="currentColor"  viewBox="0 0 16 16">
              <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z"/>
              <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"/>
            </svg>
            <p>un-mute</p>
            </div>
          }
        
           
         
            {myStream?.getVideoTracks()[0] && (
              <>
              { myVideoIsOn? 
                <div onClick={() => setMyVideoIsOn(selfVideoToggle(myStream))} className=" svg-container svg-video-container">
                 <svg  className="video-svg bi bi-camera-video-fill"xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z"/>
                 </svg>
                  <p>stop video</p>
                </div>
                  :
                  <div onClick={() => setMyVideoIsOn(selfVideoToggle(myStream))} className=" svg-container svg-video-container">
                 <svg className="video-svg bi bi-camera-video-off-fill" xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="currentColor"  viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l6.69 9.365zm-10.114-9A2.001 2.001 0 0 0 0 5v6a2 2 0 0 0 2 2h5.728L.847 3.366zm9.746 11.925-10-14 .814-.58 10 14-.814.58z"/>
                 </svg>
                  <p>start video</p>
                  </div>
                }
              
              <div onClick={async () => await shareScreen(videos, myStream)} className="svg-container svg-sharescreen-container">
              <svg className="svg-sharescreen bi bi-upload " xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="currentColor"  viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
              <p>share-screen</p>
            </div>
            </>
            )}
            </div>
            

          </div>
          )}
          
         
          
          {chooseNewHost && room.participants.length > 1 && (
            <div className="form-div choose-host-box " >
              <div className="x" onClick={() => {
                  SetchooseNewHost(false);
                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
              </svg></div>
              <p className="choose-host-p">Please chose a new host for the room</p>
              {room.participants.map((participant: any, index: number) => {
                if (participant.user._id !== user._id) {
                  return (
                    <div 
                      key={index}
                      className="host-choise"
                      onClick={() => {
                        leaveRoom(
                          roomId,
                          peerId,
                          serverSocket,
                          videos,
                          user,
                          myStream,
                          room,
                          participant.user._id
                        );
                        SetchooseNewHost(false);
                        history.push("/lobby");
                      }}
                    >
                      <p> {participant.user.username}</p>
                      <img
                        src={participant.user.profile.img}
                        alt="user profile"
                      />
                    </div>
                  );
                }
              })}
              <button
                onClick={() => {
                  SetchooseNewHost(false);
                }}
              >
                cancel
              </button>
              <button
                onClick={() => {
                  leaveRoom(
                    roomId,
                    peerId,
                    serverSocket,
                    videos,
                    user,
                    myStream,
                    room,
                    enums.defaultHost
                  );
                  SetchooseNewHost(false);
                  history.push("/lobby");
                }}
              >
                choose for me
              </button>
            </div>
          )}
       
        </div>
      )}
    </>
  );

  //functions:
  /*-------------------------------------------------------------------------------------*/
  function handleLeaveBuuton() {
    if(noUserDevices){
      history.push("/lobby");
    }else if (user._id !== room.host.userId) {

      leaveRoom(
        roomId,
        peerId,
        serverSocket,
        videos,
        user,
        myStream,
        room,
        enums.dontChangeHost
      );
      history.push("/lobby");
    } else if (
      room.participants.length === 1 &&
      room.participants[0].user._id === user._id
    ) {
      serverSocket.send(
        JSON.stringify({
          type: "delete room",
          message: room._id,
        })
      );
      //make shure there are no open calls
      videos.forEach((video: any) => {
        video.call.close();
      });
      user.peer.destroy();
      myStream?.getTracks().forEach((track: any) => {
        track.stop();
      });
      history.push("/lobby");
    } else {
      SetchooseNewHost(true);
    }
  }
  /*---------------------------------------------------------------------------------------------*/
  async function createConnection(room: any) {
    let myMedia: MediaStream | undefined |any= await getUserMedia();
    if (!myMedia) {
      console.log("no myMedia", myMedia);
      SetNoUserDevices(true);
      return;
    }
    SetNoUserDevices(false);
    console.log(user , "user");
    
   
    setMyStream(myMedia);
    

    //creating new peer
    const mypeer = new Peer();
    mypeer.on("open", async (id) => {
      if (!myMedia) {
        console.log("no myMedia", myMedia);
        return;
      }
      user.peer = mypeer;
      user.peerId = id;
      setUser({ ...user });
      const peerId = id;
      setPeerId(peerId);
      let mediaStreamId = getStreamId(myMedia.id);

     
      //tell the server to update room participant in db and at other clients
      serverSocket.send(
        JSON.stringify({
          type: "join room",
          message: {
            participant: {
              peerId: peerId,
              streamId: mediaStreamId,
              user: getCleanedUser(user),
              age: getCleanedUser(user).age
            }, // username will be changed to profile.
            roomId: room._id,
            username: user.username,
          },
        })
      );

      ///peer handler for receiving calls
      mypeer.on("call", (call: any) => {
        //handle err
        call.on("close", () => {
          console.log("user's peer closed. his call is:", call);
          
        })
        call.on("error", (err: any) => {
          console.log("error in the call", err);
        });

        //recieving new participant stream
        call.on("stream", async (remoteStream: any) => {
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
          ) {
            // participant create a call with this this one.
            console.log("got his call, its stream is:", remoteStream);
            
            videos.push({
              
              streamId: getStreamId(remoteStream.id),
              stream: remoteStream,
              call: call,
              isVideoOn: remoteStream.getVideoTracks()[0]?.enabled,
            });
            if (!room) {
              setVideos([...videos]);
            } else {
              let testVideos = [...(await getVideos(videos, myMedia, roomId))];
              setVideos(testVideos);
            }
          }
        });

        //sending my stream to new participant
        call.answer(myMedia);
      });

      //calling others
      if (!room.participants) return;

      room.participants?.forEach((participant: any) => {
        if (!myMedia) {
          console.log("no myMedia", myMedia);
          return;
        }
        if (participant.peerId === peerId) return;
        const call: any = mypeer.call(participant.peerId, myMedia);
        //unable to call
        if (!call) {
          console.log(
            "no call created, to participant:",
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
          //WORKS
        });
        //recieving new participant stream
        call.on("stream", async (remoteStream: any) => {
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
          ) {
            // participant answered this user's call with media.
            console.log("got his answered call, its stream is:", remoteStream);

            videos.push({
              
              streamId: getStreamId(remoteStream.id),
              stream: remoteStream,
              call: call,
              isVideoOn: remoteStream.getVideoTracks()[0]?.enabled,
            });
            if (!room) {
              setVideos([...videos]);
            } else {
              let testVideos = [...(await getVideos(videos, myMedia, roomId))];
              setVideos(testVideos);
            }
          }
        });
      });
    });
  }
}
export default VideoRoom;
