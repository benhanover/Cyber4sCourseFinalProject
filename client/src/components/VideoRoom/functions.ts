  /*-------------------------------------------------------------------------------------*/
export const getUserByStreamId = (room: any, streamId: any): any => {
  if (!room) {
    console.log("was no room");
    return
  }
  const user = room.participants.find((u: any) => u.streamId === streamId);
  if (!user) return;
  return user.user.profile.imageBlob
}

  /*-------------------------------------------------------------------------------------*/
export const shareScreen = async (videos: any, myStream: any): Promise<any> => {
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

  /*-------------------------------------------------------------------------------------*/
export const selfMuteToggle = (myStream: any): any => {
  if (!myStream.getTracks()[0]) return;
    myStream.getTracks()[0].enabled = !myStream.getTracks()[0].enabled;
}

  /*-------------------------------------------------------------------------------------*/
export const selfVideoToggle = (myStream: any): any => {
  if (!myStream.getVideoTracks()[0]) return;
  // if (myStream.getVideoTracks()[0].enabled) {
  // }

  const newState = !myStream.getVideoTracks()[0].enabled;
  console.log(myStream.getVideoTracks()[0]);
  myStream.getVideoTracks()[0].enabled = newState;
  // console.log(myStream.getVideoTracks()[0]);
  return myStream.getVideoTracks()[0].enabled
}

  /*-------------------------------------------------------------------------------------*/
export const getCleanedUser = (user: any) => {
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

/*-------------------------------------------------------------------------------------*/

  export const getUserMedia = async (): Promise<MediaStream | undefined> => {
    try {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (e) {
      try {
          return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        }
        catch (e) {
          console.log("in the catch of the catch of usermedia", e.message);
            console.log("return nothing!!");
            return;
          }
        }
  }

/*-------------------------------------------------------------------------------------*/
  export const leaveRoom = async (roomId: any, peerId: any, serverSocket: any, videos: any, user: any, myStream: any, room: any) => {
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
      
      video.call.close();
    });
    user.peer.destroy()
    myStream?.getTracks().forEach((track: any)=>{
      track.stop()
    })
  }