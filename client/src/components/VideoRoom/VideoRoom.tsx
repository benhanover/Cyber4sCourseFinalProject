import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Peer from "peerjs";
import Network from "../../utils/network";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { State, wsActionCreator } from "../../state";
import { useRef } from "react";
import { Iroom } from "../Lobby/interfaces";

function VideoRoom() {
  const { serverSocket, user } = useSelector((state: State) => state.ws);
  const flagRef = useRef(false);
  const [peerState, setPeerState] = useState<Peer>();
  const dispatch = useDispatch();
  const { setUser } = bindActionCreators({ ...wsActionCreator }, dispatch);
  const location = useLocation();
  const [room, setRoom] = useState<Iroom | undefined>();
  const myVidRef = useRef<HTMLVideoElement | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  useEffect(() => {
    const roomId = location.search.slice(8);
    Network("GET", `http://localhost:4000/room/${roomId}`)
      .then((roomFromDb) => {
        setRoom(roomFromDb);
        console.log(roomFromDb);

        createConnection(roomFromDb);
      })
      .catch((e) => {
        console.log("could not get room in VideoRoom Component", e); ///add reaction
      });
  }, []);

  return (
    <div>
      <h1>videoRoom</h1>
      <video ref={myVidRef}></video>
      {videos.map((video) => {
        return <video autoPlay muted src={video}></video>;
      })}
    </div>
  );

  function createConnection(room: any) {
    //creating new peer
    const mypeer = new Peer();
    //getting peer id
    let peerId;
    mypeer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      user.peerId = id;
      peerId = id;
      setUser(user);

      console.log("the user before sending it to ws server", peerId);

      serverSocket.send(
        JSON.stringify({
          type: "join-room",
          message: {
            peerId: peerId,
            roomId: room._id,
            username: user.username,
          },
        })
      );

      navigator.getUserMedia(
        { video: true, audio: true },
        (media) => {
          if (!myVidRef?.current) return;
          myVidRef.current.srcObject = media;
          myVidRef.current.autoplay = true;
          myVidRef.current.muted = true;
          // when getting a call
          mypeer.on("call", (call) => {
            console.log("in the call!!! yeeaaa!!!");
            console.log("stream", media);
            call.answer(media);
            call.on("stream", (remoteStream) => {
              videos.push(remoteStream);
              setVideos([...videos]);
            });
          });
          //calling others
          room.participants.forEach((participent: string) => {
            const call = mypeer.call(participent, media);
            call.on("stream", (remoteStream) => {
              videos.push(remoteStream);
              setVideos([...videos]);
            });
          });

          //create peer hendlers
          mypeer.on("connection", (conn) => {
            conn.on("data", function (data) {
              console.log("received message from peer connection:", data);
            });
          });

          //calling all parrticipents
          room.participants?.forEach((roomMate: any) => {
            console.log(roomMate);
            const connection = mypeer.connect(roomMate);
            connection.on("open", () => {
              console.log("connecting to", roomMate);
              connection.send("Hey, we've just connected");
            });
          });
        },
        (e) => {
          console.log("error in peerjs", e);
        }
      );
      setPeerState(mypeer);
    });
  }
}
export default VideoRoom;
