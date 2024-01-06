import React from 'react'

export default function VideoPlayer() {
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
