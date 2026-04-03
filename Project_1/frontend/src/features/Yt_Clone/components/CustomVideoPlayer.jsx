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
  sources,
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
  const [manualSpeed, setManualSpeed] = useState(false);

  

  const [lastInteraction, setLastInteraction] = useState(Date.now());

  const src = sources?.[quality];

  // =========================
  // APPLY VOLUME ALWAYS ✅
  // =========================
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
  }, [volume]);

  // =========================
  // APPLY SPEED
  // =========================
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = speed;
  }, [speed, src]);

  // =========================
  // AUTOPLAY FIX (🔥 AUDIO FIX)
  // =========================
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (autoPlay) {
      v.muted = true;

      v.play()
        .then(() => {
          setPlaying(true);

          // 🔥 AUTO UNMUTE AFTER PLAY
          setTimeout(() => {
            v.muted = false;
            setIsMuted(false);
          }, 400);
        })
        .catch(() => {
          console.log("Autoplay blocked");
        });
    }
  }, [src, autoPlay]);

  // =========================
  // WATCH TIME
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && playing) {
        onWatchTime?.(videoRef.current.currentTime);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [playing]);

  // =========================
  // AUTO HIDE CONTROLS
  // =========================
  useEffect(() => {
    let timeout;

    const handleMove = () => {
      setShowControls(true);
      setLastInteraction(Date.now());

      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 2500);
    };

    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMove);

    return () => el?.removeEventListener("mousemove", handleMove);
  }, []);

  // =========================
  // KEYBOARD SHORTCUTS
  // =========================
  useEffect(() => {
    const handleKey = (e) => {
  const v = videoRef.current;
  if (!v) return;

  // 🚫 IGNORE when typing
  const tag = e.target.tagName.toLowerCase();
  const isTyping =
    tag === "input" ||
    tag === "textarea" ||
    e.target.isContentEditable;

  if (isTyping) return;

  setLastInteraction(Date.now());

  switch (e.key) {
    case " ":
      e.preventDefault();
      togglePlay();
      break;

    case "ArrowRight":
      v.currentTime += 5;
      break;

    case "ArrowLeft":
      v.currentTime -= 5;
      break;

    case "ArrowUp":
      v.volume = Math.min(1, v.volume + 0.1);
      setVolume(v.volume);
      break;

    case "ArrowDown":
      v.volume = Math.max(0, v.volume - 0.1);
      setVolume(v.volume);
      break;

    case ">":
    case ".":
      if (e.shiftKey) {
        const newSpeed = Math.min(speed + 0.25, 3);
        setSpeed(newSpeed);
      }
      break;

    case "<":
    case ",":
      if (e.shiftKey) {
        const newSpeed = Math.max(speed - 0.25, 0.25);
        setSpeed(newSpeed);
      }
      break;

    case "f":
      goFullscreen();
      break;

    case "m":
      toggleMute();
      break;
  }
};


    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [speed]);

  // =========================
  // AI AUTO SPEED
  // =========================
useEffect(() => {
  const interval = setInterval(() => {
    const idleTime = Date.now() - lastInteraction;
    const v = videoRef.current;
    if (!v) return;

    // 🚫 DO NOT override if user selected speed
    if (manualSpeed) return;

    if (idleTime > 5000) {
      v.playbackRate = 1.5;
    } else {
      v.playbackRate = 1;
    }
  }, 2000);

  return () => clearInterval(interval);
}, [lastInteraction, manualSpeed]);

useEffect(() => {
  setSpeed(1);
  setManualSpeed(false);

  if (videoRef.current) {
    videoRef.current.playbackRate = 1;
  }
}, [src]);


  // =========================
  // CONTROLS
  // =========================
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

  // 🔥 FIXED MUTE LOGIC
  const toggleMute = () => {
    const v = videoRef.current;
    v.muted = !v.muted;
    setIsMuted(v.muted);

    if (!v.muted && v.volume === 0) {
      v.volume = 1;
      setVolume(1);
    }
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
  };

  const goFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const changeSpeed = (s) => {
  setSpeed(s);
  setManualSpeed(true);
  if (videoRef.current) {
    videoRef.current.playbackRate = s;
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
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onEnded={onEnd}
        onLoadedMetadata={() => {
          const v = videoRef.current;
          setDuration(v.duration);
          v.playbackRate = speed;
          v.volume = volume; // 🔥 ENSURE AUDIO
        }}
        className="w-full max-h-[75vh]"
      />

      {/* CONTROLS */}
      <motion.div
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/80"
      >
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="h-1 bg-gray-600 mb-3 cursor-pointer relative"
        >
          <div className="bg-gray-400 h-full" style={{ width: `${buffer}%` }} />
          <div className="bg-red-500 h-full absolute top-0" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex justify-between items-center text-white text-sm">

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

         <div className="flex items-center gap-3 relative">

  {/* ⚙️ SETTINGS BUTTON */}
  <button onClick={() => setShowSettings(!showSettings)}>
    <Settings />
  </button>

  {/* ⚙️ SETTINGS PANEL */}
  <AnimatePresence>
    {showSettings && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="absolute bottom-10 right-0 bg-black p-3 rounded-xl text-white w-36 z-50"
      >

        {/* SPEED */}
        <p className="text-xs mb-1 text-gray-300">Speed</p>
        {[0.5, 1, 1.25, 1.5, 2].map((s) => (
          <div
            key={s}
            onClick={() => changeSpeed(s)}
            className={`cursor-pointer px-2 py-1 rounded ${
              speed === s ? "bg-indigo-500" : "hover:bg-gray-700"
            }`}
          >
            {s}x
          </div>
        ))}

        {/* QUALITY */}
        <p className="text-xs mt-3 mb-1 text-gray-300">Quality</p>
        {Object.keys(sources || {}).map((q) => (
          <div
            key={q}
            onClick={() => setQuality(q)}
            className={`cursor-pointer px-2 py-1 rounded ${
              quality === q ? "bg-indigo-500" : "hover:bg-gray-700"
            }`}
          >
            {q}
          </div>
        ))}

      </motion.div>
    )}
  </AnimatePresence>

  {/* FULLSCREEN */}
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
