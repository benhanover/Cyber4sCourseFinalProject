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
  const flagRef = useRef(false);
  const [peerState, setPeerState] = useState<Peer>();
  const dispatch = useDispatch();
  const { setUser } = bindActionCreators({ ...wsActionCreator }, dispatch);
  const location = useLocation();
  const [room, setRoom] = useState<Iroom | undefined>();
  const myVidRef = useRef<HTMLVideoElement | null>(null);
  const [videos, setVideos] = useState<any>([]);
  const [myStream , setMyStream] = useState<any>();
  useEffect(() => {
    const roomId = location.search.slice(8);
    Network("GET", `http://192.168.1.111:4000/room/${roomId}`)
      .then((roomFromDb) => {
        setRoom(roomFromDb);
        console.log(roomFromDb);

        createConnection(roomFromDb);
       
      })
      .catch((e) => {
        console.log("could not get room in VideoRoom Component", e); ///add reaction
      });
      getUserMedia().then((media) => {
          setMyStream(media)
        // videos.push(media);
        // setVideos([...videos]);
      }).catch(err => console.log("thats why: ", err)
      )
  }, []);
 
    useEffect(() => {
     console.log("videos changed:", videos.length, videos);
     
    }, [videos])
  return (
    <div>
      <h1>videoRoom</h1>
          {videos?.map((videoStream: any, i: number) => {
              //   if(!myStream) return null;
              return <UserVideo key={i} stream={videoStream} />
          })}
      
          {myStream &&
              <UserVideo stream={myStream} />}
    </div>
  );

    function createConnection(room: any) {
        //creating new peer
        const mypeer = new Peer();
        //getting peer id
        let peerId;
        mypeer.on("open", async (id) => {
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
           
           
           ///peer handler for receiving stream
            mypeer.on("call", (call) => {
                console.log("i received a call yeeaaa!!!", myStream);
                // if (media) {
                call.answer(myStream);
                // }
                call.on("stream", (remoteStream) => {
                    console.log("mypeer call listener");
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
            
            if(!room.participants)return
            //calling others
            room.participants?.forEach((participent: string) => {
                const call = mypeer.call(participent, myStream);
                if (!call) {
                    console.log("no call created, participant:", participent, "myStream:", myStream);
                    return;
                }
                call.on("error", (err) => {
                    console.log("error in the call", err);
                });
                call.on("stream", (remoteStream: any) => {
                    console.log("setting on the video");
                    // const stream = new MediaStream();
                    // stream.addTrack(remoteStream);
                    //setVideos(true);
                    videos.push(remoteStream);
                    setVideos([...videos]);
                });
            });

            
        });
        setPeerState(mypeer);
    };
    async function getUserMedia(){
        const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log(media);
        
        return media
        }
    }
export default VideoRoom;

