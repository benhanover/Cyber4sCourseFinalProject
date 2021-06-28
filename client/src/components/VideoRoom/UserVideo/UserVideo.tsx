import React, { useEffect, useRef } from 'react'
import { FC } from 'react'
interface Ivideo{
    stream: any;
    muted: boolean;
}
export const UserVideo: FC<Ivideo> = ({ stream, muted = false}) => {
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
        <video ref={videoRef} muted={muted} autoPlay ></video>
            {muted ? null : <audio ref={videoRef} autoPlay ></audio>}
            </>
    )
}

export default UserVideo
