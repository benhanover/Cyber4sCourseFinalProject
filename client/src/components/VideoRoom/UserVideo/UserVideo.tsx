import React, { useEffect, useRef, useState } from 'react'
import { FC } from 'react'
import './UserVideo.css';
interface Ivideo{
    stream: any;
    muted: boolean;
    userImage: string;
    isVideoOn: boolean;
}
export const UserVideo: FC<Ivideo> = ({ stream, muted, userImage, isVideoOn }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        if (!videoRef.current) {  //typescript
            console.log("no videoRef");
            return;
        }
        videoRef.current.srcObject = stream
    }, []);
    
    return (
        <div className="user-video-container" >
            <video ref={videoRef} className="user-video" muted={muted} autoPlay poster={userImage} style={{zIndex: isVideoOn? 1:0}}></video>
            <img className='user-image' src={userImage} alt="user-video" />
        </div >
    )
}

export default UserVideo
