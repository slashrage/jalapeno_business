import React, { useRef, useState } from 'react';
import '../styles/MediaPlayers.css';

const VideoPlayer = ({ src, poster }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleVideoClick = () => {
    togglePlayPause();
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="video-element"
      >
        Your browser does not support the video tag.
      </video>

      <div className="video-controls-overlay">
        <button
          className="fullscreen-btn"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? '⛶' : '⛶'}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
