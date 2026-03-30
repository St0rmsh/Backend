import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack
} from "lucide-react";

const CustomPlayer = ({ src, onEnd, onWatchTime }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [buffer, setBuffer] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // 🔥 reload on src change
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    video.load();
    setPlaying(false);
    setProgress(0);
  }, [src]);

  // 🔥 WATCH TIME TRACKING
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && playing) {
        onWatchTime?.(videoRef.current.currentTime);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [playing]);

  // AUTO HIDE
  useEffect(() => {
    let timeout;
    const handleMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMove);
    return () => el?.removeEventListener("mousemove", handleMove);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const skip = (time) => {
    const v = videoRef.current;
    v.currentTime += time;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v?.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleProgress = () => {
    const v = videoRef.current;
    if (!v || v.buffered.length === 0) return;

    const end = v.buffered.end(v.buffered.length - 1);
    setBuffer((end / v.duration) * 100);
  };

  const handleSeek = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
  };

  const handleVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    videoRef.current.volume = v;
  };

  const changeSpeed = (s) => {
    setSpeed(s);
    videoRef.current.playbackRate = s;
  };

  const goFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div ref={containerRef} className="relative bg-black rounded-xl">

      <video
        key={src}
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onEnded={onEnd}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        className="w-full max-h-[70vh]"
      />

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={togglePlay} className="bg-black/50 p-4 rounded-full">
            <Play size={40} className="text-white" />
          </button>
        </div>
      )}

      <div className={`absolute bottom-0 w-full p-3 ${showControls ? "opacity-100" : "opacity-0"} transition`}>

        <div ref={progressRef} onClick={handleSeek} className="h-1 bg-gray-600 mb-3 cursor-pointer">
          <div className="bg-gray-400 h-full" style={{ width: `${buffer}%` }} />
          <div className="bg-red-500 h-full" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex justify-between text-white">

          <div className="flex gap-3 items-center">
            <button onClick={() => skip(-5)}><SkipBack /></button>
            <button onClick={togglePlay}>{playing ? <Pause /> : <Play />}</button>
            <button onClick={() => skip(5)}><SkipForward /></button>

            <button onClick={toggleMute}>
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>

            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolume} />

            <span>{formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}</span>
          </div>

          <div className="flex gap-3">
            <select value={speed} onChange={(e) => changeSpeed(Number(e.target.value))}>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>

            <button onClick={goFullscreen}><Maximize /></button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;
