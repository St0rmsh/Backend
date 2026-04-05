import { useEffect, useState, useRef } from "react";
import {
  UploadCloud,
  BarChart3,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Video
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
  const createAvatarRef = useRef(null);
  const createBannerRef = useRef(null);

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

  const [createForm, setCreateForm] = useState({
    name: "",
    handle: "",
    description: "",
    avatar: null,
    banner: null
  });
  const [createAvatarPreview, setCreateAvatarPreview] = useState(null);
  const [createBannerPreview, setCreateBannerPreview] = useState(null);

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

  // ===== CREATE CHANNEL =====
  const handleCreate = async () => {
    if (!createForm.name || !createForm.handle) {
      return toast.error("Name and Handle are required");
    }

    const toastId = toast.loading("Creating your channel...");
    try {
      const fd = new FormData();
      Object.entries(createForm).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });

      await createChannel(fd);

      toast.success("Welcome to Creator Studio! 🎬", { id: toastId });
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create channel", { id: toastId });
    }
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

  if (!channel || !channel.name) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0c0c22] p-6 lg:p-12 flex flex-col justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* GREETING */}
          <div className="space-y-6">
            <div className="w-20 h-20 bg-linear-to-tr from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-indigo-500/30">
              Y
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight dark:text-white">
               Launch your <span className="bg-linear-to-r from-indigo-400 to-purple-100 bg-clip-text text-transparent">Creative Journey</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
               Build your brand, share your stories, and connect with millions. Start by creating your professional channel today.
            </p>
          </div>

          {/* FORM */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 lg:p-10 space-y-6 shadow-2xl">
              <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Channel Name</label>
                        <input
                          placeholder="Super Awesome Channel"
                          className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#1a1a3a] border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                          onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Handle</label>
                        <input
                          placeholder="@creative_soul"
                          className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#1a1a3a] border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all text-indigo-500 font-medium"
                          onChange={(e) => setCreateForm({...createForm, handle: e.target.value})}
                        />
                      </div>
                  </div>

                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Description</label>
                      <textarea
                        placeholder="Tell the world what makes you unique..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#1a1a3a] border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all resize-none"
                        onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                     {/* CREATE AVATAR */}
                     <div 
                       onClick={() => createAvatarRef.current.click()}
                       className={`relative h-28 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex items-center justify-center
                         ${createAvatarPreview ? 'border-indigo-500/50 bg-indigo-50/5' : 'border-gray-200 dark:border-white/10 hover:border-indigo-500 bg-white dark:bg-black/20'}
                       `}
                     >
                       {createAvatarPreview ? (
                         <img src={createAvatarPreview} className="w-full h-full object-cover" />
                       ) : (
                         <div className="flex flex-col items-center text-gray-400">
                           <ImageIcon className="w-7 h-7 mb-1 opacity-50" />
                           <span className="text-[10px] font-bold uppercase">Avatar</span>
                         </div>
                       )}
                       <input type="file" hidden ref={createAvatarRef} accept="image/*" onChange={(e) => {
                         const file=e.target.files[0];
                         if(file) { setCreateForm({...createForm, avatar:file}); setCreateAvatarPreview(URL.createObjectURL(file)); }
                       }} />
                     </div>

                     {/* CREATE BANNER */}
                     <div 
                       onClick={() => createBannerRef.current.click()}
                       className={`relative h-28 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex items-center justify-center
                         ${createBannerPreview ? 'border-indigo-500/50 bg-indigo-50/5' : 'border-gray-200 dark:border-white/10 hover:border-indigo-500 bg-white dark:bg-black/20'}
                       `}
                     >
                        {createBannerPreview ? (
                         <img src={createBannerPreview} className="w-full h-full object-cover" />
                       ) : (
                         <div className="flex flex-col items-center text-gray-400">
                           <ImageIcon className="w-7 h-7 mb-1 opacity-50" />
                           <span className="text-[10px] font-bold uppercase">Banner</span>
                         </div>
                       )}
                       <input type="file" hidden ref={createBannerRef} accept="image/*" onChange={(e) => {
                         const file=e.target.files[0];
                         if(file) { setCreateForm({...createForm, banner:file}); setCreateBannerPreview(URL.createObjectURL(file)); }
                       }} />
                     </div>
                  </div>
              </div>

              <button 
                onClick={handleCreate}
                className="w-full py-4 rounded-3xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                  Establish Channel
              </button>
          </div>
        </motion.div>
      </div>
    );
  }

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

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Channel Name</label>
                  <input
                    value={updateForm.name}
                    placeholder="Enter channel name"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#1a1a3a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
                    onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea
                    value={updateForm.description}
                    placeholder="Tell viewers about your channel"
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#1a1a3a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none shadow-inner"
                    onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Avatar Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-widest text-[10px]">Avatar (1:1)</label>
                    <div 
                      onClick={() => avatarRef.current.click()}
                      className={`group relative h-32 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex items-center justify-center
                        ${avatarPreview || channel?.avatar ? 'border-emerald-500/30 bg-emerald-50/5' : 'border-gray-200 dark:border-white/10 hover:border-indigo-500 bg-gray-50 dark:bg-black/20'}
                      `}
                    >
                      {avatarPreview || channel?.avatar ? (
                        <>
                          <img src={avatarPreview || channel?.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <ImageIcon className="text-white w-8 h-8" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-[10px] font-bold uppercase">Upload Pic</span>
                        </div>
                      )}
                    </div>
                    <input type="file" hidden ref={avatarRef} accept="image/*" onChange={(e) => {
                      const file=e.target.files[0];
                      if(file) { setUpdateForm({...updateForm, avatar:file}); setAvatarPreview(URL.createObjectURL(file)); }
                    }} />
                  </div>

                  {/* Banner Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-widest text-[10px]">Banner (16:9)</label>
                    <div 
                      onClick={() => bannerRef.current.click()}
                      className={`group relative h-32 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex items-center justify-center
                        ${bannerPreview || channel?.banner ? 'border-emerald-500/30 bg-emerald-50/5' : 'border-gray-200 dark:border-white/10 hover:border-indigo-500 bg-gray-50 dark:bg-black/20'}
                      `}
                    >
                      {bannerPreview || channel?.banner ? (
                        <>
                          <img src={bannerPreview || channel?.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <ImageIcon className="text-white w-8 h-8" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-[10px] font-bold uppercase">Upload Banner</span>
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
                  className="px-8 py-3 rounded-2xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
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
                onClick={() => !uploadProgress && fileRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`group relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all shadow-inner
                  ${videoForm.video ? 'border-emerald-500/50 bg-emerald-50/5' : 'border-gray-300 dark:border-indigo-500/30 hover:border-indigo-500 bg-gray-50/50 dark:bg-[#1a1a3a]/50'}
                `}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all shadow-md
                  ${videoForm.video ? 'bg-emerald-100 text-emerald-500' : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500'}
                `}>
                  {videoForm.video ? <CheckCircle2 className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
                </div>
                {videoForm.video ? (
                  <p className="font-bold text-center text-emerald-600 dark:text-emerald-400 max-w-full truncate px-4 animate-pulse">
                    {videoForm.video.name}
                  </p>
                ) : (
                  <>
                    <p className="font-bold text-gray-700 dark:text-[#e5e3ff] uppercase tracking-widest text-xs">Drag & Drop Video</p>
                    <p className="text-[10px] text-gray-500 dark:text-[#aaa8c6] mt-1 italic">or click to browse</p>
                  </>
                )}
              </div>
              <input type="file" hidden ref={fileRef} accept="video/*" onChange={(e) => setVideoForm({...videoForm, video: e.target.files[0]})} />

              {/* Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Title</label>
                      <input
                        value={videoForm.title}
                        placeholder="Epic video title..."
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1a3a] border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Thumbnail (16:9)</label>
                      <div 
                        onClick={() => !uploadProgress && thumbRef.current.click()}
                        className={`group relative h-10 rounded-xl border border-dashed transition-all cursor-pointer overflow-hidden flex items-center justify-center
                          ${thumbnailPreview ? 'border-emerald-500/50 bg-emerald-50/5' : 'border-gray-300 dark:border-white/10 hover:border-indigo-500 bg-gray-50 dark:bg-black/20'}
                        `}
                      >
                        {thumbnailPreview ? (
                            <div className="flex items-center gap-2 text-xs text-emerald-500 font-bold">
                               <CheckCircle2 className="w-3 h-3" /> Selected
                            </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500 group-hover:text-indigo-500 transition-colors">
                            <ImageIcon className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">Upload</span>
                          </div>
                        )}
                      </div>
                      <input type="file" hidden ref={thumbRef} accept="image/*" onChange={(e) => {
                        const file=e.target.files[0];
                        if(file) { setVideoForm({...videoForm, thumbnail:file}); setThumbnailPreview(URL.createObjectURL(file)); }
                      }} />
                   </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea
                    value={videoForm.description}
                    placeholder="What's this about?"
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1a3a] border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                  />
                </div>
              </div>

              {/* Progress Bar */}
              {uploadProgress > 0 && (
                <div className="w-full pt-2">
                  <div className="flex justify-between text-[10px] font-bold mb-1.5 dark:text-gray-300 text-gray-700 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Video className="w-3 h-3 text-indigo-500 animate-pulse" /> Publishing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
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
                  className={`px-8 py-3 rounded-2xl text-white font-bold shadow-lg transition-all text-sm uppercase tracking-widest
                    ${uploadProgress > 0 ? 'bg-gray-500 cursor-not-allowed opacity-70' : 'bg-linear-to-r from-indigo-500 to-purple-600 hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95'}
                  `}
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
