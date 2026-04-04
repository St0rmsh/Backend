import { useEffect, useState, useRef } from "react";
import {
  UploadCloud,
  BarChart3,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { toast } from "react-hot-toast";

import {
  getMyVideos,
  getMyChannel,
  updateChannel,
  uploadVideo
} from "../services/ytapi.service";

import { Card, CardContent, Button } from "../components/UI/Index";

// ===== FALLBACKS =====
const FALLBACK_AVATAR = "https://ui-avatars.com/api/?name=User&background=random";
const FALLBACK_BANNER = "https://picsum.photos/1200/300";
const FALLBACK_THUMB = "https://picsum.photos/400/250";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [channel, setChannel] = useState(null);

  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const fileRef = useRef(null);
  const avatarRef = useRef(null);
  const bannerRef = useRef(null);
  const thumbRef = useRef(null);

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    video: null,
    thumbnail: null
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [updateForm, setUpdateForm] = useState({
    name: "",
    description: "",
    avatar: null,
    banner: null
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    subs: 0,
    watch: 0
  });

  // ===== LOAD =====
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [v, c] = await Promise.all([getMyVideos(), getMyChannel()]);

    const vids = v.data.videos || [];
    const ch = c.data.channel || {};

    setVideos(vids);
    setChannel(ch);

    setUpdateForm({
      name: ch.name || "",
      description: ch.description || "",
      avatar: null,
      banner: null
    });

    updateStats(vids, ch);
  };

  const updateStats = (vids, ch) => {
    const views = vids.reduce((a, v) => a + (v.views || 0), 0);
    const likes = vids.reduce((a, v) => a + (v.likesCount || 0), 0);

    setStats({
      views,
      likes,
      subs: ch?.subscribersCount || 0,
      watch: Math.floor(views * 1.8)
    });
  };

  // ===== UPLOAD =====
  const handleUpload = async () => {
    if (!videoForm.title || !videoForm.video) {
      return toast.error("Title and Video file are required");
    }

    const toastId = toast.loading("Uploading video...");
    try {
      const fd = new FormData();
      Object.entries(videoForm).forEach(([k, v]) => v && fd.append(k, v));

      await uploadVideo(fd, {
        onUploadProgress: (e) =>
          setUploadProgress(Math.round((e.loaded * 100) / e.total))
      });

      setShowUpload(false);
      setUploadProgress(0);
      setVideoForm({ title: "", description: "", video: null, thumbnail: null });
      setThumbnailPreview(null);

      toast.success("Video uploaded successfully!", { id: toastId });
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to upload video", { id: toastId });
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setVideoForm({ ...videoForm, video: file });
  };

  // ===== UPDATE CHANNEL =====
  const handleUpdate = async () => {
    const toastId = toast.loading("Saving channel details...");
    try {
      const fd = new FormData();

      fd.append("name", updateForm.name);
      fd.append("description", updateForm.description);

      if (updateForm.avatar) fd.append("avatar", updateForm.avatar);
      if (updateForm.banner) fd.append("banner", updateForm.banner);

      const res = await updateChannel(fd);

      setChannel(res.data.channel);
      setShowEdit(false);
      setAvatarPreview(null);
      setBannerPreview(null);

      toast.success("Channel updated successfully!", { id: toastId });
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update channel", { id: toastId });
    }
  };

  // ===== ANALYTICS =====
  const analyticsData = videos.map((v, i) => ({
    name: `Day ${i + 1}`,
    views: v.views || 0,
    watch: (v.views || 0) * 2
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c0c22] text-gray-900 dark:text-[#e5e3ff] p-4 md:p-10 transition-colors duration-300">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Creator Studio 🎬</h1>

        <Button onClick={() => setShowUpload(true)}>
          <UploadCloud size={16}/> Upload
        </Button>
      </div>

      {/* CHANNEL */}
      <div className="relative rounded-xl overflow-hidden mb-16">

        <img
          src={bannerPreview || channel?.banner || FALLBACK_BANNER}
          className="w-full h-40 md:h-56 object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 dark:from-[#0c0c22]/90 via-black/40 to-transparent" />

        <div className="absolute -bottom-8 left-4 md:left-8 flex items-center gap-4 md:gap-6 z-10 w-full">

          <img
            src={avatarPreview || channel?.avatar || FALLBACK_AVATAR}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full ring-4 ring-gray-50 dark:ring-[#0c0c22] object-cover shadow-2xl"
          />

          <div className="flex-1 pb-8">
            <h2 className="text-xl md:text-3xl font-bold text-white drop-shadow-md">
              {channel?.name || "Your Channel"}
            </h2>
            <p className="text-gray-200 text-sm md:text-base font-medium mt-1">
              @{channel?.handle || "handle"}
            </p>
          </div>
        </div>
      </div>

      {/* EDIT BUTTON */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowEdit(true)}>
          Edit Channel
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([k, v]) => (
          <motion.div whileHover={{ y: -5 }} key={k}>
            <Card>
              <CardContent>
                <p className="text-gray-400 capitalize">{k}</p>
                <h2 className="text-2xl font-bold">{v}</h2>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ANALYTICS */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent>
            <h3 className="flex gap-2 mb-2">
              <BarChart3 size={16}/> Views Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsData}>
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Line dataKey="views" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3>Watch Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analyticsData}>
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Area dataKey="watch" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {videos.map((v) => (
          <motion.div key={v._id} whileHover={{ y: -5 }}
            className="bg-white dark:bg-[#1a1a3a] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all relative">

            {/* AI BADGES */}
            <div className="absolute top-2 right-2 z-30 flex flex-col items-end gap-1.5 opacity-90">
              {v?.isFlagged && (
                <div className="bg-red-500/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  False Info
                </div>
              )}
              {v?.deepfakeScore > 0.6 && (
                <div className="bg-purple-600/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                  <span className="text-[10px]">✨</span> AI Edited
                </div>
              )}
              {v?.verification?.finalVerdict === "TRUE" && !v?.isFlagged && (
                <div className="bg-emerald-500/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[10px] font-bold tracking-widest uppercase shadow-md">
                   Verified
                </div>
              )}
            </div>

            <img
              src={v.thumbnail || FALLBACK_THUMB}
              className="h-48 w-full object-cover"
            />

            <div className="p-4 bg-white dark:bg-[#1a1a3a]">
              <h3 className="font-semibold text-gray-900 dark:text-[#e5e3ff] line-clamp-2 leading-snug">{v.title}</h3>
              <p className="text-sm text-gray-500 dark:text-[#aaa8c6] mt-1.5 font-medium">{v.views} views</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      <AnimatePresence>
        {showEdit && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111129] border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-lg shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Channel</h2>
                <button onClick={() => setShowEdit(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Channel Name</label>
                  <input
                    value={updateForm.name}
                    placeholder="Enter channel name"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1a3a] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={updateForm.description}
                    placeholder="Tell viewers about your channel"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1a3a] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-4">
                  {/* Avatar Upload */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar</label>
                    <div 
                      onClick={() => avatarRef.current.click()}
                      className="group relative h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors bg-gray-50 dark:bg-[#1a1a3a]"
                    >
                      {avatarPreview || channel?.avatar ? (
                        <>
                          <img src={avatarPreview || channel?.avatar} className="w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                          <UploadCloud className="absolute w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 transition-colors">
                          <UploadCloud className="w-6 h-6 mb-1" />
                          <span className="text-xs font-medium">Upload</span>
                        </div>
                      )}
                    </div>
                    <input type="file" hidden ref={avatarRef} accept="image/*" onChange={(e) => {
                      const file=e.target.files[0];
                      if(file) { setUpdateForm({...updateForm, avatar:file}); setAvatarPreview(URL.createObjectURL(file)); }
                    }} />
                  </div>

                  {/* Banner Upload */}
                  <div className="flex-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banner</label>
                    <div 
                      onClick={() => bannerRef.current.click()}
                      className="group relative h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors bg-gray-50 dark:bg-[#1a1a3a]"
                    >
                      {bannerPreview || channel?.banner ? (
                        <>
                          <img src={bannerPreview || channel?.banner} className="w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                          <UploadCloud className="absolute w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 transition-colors">
                          <UploadCloud className="w-6 h-6 mb-1" />
                          <span className="text-xs font-medium text-center">Upload Banner</span>
                        </div>
                      )}
                    </div>
                    <input type="file" hidden ref={bannerRef} accept="image/*" onChange={(e) => {
                      const file=e.target.files[0];
                      if(file) { setUpdateForm({...updateForm, banner:file}); setBannerPreview(URL.createObjectURL(file)); }
                    }} />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleUpdate}
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= UPLOAD MODAL ================= */}
      <AnimatePresence>
        {showUpload && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111129] border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-lg shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Video</h2>
                <button onClick={() => {setShowUpload(false); setUploadProgress(0);}} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Video File Dropzone */}
              <div
                onClick={() => fileRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="group relative border-2 border-dashed border-gray-300 dark:border-indigo-500/30 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 dark:bg-[#1a1a3a]/50 transition-all shadow-inner"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <UploadCloud className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                </div>
                {videoForm.video ? (
                  <p className="font-semibold text-center text-indigo-600 dark:text-indigo-400 max-w-full truncate px-4">
                    {videoForm.video.name}
                  </p>
                ) : (
                  <>
                    <p className="font-semibold text-gray-700 dark:text-[#e5e3ff]">Drag & Drop video file</p>
                    <p className="text-sm text-gray-500 dark:text-[#aaa8c6] mt-1">or click to browse</p>
                  </>
                )}
              </div>
              <input type="file" hidden ref={fileRef} accept="video/*" onChange={(e) => setVideoForm({...videoForm, video: e.target.files[0]})} />

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Required)</label>
                  <input
                    value={videoForm.title}
                    placeholder="Add a title that describes your video"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1a3a] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={videoForm.description}
                    placeholder="Tell viewers about your video"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1a3a] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                  />
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail</label>
                  <div 
                    onClick={() => thumbRef.current.click()}
                    className="group relative h-28 w-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors bg-gray-50 dark:bg-[#1a1a3a]"
                  >
                    {thumbnailPreview ? (
                        <>
                          <img src={thumbnailPreview} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                          <UploadCloud className="absolute w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                        </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 transition-colors">
                        <UploadCloud className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium text-center px-2">Upload Thumbnail</span>
                      </div>
                    )}
                  </div>
                  <input type="file" hidden ref={thumbRef} accept="image/*" onChange={(e) => {
                    const file=e.target.files[0];
                    if(file) { setVideoForm({...videoForm, thumbnail:file}); setThumbnailPreview(URL.createObjectURL(file)); }
                  }} />
                </div>
              </div>

              {/* Progress Bar */}
              {uploadProgress > 0 && (
                <div className="w-full">
                  <div className="flex justify-between text-xs font-medium mb-1 dark:text-gray-300 text-gray-700">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-linear-to-r from-indigo-500 to-purple-600"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={handleUpload}
                  disabled={uploadProgress > 0}
                  className={`px-6 py-2.5 rounded-xl text-white font-semibold shadow-lg transition-all ${uploadProgress > 0 ? 'bg-gray-500 cursor-not-allowed opacity-70' : 'bg-linear-to-r from-indigo-500 to-purple-600 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95'}`}
                >
                  {uploadProgress > 0 ? "Uploading..." : "Publish Video"}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
