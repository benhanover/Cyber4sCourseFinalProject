import React, { useEffect, useRef } from 'react'
import { FC } from 'react'
interface Ivideo{
    stream: any;
}
export const UserVideo: FC<Ivideo> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        if (!videoRef.current) {
            console.log("no videoRef.current");
            return;
        }
       videoRef.current.srcObject = stream
    }, [])
    return (
        <video ref={videoRef} muted autoPlay src={stream}></video>
    )
}

export default UserVideo
