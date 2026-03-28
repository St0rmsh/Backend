import { useEffect, useRef, useState } from "react";

const CustomPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [buffer, setBuffer] = useState(0);

  // ▶ PLAY / PAUSE
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  // ⏱ UPDATE PROGRESS
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    setProgress((video.currentTime / video.duration) * 100);
  };

  // 📦 BUFFER PROGRESS
  const handleProgress = () => {
    const video = videoRef.current;
    if (!video || video.buffered.length === 0) return;

    const bufferedEnd = video.buffered.end(0);
    setBuffer((bufferedEnd / video.duration) * 100);
  };

  // 🎯 SEEK
  const handleSeek = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;

    const video = videoRef.current;
    if (!video || !video.duration) return;

    video.currentTime = percent * video.duration;
  };

  // 🔊 VOLUME
  const handleVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    videoRef.current.volume = v;
  };

  // ⚡ SPEED
  const changeSpeed = (s) => {
    setSpeed(s);
    videoRef.current.playbackRate = s;
  };

  // 🖥 FULLSCREEN (container, not video)
  const goFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // ⌨ KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKey = (e) => {
      const video = videoRef.current;
      if (!video) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === "ArrowRight") video.currentTime += 5;
      if (e.code === "ArrowLeft") video.currentTime -= 5;
      if (e.code === "KeyF") goFullscreen();
      if (e.code === "ArrowUp") {
        video.volume = Math.min(1, video.volume + 0.1);
        setVolume(video.volume);
      }
      if (e.code === "ArrowDown") {
        video.volume = Math.max(0, video.volume - 0.1);
        setVolume(video.volume);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playing]);

  // ⏲ FORMAT TIME
  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  // 🧠 DEBUG (IMPORTANT)
  useEffect(() => {
    console.log("VIDEO SRC:", src);
  }, [src]);

  if (!src) {
    return (
      <div className="h-[400px] flex items-center justify-center text-white bg-black rounded-xl">
        Video not available
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative group bg-black rounded-xl overflow-hidden"
    >

      {/* VIDEO */}
      <video
        ref={videoRef}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        className="w-full max-h-[70vh]"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* CONTROLS */}
      <div className="
        absolute bottom-0 left-0 w-full p-3
        bg-gradient-to-t from-black/80 to-transparent
        opacity-100 md:opacity-0 md:group-hover:opacity-100
        transition
      ">

        {/* PROGRESS BAR */}
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="relative h-1 bg-gray-600 rounded cursor-pointer mb-3"
        >
          {/* BUFFER */}
          <div
            className="absolute h-full bg-gray-400"
            style={{ width: `${buffer}%` }}
          />

          {/* PROGRESS */}
          <div
            className="absolute h-full bg-red-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* CONTROLS */}
        <div className="flex items-center justify-between text-white text-sm">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <button onClick={togglePlay}>
              {playing ? "⏸" : "▶"}
            </button>

            <span>
              {formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}
            </span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolume}
              className="w-20"
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            <select
              value={speed}
              onChange={(e) => changeSpeed(Number(e.target.value))}
              className="bg-black/50 border border-gray-600 rounded px-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>

            <button onClick={goFullscreen}>⛶</button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CustomPlayer;
