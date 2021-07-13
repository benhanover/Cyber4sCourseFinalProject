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
useEffect(() => {
    if (!videoRef.current) {  //typescript
        console.log("no videoRef");
        return;
    }
    
    videoRef.current.srcObject =stream
    }, [])

    return (
        <div className="user-video-container" >
                <video ref={videoRef} poster={userImage} controls className="user-video" muted={muted} autoPlay ></video> 
                <img className='user-image' src={userImage} alt="user-video" />
                <div className="username-div">{username}</div>
        </div >
    )
}

export default UserVideo
