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
    const sampleVideoRef = useRef(null);
    const intervalIdRef = useRef(null);


    const [isPlaying, setIsPlaying] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [player, setPlayer] = useState(false);

    // Load face detection models on component mount
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

    // Face detection and canvas drawing logic
    useEffect(() => {
        if (modelsLoaded) {
            // creating fabric canvas
            const canvas = new fabric.Canvas(canvasRef.current);

            const displaySize = { width: videoRef.current.width, height: videoRef.current.height };

            // function for face detection
            const drawFaces = async () => {
                try {
                    // check for video end status.
                    if (videoRef.current.ended) {
                        setIsPlaying(false);
                    }
                    // check for video ended or pause status so that we stopping detection check;
                    if (videoRef.current.paused || videoRef.current.ended) {
                        canvas.clear();
                        return;
                    }
                    canvas.clear();

                    // calling api for reconizing faces .

                    const detections = await faceapi.detectAllFaces(
                        videoRef.current,
                        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 })
                    );
                    faceapi.matchDimensions(canvasRef.current, displaySize);
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);

                    // Drawing rectangles around detected faces
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

            // added time interval for multiple face detection checks while playing the player.
            intervalIdRef.current = setInterval(drawFaces, 300);

            return () => {
                // Cleanup function: Clear intervals 
                clearInterval(intervalIdRef.current);
            };
        }
    }, [modelsLoaded]);

    // Handle play/pause controls
    const handlePlayPause = () => {
        const video = videoRef.current;
        setIsPlaying(!isPlaying);

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    };

    // Handle video upload
    const handleVideoUpload = (e) => {
        const video = videoRef.current;
        const file = e.target.files[0];
        if (file) {
            const blobURL = URL.createObjectURL(file);
            video.src = blobURL;
            setIsPlaying(true);
            setPlayer(true);
        }
    };

    // Handle selecting sample videos
    const handleSampleVideos = (e) => {
        const video = videoRef.current;
        if (e.target.value) {
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
                <p style={isPlaying ? { color: "green" } : { color: "red" }}>{isPlaying ? 'Detecting....' : 'Stoped...'}     </p>
                <button style={!isPlaying ? { background: "green" } : { background: "red" }} onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>

            </div>}

            <div className='container'>
                <div className='video'>
                    <video ref={videoRef} controls={false} autoPlay width="375" height="230" />
                </div>
                <div className='canva'>
                    <canvas ref={canvasRef} width="375" height="240" />
                </div>
            </div>
        </>
    )
}
