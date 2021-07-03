import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FC } from 'react'
import './UserVideo.css';
interface Ivideo{
    video: any;
    muted: boolean;
    userImage: string;
    isVideoOn: boolean;
    peer: any;
}
export const OtherUserVideo: FC<Ivideo> = ({ video, muted, userImage, isVideoOn, peer }) => {
const videoRef = useRef<HTMLVideoElement | null>(null);
const videoSenders = video.call.peerConnection.getSenders().find((sender: any)=>{
    return sender.track.kind === "video"
});
const videoTrack = videoSenders.track;
console.log(videoTrack,"videtrack");
videoTrack.addEventListener('ended', () => console.log('track ended'));
videoTrack.onended= function(e: any){
console.log(e, "onended");

}
    // const peerRef = useRef(peer);
useEffect(() => {
    if (!videoRef.current) {  //typescript
        console.log("no videoRef");
        return;
    }
    videoRef.current.srcObject = video.stream
}, [isVideoOn])
    // useEffect(() => {
    //     console.log(peer);
    //     if (!peerRef.current && peer) {
    //         peerRef.current = peer;
    //         console.log("changing peerRef");
            
    //     }
    // }, [peer])

    useEffect(() => {
        video.stream.getVideoTracks()[0].addEventListener('muted' , () => {
            console.log("muted");
          
        });
        video.stream.getVideoTracks()[0].addEventListener('unmuted', () => {
            console.log("unmuted");
          
        });
        }, [])

    return (
        <div className="user-video-container" >
            { isVideoOn
                ? 
                <video ref={videoRef} poster={userImage} className="user-video" muted={muted} autoPlay ></video> 
                    :
                <img className='user-image' src={userImage} alt="user-video" />
            }
        
        </div >
    )
}

export default OtherUserVideo



//track.stop();
//track.dispatchEvent(new Event("ended"));