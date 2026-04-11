import { useEffect, useRef, useState, useMemo } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
  Settings,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const CustomPlayer = ({
  sources,
  autoPlay = false,
  onEnd,
  onWatchTime,
  videoData = {} // New: passing full video data for AI badges
}) => {
  const { theme } = useTheme();
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
  const [isMuted, setIsMuted] = useState(true);
  const [quality, setQuality] = useState("720p");
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(false);
  const [isMini, setIsMini] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const src = sources?.[quality] || sources?.["720p"];

  // =========================
  // RESPONSIVENESS
  // =========================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Mini-player scroll logic
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!isMobile) setIsMini(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [isMobile]);

  // =========================
  // VIDEO LOGIC
  // =========================
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.playbackRate = speed;
  }, [volume, speed]);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {
        setIsMuted(true);
        videoRef.current.muted = true;
        videoRef.current.play().then(() => setPlaying(true));
      });
    }
  }, [src, autoPlay]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, [src]);

  // =========================
  // CONTROLS
  // =========================
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
    if (!videoRef.current.muted && volume === 0) setVolume(1);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v?.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
    onWatchTime?.(v.currentTime);
  };

  const handleSeek = (e) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = percent * duration;
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

  // AI Truth Markers Logic
  const truthMarkers = useMemo(() => {
    if (!videoData?.verification?.claims) return [];
    return videoData.verification.claims.map(c => ({
      ...c,
      percent: (c.timestamp || 0) / (duration || 1) * 100
    }));
  }, [videoData, duration]);

  return (
    <div 
      ref={containerRef} 
      className={`relative bg-black transition-all duration-500 rounded-3xl overflow-hidden group/player shadow-2xl
        ${isMini ? "fixed bottom-6 right-6 w-80 z-50 shadow-brand-indigo/20 scale-110" : "w-full aspect-video"}
      `}
    >
      {/* CINEMA AMBIENT LIGHTING */}
      <div className="cinema-ambient" style={{ background: `radial-gradient(circle, var(--color-brand-indigo) 0%, transparent 70%)` }} />

      <video
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        onEnded={onEnd}
        onError={() => setError(true)}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* AI STATUS BADGE (TOP RIGHT) */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <AnimatePresence>
          {videoData?.verification?.finalVerdict && videoData.verification.finalVerdict !== "UNKNOWN" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl border-white/20"
            >
              {videoData.verification.finalVerdict === "TRUE" ? (
                <ShieldCheck className="w-4 h-4 text-brand-emerald ai-glow-emerald" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-brand-crimson ai-glow-crimson" />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
                {videoData.verification.finalVerdict} CONTENT
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ERROR & LOADING OVERLAYS (REUSED LOGIC WITH NEW STYLING) */}
      {error && (
        <div className="absolute inset-0 glass-heavy flex flex-col items-center justify-center text-white p-6 text-center z-30">
          <AlertTriangle className="w-12 h-12 text-brand-crimson mb-4 ai-glow-crimson" />
          <h2 className="text-xl font-black uppercase tracking-tighter mb-2">Signal Lost</h2>
          <p className="text-sm opacity-70">The curated content could not be loaded.</p>
          <button onClick={() => { setError(false); videoRef.current?.load(); }} className="mt-6 px-6 py-2 glass rounded-full font-bold hover:bg-white/10 transition-all uppercase text-[10px] tracking-widest">Retry Access</button>
        </div>
      )}

      {/* CONTROLS */}
      <motion.div
        initial={false}
        animate={{ opacity: showControls || !playing || isMini ? 1 : 0, y: showControls || !playing || isMini ? 0 : 20 }}
        className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20"
      >
        {/* PROGRESS BAR */}
        <div className="relative group/progress mb-4">
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="h-1.5 bg-white/20 rounded-full cursor-pointer relative transition-all group-hover/progress:h-2"
          >
            <div className="bg-brand-indigo/50 h-full rounded-full absolute" style={{ width: `${buffer}%` }} />
            <div className="bg-gradient-to-r from-brand-indigo to-brand-purple h-full rounded-full absolute shadow-[0_0_10px_rgba(129,140,248,0.5)]" style={{ width: `${progress}%` }} />
            
            {/* AI TRUTH MARKERS */}
            {truthMarkers.map((marker, i) => (
              <div 
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 ai-glow-emerald cursor-help"
                style={{ left: `${marker.percent}%`, backgroundColor: marker.verdict === "TRUE" ? "var(--color-brand-emerald)" : "var(--color-brand-crimson)" }}
                title={marker.text}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={togglePlay} className="hover:scale-110 transition-transform">
              {playing ? <Pause className="fill-white" /> : <Play className="fill-white" />}
            </button>
            {!isMobile && (
              <>
                <div className="flex items-center gap-3">
                  <button onClick={toggleMute} className="hover:text-brand-indigo transition-colors">
                    {isMuted ? <VolumeX /> : <Volume2 />}
                  </button>
                  <input
                    type="range" min="0" max="1" step="0.05" value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-brand-indigo"
                  />
                </div>
                <span className="font-display font-medium text-[11px] tracking-widest uppercase opacity-70">
                  {formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {!isMobile && (
              <div className="relative">
                <button onClick={() => setShowSettings(!showSettings)} className={`hover:rotate-45 transition-transform ${showSettings ? 'text-brand-indigo' : ''}`}>
                  <Settings />
                </button>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-12 right-0 glass-heavy rounded-2xl p-3 w-40 border border-white/10 shadow-2xl"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Playback Speed</p>
                      {[0.5, 1, 1.5, 2].map(s => (
                        <button key={s} onClick={() => setSpeed(s)} className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${speed === s ? 'bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20' : 'hover:bg-white/10'}`}>{s}x</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <button onClick={goFullscreen} className="hover:scale-110 transition-transform">
              <Maximize />
            </button>
          </div>
        </div>
      </motion.div>

      {/* MINI PLAYER CLOSE */}
      {isMini && (
        <button 
          onClick={() => setIsMini(false)}
          className="absolute top-2 left-2 p-1 bg-black/50 text-white rounded-full hover:bg-black transition-colors z-40"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default CustomPlayer;
