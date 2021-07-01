//imports
/*-------------------------------------------------------------------------------------*/
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
    Network("GET", `http://localhost:4000/room/${roomId}`)
      .then((roomFromDb) => {
        if (!room) createConnection(roomFromDb);
        setRoom(roomFromDb);
      })
      .catch((e) => {
        console.log("could not get room in VideoRoom Component", e);
      });
  }, [rooms]);
  //=========================================================
  useEffect(() => {
    console.log("the videos changed", videos);
  }, [videos]);

  //==========================================================
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
    const myMedia = await getUserMedia();
    if (!myMedia) {
      console.log("No media... ");
    }
    setMyStream(myMedia);

    //creating new peer
    const mypeer = new Peer();

    //getting peer id
    let peerId: any;
    mypeer.on("open", async (id) => {
      user.peerId = id;
      setUser({ ...user });
      peerId = id;
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
        console.log(call, "call obj");

        //hanle err
        call.on("error", (err: any) => {
          console.log("error in the call", err);
        });

        //remove participant`s stream how left the room
        call.on("close", () => {
          console.log("onclose from other");

          setVideos(
            videos.filter((video: any) => {
              console.log("compare:", video.call, "adnnnnnnn", call);

              return video.call.connectionId !== call.connectionId;
            })
          );
        });

        //recieving new participent stream
        call.on("stream", (remoteStream: any) => {
          if (
            !videos.some((video: any) => video.stream.id === remoteStream.id)
          ) {
            videos.push({ stream: remoteStream, call: call });
            setVideos([...videos]);
          }
        });
        //sending my stream to new participant
        if (myMedia) {
          call.answer(myMedia);
        }
      });

      //calling others
      if (!room.participants) return;

      room.participants?.forEach((participent: any) => {
        if (participent.peerId === peerId) return;
        const call: any = mypeer.call(participent.peerId, myMedia);

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
          console.log("removing participent vedio");

          setVideos(
            videos.filter((video: any) => {
              return video.call.connectionId !== call.connectionId;
            })
          );
        });
        //recieving new participent stream
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
  async function getUserMedia() {
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    return media;
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
  }
}
export default VideoRoom;
