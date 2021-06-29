import React, { useEffect, useRef } from 'react'
import { FC } from 'react'
interface Ivideo{
    stream: any;
    muted: boolean;
}
export const UserVideo: FC<Ivideo> = ({ stream, muted}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        if (!videoRef.current) {  //typescript
            console.log("no videoRef");
            return;
        }
       videoRef.current.srcObject = stream
    }, [])
    return (
        <>
            <video ref={videoRef} muted={muted} autoPlay ></video>
        </>
    )
}

export default UserVideo
