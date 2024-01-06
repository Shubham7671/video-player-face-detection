import React from 'react'
import { fabric } from 'fabric';
import * as faceapi from 'face-api.js';
import { useRef,useState,useEffect } from 'react';

export default function VideoPlayer() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
  
  
    const handlePlayPause = () => {
      const video = videoRef.current;
      setIsPlaying(!isPlaying);
  
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    };
  
    const handleVideoUpload = (e) => {
      const video = videoRef.current;
      const file = e.target.files[0];
  
      if (file) {
        const blobURL = URL.createObjectURL(file);
        video.src = blobURL;
      }
    };
    return (
        <>
            <div className="heading" >
                <h1 >Face Detection System</h1>
                <h4 >The Video Face Detection Project, a React app with face-api.js, enables real-time face detection in uploaded videos or webcam streams. </h4>
            </div>

            <div className='btns'>
                <div>
                    <input type="file" accept="video/*" onChange={handleVideoUpload} />
                    <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
                </div>
            </div>

            <div className='container'>
                <div className='video'>
                    <video ref={videoRef} controls={false} width="350" height="280" />
                </div>
                <div className='canva'>
                    <canvas ref={canvasRef} width="350" height="280" />
                </div>
            </div>

        </>
    )
}
