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
} from "./functions";
/*-------------------------------------------------------------------------------------*/
// import peer functions
// import { getPeerId } from './peer'

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
  const [isClosedButtonName, setIsClosedButtonName] = useState<any>("");
  const [peerId, setPeerId] = useState<any>();
  const [videos, setVideos] = useState<any>([]);
  const [myStream, setMyStream] = useState<any>();
  const [myVideoIsOn, setMyVideoIsOn] = useState<any>(true);
  const roomId = location.search.slice(8);
  console.log(roomId, "video room");
  const [noUserDevices, SetNoUserDevices] = useState<boolean>(false);
  const [chooseNewHost, SetchooseNewHost] = useState<any>(null);

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
          {noUserDevices && (
            <div>
              <h1 style={{ color: "white" }}>
                you must give premition to media devices, at list audio
              </h1>
              <button
                onClick={(e) => {
                  createConnection(room);
                }}
              >
                try again
              </button>
            </div>
          )}

          {videos?.map((video: any, i: number) => {
            return (
              <UserVideo
                key={i}
                muted={false}
                stream={video.stream}
                username="video.username"
                userImage={getUserByStreamId(room, video.call._remoteStream.id)}
                isVideoOn={video.isVideoOn}
              />
            );
          })}
          {myStream && (
            <UserVideo
              muted={true}
              stream={myStream}
              userImage={user.profile.imageBlob}
              username="peerState"
              isVideoOn={myVideoIsOn}
            />
          )}
          <button className="leave-button" onClick={handleLeaveBuuton}>
            Leave
          </button>
          <button
            className="self-mute-button"
            onClick={() => selfMuteToggle(myStream)}
          >
            Mute
          </button>
          <button
            className="stop-self-video-button"
            onClick={() => setMyVideoIsOn(selfVideoToggle(myStream))}
          >
            Stop Video
          </button>
          {myStream?.getVideoTracks()[0] && (
            <button
              className="share-screen-button"
              onClick={async () => await shareScreen(videos, myStream)}
            >
              Share Screen
            </button>
          )}
          {chooseNewHost && room.participants.length > 1 && (
            <div className="choose-host-box">
              <p>plese chose a new host for the room</p>
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
                        src={participant.user.profile.imageBlob}
                        alt="user image"
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
                cansel
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
          <button
            onClick={() => closeRoom(serverSocket, roomId, room.isClosed)}
          >
            {isClosedButtonName}
          </button>
        </div>
      )}
    </>
  );

  //functions:
  /*-------------------------------------------------------------------------------------*/
  function handleLeaveBuuton() {
    console.log(room.participants, ":users in room");
    if (user._id !== room.host.userId) {
      console.log(1);

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
    let myMedia: MediaStream | undefined = await getUserMedia();
    if (!myMedia) {
      console.log("no myMedia", myMedia);
      SetNoUserDevices(true);
      return;
    }
    SetNoUserDevices(false);
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
        //handle err
        call.on("error", (err: any) => {
          console.log("error in the call", err);
        });

        //recieving new participant stream
        call.on("stream", async (remoteStream: any) => {
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
          ) {
            // participant create a call with this this one.
            videos.push({
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
            videos.push({
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
