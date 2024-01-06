import React from 'react'
import { fabric } from 'fabric';
import * as faceapi from 'face-api.js';
import { useRef, useState, useEffect } from 'react';

export default function VideoPlayer() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
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
    }, [modelsLoaded,canvasSize]);

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
        console.log(videoRef.current.width)
        if (file) {
            const blobURL = URL.createObjectURL(file);
            video.src = blobURL;
            setIsPlaying(true);
            setPlayer(true);
        }
    };
    return (
        <>
            <div className="heading" >
                {/* <h2 >Try Now</h2>
                <p>{canvasSize.width + " " + canvasSize.height}</p> */}
            </div>
            <div className='btns'>
                <div>
                    <label htmlFor="fileInput">Drop Video </label>
                    <input type="file" accept="video/*" id="fileInput" onChange={handleVideoUpload} />
                    <select name="" id="">
                        <option value="">Sample files</option>
                        <option value=""></option>
                        <option value=""></option>
                    </select>
                </div>

            </div>
            {player && <div className="videoControls">
                <h3>Detecting....      </h3>
                <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>

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
