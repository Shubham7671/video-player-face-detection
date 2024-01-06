import React from 'react'
import { fabric } from 'fabric';
import * as faceapi from 'face-api.js';
import { useRef, useState, useEffect } from 'react';
import sampleVideoPath1 from '../assests/pexels-kampus-production-5983738 (2160p).mp4'; 
import sampleVideoPath2 from '../assests/pexels-ivan-samkov-5676151 (1080p).mp4'; 
import sampleVideoPath3 from '../assests/pexels-kampus-production-7963467 (2160p).mp4'; 



export default function VideoPlayer() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const sampleVideoRef=useRef(null);
    const intervalIdRef = useRef(null);


    const [isPlaying, setIsPlaying] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [player, setPlayer] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                setModelsLoaded(true);
            } catch (error) {
                console.error('Error loading models:', error);
            }
        };
        loadModels();
    }, []);

    useEffect(() => {
        if (modelsLoaded) {
            const canvas = new fabric.Canvas(canvasRef.current);
            const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
            const drawFaces = async () => {
                try {
                    if (videoRef.current.ended) {
                        setIsPlaying(false);
                    }
                    if (videoRef.current.paused || videoRef.current.ended) {
                        canvas.clear();
                        return;
                    }
                    canvas.clear();

                    const detections = await faceapi.detectAllFaces(
                        videoRef.current,
                        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 })
                    );
                    faceapi.matchDimensions(canvasRef.current,displaySize );
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);

                    resizedDetections.forEach((detection) => {
                        const rect = new fabric.Rect({
                            right: detection.box.right,
                            bottom: detection.box.bottom,
                            left: detection.box.left,
                            top: detection.box.top,
                            width: detection.box.width,
                            height: detection.box.height,
                            fill: 'transparent',
                            strokeWidth: 2,
                            stroke: 'green',
                        });
                        canvas.add(rect);
                    });
                } catch (error) {
                    console.error('Error drawing faces:', error);
                }
            };

            intervalIdRef.current = setInterval(drawFaces, 300);

            return () => {
                clearInterval(intervalIdRef.current);
                canvas.dispose();
            };
        }
    }, [modelsLoaded]);

    const handlePlayPause = () => {
        const video = videoRef.current;
        setIsPlaying(!isPlaying);

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    };
   const gh=(e)=>{
    console.log(e.target.style);
   }


    const handleVideoUpload = (e) => {
        const video = videoRef.current;
        const file = e.target.files[0];
        // console.log(videoRef.current.width)
        if (file) {
            const blobURL = URL.createObjectURL(file);
            video.src = blobURL;
            setIsPlaying(true);
            setPlayer(true);
        }
    };
    const handleSampleVideos=(e)=>{
        const video = videoRef.current;
         if(e.target.value){
            const sampleVideoPath = e.target.value;
            video.src = sampleVideoPath;
            console.log(sampleVideoPath)
            setIsPlaying(true);
            setPlayer(true);
            console.log(e.target.value)
         }
    }
    return (
        <>
            <div className="heading" >
                <h2 >Explore Now</h2>
               
                {/* <video src={sampleVideoPath} autoPlay controls={false}></video> */}
            </div>
            <div className='btns'>
                <div>
                    <label htmlFor="fileInput">Drop Video </label>
                    <input type="file" accept="video/*" id="fileInput" onChange={handleVideoUpload} />
                    <select name="" id="" ref={sampleVideoRef} onChange={handleSampleVideos} >
                        <option value="">Sample files</option>
                        <option value={sampleVideoPath1}>File 1</option>
                        <option value={sampleVideoPath2}>File 2</option>
                        <option value={sampleVideoPath3}>File 3</option>
                    </select>
                </div>

            </div>
            {player && <div className="videoControls">
                <p style={isPlaying?{color:"green"}:{color:"red"}}>{isPlaying ? 'Detecting....' : 'Stoped...'}     </p>
                <button style={!isPlaying?{background:"green"}:{background:"red"}} onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>

            </div>}

            <div className='container'>
                <div className='video'>
                    <video ref={videoRef} controls={false} autoPlay width="350" height="280"  />
                </div>
                <div className='canva'>
                    <canvas ref={canvasRef} width="350" height="280" />
                </div>
            </div>
        </>
    )
}
