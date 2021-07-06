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
function VideoRoom() {
  //redux states
  /*-------------------------------------------------------------------------------------*/
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
  const [noUserDevices, SetNoUserDevices] = useState<boolean>(false);

  //hapens on 2 cases:
  //on componnent did mount:  get the room details and creat the peer js connection
  // on roomstate change: update  the room details from db
  /*-------------------------------------------------------------------------------------*/
  useEffect(() => {
    Network("GET", `http://localhost:4000/room/${roomId}`)
      .then((roomFromDb) => {
        if (!room) createConnection(roomFromDb);
        setRoom(roomFromDb);
        const relevnatStream = roomFromDb.participants.map(
          (user: any) => user.streamId
        );
        console.log("stream id in videos", relevnatStream);
        setVideos(
          videos.filter((video: any) => {
            return relevnatStream.includes(video.stream.id);
          })
        );
        // setVideoImages(getAllRemoteProfileImages())
      })
      .catch((e) => {
        console.log("could not get room in VideoRoom Component", e);
      });
  }, [rooms]);
  useEffect(() => {
    console.log("videos:", videos);
  }, [videos]);

  //component renders:
  /*-------------------------------------------------------------------------------------*/

  return videos && room ? (
    <div className="video-room">
      {noUserDevices && (
        <div>
          <h1>you must give premition to media devices, at list audio</h1>
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
        // console.log(peerState);

        return (
          <UserVideo
            key={i}
            muted={false}
            stream={video.stream}
            username="video.username"
            userImage={getUserByStreamId(video.call._remoteStream.id)}
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
      <button className="leave-button" onClick={leaveRoom}>
        Leave
      </button>
      <button className="self-mute-button" onClick={selfMuteToggle}>
        Mute
      </button>
      <button className="stop-self-video-button" onClick={selfVideoToggle}>
        Stop Video
      </button>
      <button className="share-screen-button" onClick={shareScreen}>
        Share Screen
      </button>
    </div>
  ) : null;

  //functions:
  /*-------------------------------------------------------------------------------------*/

  function getUserByStreamId(streamId: any) {
    if (!room) {
      console.log("was no room");
      return;
    }
    const user = room.participants.find((u: any) => {
      // console.log("user", u);
      // console.log("streamId argument", streamId);
      // console.log("users streamId", u.streamId);

      return u.streamId === streamId;
    });
    if (!user) return;
    return user.user.profile.imageBlob;
  }

  async function shareScreen() {
    //@ts-ignore
    const screenMedia = await navigator.mediaDevices.getDisplayMedia({
      cursor: true,
    });
    const screenTrack = screenMedia.getTracks()[0];
    videos.forEach((video: any) => {
      let videoSender = video.call.peerConnection
        .getSenders()
        .find((sender: any) => {
          return sender.track.kind === "video";
        });
      videoSender.replaceTrack(screenTrack);
    });
    screenTrack.onended = function () {
      videos.forEach((video: any) => {
        let videoSender = video.call.peerConnection
          .getSenders()
          .find((sender: any) => {
            return sender.track.kind === "video";
          });
        videoSender.replaceTrack(myStream.getVideoTracks()[0]);
      });
    };
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
    const videoState = myStream.getVideoTracks()[0].enabled;
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
  }

  async function createConnection(room: any) {
    console.log("inside create connection");

    //get user media
    const myMedia: MediaStream | false = await getUserMedia();

    //no media at all=>return
    if (!myMedia) {
      SetNoUserDevices(true);
      return;
    }

    setMyStream(myMedia);

    //creating new peer
    const mypeer = new Peer();

    //getting peer id;
    mypeer.on("open", async (id) => {
      user.peer = mypeer;
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
        call.on("stream", (remoteStream: any) => {
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
          ) {
            videos.push({
              stream: remoteStream,
              call: call,
              isVideoOn: remoteStream.getVideoTracks()[0]?.enabled,
            });
            setVideos([...videos]);
          }
        });

        //sending my stream to new participant
        call.answer(myMedia);
      });

      //calling others
      if (!room.participants) return;

      room.participants?.forEach((participant: any) => {
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
          console.log("removing participant video");
          setVideos(
            videos.filter((video: any) => {
              if (video.call.connectionId === call.connectionId) {
                console.log(
                  "removed this call with this connectionId:",
                  call.connectionId
                );
              }
              return video.call.connectionId !== call.connectionId;
            })
          );
        });
        //recieving new participant stream
        call.on("stream", (remoteStream: any) => {
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
          ) {
            videos.push({
              stream: remoteStream,
              call: call,
              isVideoOn: remoteStream.getVideoTracks()[0]?.enabled,
            });
            setVideos([...videos]);
          }
        });
      });
    });
    setPeerState(mypeer);
  }

  /*-----------------------------------------------------------------------------------*/
  async function getUserMedia(): Promise<MediaStream | false> {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("audio+video", media);
      return media;
    } catch (e) {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        console.log("audio", media);

        return media;
      } catch (e) {
        console.log("no media at all alert err");
        return false;
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
    user.peer.destroy();
    myStream?.getTracks().forEach((track: any) => {
      track.stop();
    });

    history.push("/loby");
  }
}
export default VideoRoom;
