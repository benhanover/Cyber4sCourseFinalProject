import React, { useEffect, useRef } from 'react'
import { FC } from 'react'
interface Ivideo{
    stream: any;
    muted: boolean;
}
export const UserVideo: FC<Ivideo> = ({ stream, muted }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        if (!videoRef.current) {
            console.log("no videoRef.current");
            return;
        }
       videoRef.current.srcObject = stream
    }, [])
    return (
        <>
        <video ref={videoRef} autoPlay src={stream}></video>
            <audio ref={videoRef} muted={muted} autoPlay></audio>
            </>
    )
}

export default UserVideo
