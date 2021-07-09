import React, { useCallback, useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";
import { FC } from "react";
import "./UserVideo.css";
interface Ivideo {
  stream: any;
  muted: boolean;
  userImage: string;
  isVideoOn: boolean;
  username: any;
}
export const UserVideo: FC<Ivideo> = ({
  stream,
  muted,
  userImage,
  isVideoOn,
  username,
}) => {
  let w: any, h: any, ratio: any, context: any;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [textFromVideo, setTextFromVideo] = useState<any>(false);

  useEffect(() => {
    if (!videoRef.current) {
      //typescript
      console.log("no videoRef");
      return;
    }
    videoRef.current.srcObject = stream;
  }, [isVideoOn]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) {
      console.log("no videoRef , no canvasRef");
      return;
    }

    context = canvasRef.current.getContext("2d");
    videoRef.current.addEventListener(
      "loadedmetadata",
      function () {
        if (!videoRef.current || !canvasRef.current) {
          console.log("no videoRef and no contaxt");

          return;
        }
        ratio = videoRef.current.videoWidth / videoRef.current.videoHeight;
        w = videoRef.current.videoWidth;
        h = w / ratio;
        canvasRef.current.width = w;
        canvasRef.current.height = h;
      },
      false
    );
  }, []);

  return (
    <div className="user-video-container">
      <video
        controls
        controlsList="Full "
        ref={videoRef}
        poster={userImage}
        className="user-video"
        muted={muted}
        autoPlay
      ></video>
      <img className="user-image" src={userImage} alt="user-video" />
      <button className="extract-text-button" onClick={getText}>
        extract text
      </button>
      <canvas style={{ display: "none" }} ref={canvasRef}></canvas>
      {textFromVideo && (
        <div className="text-from-video-div">
          <button
            className="close-text-div"
            onClick={() => setTextFromVideo(false)}
          >
            XX
          </button>
          <p>{textFromVideo}</p>
        </div>
      )}
    </div>
  );
  //functions
  /*============================================================================*/
  function snap(): any {
    if (!context) {
      console.log("there is no context");
      return;
    }
    context.fillRect(0, 0, w, h);
    context.drawImage(videoRef.current, 0, 0, w, h);
    const dataUrl = canvasRef.current?.toDataURL("image/jpeg");
    console.log(dataUrl);
    return dataUrl;
  }
  function getText() {
    const img: any = snap();
    Tesseract.recognize(img, "eng", {
      logger: (m: any) => console.log(m),
    })
      .catch((err: any) => {
        console.error(err);
      })
      .then((result: any) => {
        // Get Confidence score
        let confidence: any = result.data.confidence;

        let text: any = result.data.text;
        console.log(result, "dddd", confidence);
        console.log(text);
        setTextFromVideo(text);
      });
  }
};

export default UserVideo;
