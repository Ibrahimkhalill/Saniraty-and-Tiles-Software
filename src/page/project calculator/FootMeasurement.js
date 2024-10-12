import React, { useState, useRef } from 'react';
import axios from 'axios';

const CaptureImage = () => {
    const [image, setImage] = useState(null);
    const [measurement, setMeasurement] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch(err => console.error("Error accessing the camera", err));
    };

    const captureImage = () => {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.toBlob(blob => setImage(blob));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:8000/api/measure-foot/', formData);
            setMeasurement(response.data.length);
        } catch (error) {
            console.error('Error uploading image', error);
        }
    };

    return (
        <div>
            <video ref={videoRef} width="400" height="300"></video>
            <button onClick={startVideo}>Start Video</button>
            <br />
            <canvas ref={canvasRef} width="400" height="300"></canvas>
            <button onClick={captureImage}>Capture Image</button>
            <button onClick={handleSubmit}>Upload and Measure</button>
            {measurement && <p>Foot Length: {measurement} cm</p>}
        </div>
    );
};

export default CaptureImage;
