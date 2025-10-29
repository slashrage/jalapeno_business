import React, { useRef, useState, useEffect } from 'react';
import '../styles/MediaPlayers.css';

const AudioPlayer = ({ src, title }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (e) => {
    const audio = audioRef.current;
    audio.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    const newVolume = e.target.value;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} />

      <div className="audio-player-header">
        <h4>{title || 'Audio Player'}</h4>
      </div>

      <div className="audio-player-controls">
        <button
          className="play-pause-btn"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="time-display">
          {formatTime(currentTime)}
        </div>

        <input
          type="range"
          className="time-slider"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleTimeChange}
        />

        <div className="time-display">
          {formatTime(duration)}
        </div>

        <div className="volume-control">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
