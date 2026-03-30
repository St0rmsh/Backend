import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CustomPlayer = ({
  sources, // 🔥 multiple quality sources
  autoPlay = false,
  onEnd,
  onWatchTime
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);

  const [playing, setPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [buffer, setBuffer] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState("720p");
  const [showSettings, setShowSettings] = useState(false);

  const src = sources?.[quality];

  // 🔥 AUTOPLAY
useEffect(() => {
  const v = videoRef.current;
  if (!v) return;

  if (autoPlay) {
    v.muted = true; // 🔥 important
    v.play()
      .then(() => setPlaying(true))
      .catch(() => {
        console.log("Autoplay blocked");
      });
  }
}, [src, autoPlay]);

  // 🔥 WATCH TIME
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && playing) {
        onWatchTime?.(videoRef.current.currentTime);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [playing]);

  // 🔥 AUTO HIDE
  useEffect(() => {
    let timeout;
    const handleMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 2500);
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
    videoRef.current.currentTime += time;
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
    <div ref={containerRef} className="relative bg-black rounded-xl overflow-hidden">

      {/* VIDEO */}
      <video
        key={src}
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onEnded={onEnd}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        className="w-full max-h-[75vh]"
      />

      {/* CENTER PLAY */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={togglePlay}
              className="bg-black/60 p-5 rounded-full"
            >
              <Play size={40} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTROLS */}
      <motion.div
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/80"
      >

        {/* PROGRESS */}
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="h-1 bg-gray-600 mb-3 cursor-pointer relative"
        >
          <div className="bg-gray-400 h-full" style={{ width: `${buffer}%` }} />
          <div className="bg-red-500 h-full absolute top-0" style={{ width: `${progress}%` }} />
        </div>

        {/* CONTROLS ROW */}
        <div className="flex justify-between items-center text-white text-sm">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button onClick={() => skip(-5)}><SkipBack /></button>
            <button onClick={togglePlay}>
              {playing ? <Pause /> : <Play />}
            </button>
            <button onClick={() => skip(5)}><SkipForward /></button>

            <button onClick={toggleMute}>
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolume}
            />

            <span>
              {formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 relative">

            {/* SETTINGS */}
            <button onClick={() => setShowSettings(!showSettings)}>
              <Settings />
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-10 right-0 bg-black p-3 rounded-xl text-white"
                >
                  <p className="text-xs mb-1">Speed</p>
                  {[0.5, 1, 1.5, 2].map((s) => (
                    <div key={s} onClick={() => changeSpeed(s)} className="cursor-pointer">
                      {s}x
                    </div>
                  ))}

                  <p className="text-xs mt-2 mb-1">Quality</p>
                  {Object.keys(sources || {}).map((q) => (
                    <div key={q} onClick={() => setQuality(q)} className="cursor-pointer">
                      {q}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={goFullscreen}>
              <Maximize />
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default CustomPlayer;
