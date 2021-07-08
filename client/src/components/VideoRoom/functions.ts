import { enums } from "../../utils/enums";
import Network from "../../utils/network";

/*-------------------------------------------------------------------------------------*/
export const getUserByStreamId = (room: any, streamId: any): any => {
  if (!room) {
    console.log("was no room");
    return;
  }
  const user = room.participants.find((u: any) => u.streamId === streamId);
  if (!user) return;
  return user.user.profile.imageBlob;
};

/*-------------------------------------------------------------------------------------*/
export const shareScreen = async (videos: any, myStream: any): Promise<any> => {
  if (!myStream.getVideoTracks()[0]) return;

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
};

/*-------------------------------------------------------------------------------------*/
export const selfMuteToggle = (myStream: any): any => {
  if (!myStream.getTracks()[0]) return;
  myStream.getTracks()[0].enabled = !myStream.getTracks()[0].enabled;
};

/*-------------------------------------------------------------------------------------*/
export const selfVideoToggle = (myStream: any): any => {
  if (!myStream) return;
  // if (myStream.getVideoTracks()[0].enabled) {
  // }

  const newState = !myStream.getVideoTracks()[0].enabled;
  console.log(myStream.getVideoTracks()[0]);
  myStream.getVideoTracks()[0].enabled = newState;
  // console.log(myStream.getVideoTracks()[0]);
  return myStream.getVideoTracks()[0].enabled;
};

/*-------------------------------------------------------------------------------------*/
export const getCleanedUser = (user: any) => {
  return {
    username: user.username,
    profile: user.profile,
    firstname: user.firstName,
    lastname: user.lastName,
    age: 22,
    _id: user._id,
    // age: user.birthDate
    //   ? new Date().getFullYear() - user.birthDate.getFullYear()
    //   : 22,
  };
};

/*-------------------------------------------------------------------------------------*/

export const getUserMedia = async (): Promise<MediaStream | undefined> => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  } catch (e) {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
    } catch (e) {
      console.log("in the catch of the catch of usermedia", e.message);
      console.log("return nothing!!");
      return;
    }
  }
};
/*-------------------------------------------------------------------------------------*/
// const changehost = (room) => {};
/*-------------------------------------------------------------------------------------*/
export const leaveRoom = async (
  roomId: any,
  peerId: any,
  serverSocket: any,
  videos: any,
  user: any,
  myStream: any,
  room: any,
  newHostId: any = null
) => {
  console.log(room, "user", user);
  if (newHostId !== null && !newHostId) {
    newHostId = room.participants.filter((participant: any) => {
      return user._id !== participant.user._id;
    })[0];
  }
  //weird
  serverSocket.send(
    JSON.stringify({
      type: "leave room",
      message: {
        participant: { roomId, peerId: user.peerId },
        participants: room.participants,
        newHostId,
      },
    })
  );

  videos.forEach((video: any) => {
    video.call.close();
  });
  user.peer.destroy();
  myStream?.getTracks().forEach((track: any) => {
    track.stop();
  });
};

/*-------------------------------------------------------------------------------------*/
export async function getVideos(
  updatedVideos: any,
  myStream: any,
  roomId: string
) {
  try {
    const roomFromDb = await Network("GET", `${enums.baseUrl}/room/${roomId}`);
    const participantsStreams: any[] = [];
    roomFromDb?.participants.forEach((participant: any) => {
      if (myStream.id !== participant.streamId) {
        participantsStreams.push(participant.streamId);
      }
    });

    const tempVideos = updatedVideos.filter((video: any) => {
      let mediaStreamId = video.stream.id;
      if (mediaStreamId.match(/^{.+}$/)) {
        mediaStreamId = mediaStreamId.slice(1, -1);
      }

      return participantsStreams.includes(mediaStreamId);
    });

    return tempVideos;
  } catch (e) {
    console.log(e);
  }
}
/*-------------------------------------------------------------------------------------*/

export const closeRoom = (
  serverSocket: any,
  roomId: any,
  isClosed: boolean
) => {
  console.log(isClosed);
  serverSocket.send(
    JSON.stringify({
      type: "close room",
      message: { roomId, value: !isClosed },
    })
  );
};
