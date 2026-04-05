import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UploadCloud, 
  Video, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { uploadVideo } from "../services/ytapi.service";
import { Button, Input } from "../components/UI/Index";

export const UploadPage = () => {
  const navigate = useNavigate();
  
  // State
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Refs
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  // Handlers
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
    } else {
      toast.error("Please select a valid video file");
    }
  };

  const handleThumbSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setThumbFile(file);
      setThumbPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const onDropVideo = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("video/")) {
      setVideoFile(file);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !title) {
      return toast.error("Video file and title are required!");
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("description", description);
    if (thumbFile) formData.append("thumbnail", thumbFile);

    try {
      await uploadVideo(formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        }
      });

      toast.success("Video published successfully! 🚀", {
        duration: 5000,
        icon: '🎬'
      });
      
      setTimeout(() => navigate("/studio"), 1500);

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Upload failed. Please try again.");
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <UploadCloud className="text-indigo-500 w-8 h-8" />
            Upload Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Share your story with the world in ultra-HD.</p>
        </div>
        
        {videoFile && (
           <Button 
             onClick={handleUpload} 
             disabled={uploading}
             className="w-full md:w-auto h-12 px-8 bg-linear-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 text-lg font-bold"
           >
             {uploading ? `Uploading ${progress}%` : "Publish Now"}
             {!uploading && <ArrowRight className="ml-2 w-5 h-5" />}
           </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: UPLOAD ZONES */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* VIDEO ZONE */}
          <motion.div 
            whileHover={!videoFile ? { scale: 1.01 } : {}}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropVideo}
            onClick={() => !uploading && videoInputRef.current.click()}
            className={`relative border-2 border-dashed rounded-3xl p-10 md:p-20 text-center transition-all cursor-pointer overflow-hidden
              ${videoFile 
                ? "border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-500/5" 
                : "border-gray-300 dark:border-white/10 hover:border-indigo-500 bg-white dark:bg-white/5"}
            `}
          >
            <input type="file" hidden ref={videoInputRef} accept="video/*" onChange={handleVideoSelect} />
            
            <AnimatePresence mode="wait">
              {videoFile ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">{videoFile.name}</h2>
                  <p className="text-emerald-500 font-medium">Ready for processing • {(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}
                    className="mt-6 text-sm text-gray-500 hover:text-red-500 underline"
                  >
                    Change Video
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 shadow-inner">
                    <Video className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Select video to upload</h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">Drag and drop your video file here, or click to browse files</p>
                  
                  <div className="mt-10 flex gap-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-indigo-500" /> 4K Enabled</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-indigo-500" /> MP4/MOV/AVI</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PROGRESS OVERLAY */}
            {uploading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-12">
                 <div className="w-full max-w-md bg-gray-200 dark:bg-gray-800 h-3 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-linear-to-r from-indigo-500 to-purple-600"
                    />
                 </div>
                 <p className="mt-4 font-bold text-lg text-indigo-500 animate-pulse uppercase tracking-wider">
                   Uploading your story... {progress}%
                 </p>
              </div>
            )}
          </motion.div>

          {/* DETAILS BOX */}
          <div className="bg-white dark:bg-white/5 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/10 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              Video Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-500 mb-1.5 block">Title (Required)</label>
                <Input 
                  placeholder="Enter a catchy title..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-white/10"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-500 mb-1.5 block">Description</label>
                <textarea 
                  placeholder="What is this video about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-950/50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THUMBNAIL */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-200 dark:border-white/10 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                Thumbnail
              </h3>
              
              <div 
                onClick={() => !uploading && thumbInputRef.current.click()}
                className={`relative aspect-video rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer transition-all
                  ${thumbFile 
                    ? "border-emerald-500/50" 
                    : "border-gray-300 dark:border-white/10 hover:border-indigo-500 bg-gray-50 dark:bg-black/20"}
                `}
              >
                <input type="file" hidden ref={thumbInputRef} accept="image/*" onChange={handleThumbSelect} />
                
                {thumbPreview ? (
                  <div className="group relative w-full h-full">
                    <img src={thumbPreview} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ImageIcon className="text-white w-8 h-8" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-widest text-center">Select high-res image</p>
                    <p className="text-[10px] mt-1 text-gray-400">1280x720 recommended</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-gray-400 leading-relaxed">
                  A high-resolution thumbnail acts as the face of your video. Choose an image that stands out and accurately reflects your content.
                </p>
                {thumbFile && (
                  <button 
                    onClick={() => { setThumbFile(null); setThumbPreview(null); }}
                    className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest"
                  >
                    Remove Thumbnail
                  </button>
                )}
              </div>
           </div>

           {/* TIPS BOX */}
           <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6">
              <h4 className="text-indigo-500 font-bold text-sm uppercase tracking-widest mb-4">Pro Tips</h4>
              <ul className="space-y-3">
                <li className="flex gap-2 text-xs text-indigo-400/80">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Use bright, high-contrast images for thumbnails.
                </li>
                <li className="flex gap-2 text-xs text-indigo-400/80">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Check keywords for SEO.
                </li>
                <li className="flex gap-2 text-xs text-indigo-400/80">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Keep your video file size under 1GB for faster processing.
                </li>
              </ul>
           </div>
        </div>

      </div>
    </div>
  );
};
