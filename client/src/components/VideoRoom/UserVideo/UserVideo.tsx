import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FC } from 'react'
import './UserVideo.css';
interface Ivideo{
    stream: any;
    muted: boolean;
    userImage: string;
    isVideoOn: boolean;
    username: any;
}
export const UserVideo: FC<Ivideo> = ({ stream, muted, userImage, isVideoOn, username }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    // const peerRef = useRef(peer);
useEffect(() => {
    if (!videoRef.current) {  //typescript
        console.log("no videoRef");
        return;
    }
    videoRef.current.srcObject =stream
    }, [isVideoOn])

    useEffect(() => {
        stream.getVideoTracks()[0].addEventListener('muted' , () => {
            console.log("muted");
          
        });
        stream.getVideoTracks()[0].addEventListener('unmuted', () => {
            console.log("unmuted");
          
        });
    //     video.stream.getVideoTracks()[0].onunmute = () => {
    //       console.log("unmuted");
          
    //   }
        }, [])

    return (
        <div className="user-video-container" >
                <video ref={videoRef} poster={userImage} className="user-video" muted={muted} autoPlay ></video> 
                <img className='user-image' src={userImage} alt="user-video" />
        </div >
    )
}

export default UserVideo
