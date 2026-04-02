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

  const fileRef = useRef();
  const avatarRef = useRef();
  const bannerRef = useRef();

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    video: null
  });

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
      return alert("Title + Video required");
    }

    const fd = new FormData();
    Object.entries(videoForm).forEach(([k, v]) => v && fd.append(k, v));

    await uploadVideo(fd, {
      onUploadProgress: (e) =>
        setUploadProgress(Math.round((e.loaded * 100) / e.total))
    });

    setShowUpload(false);
    setUploadProgress(0);
    setVideoForm({ title: "", description: "", video: null });

    loadData();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setVideoForm({ ...videoForm, video: file });
  };

  // ===== UPDATE CHANNEL =====
  const handleUpdate = async () => {
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

    loadData();
  };

  // ===== ANALYTICS =====
  const analyticsData = videos.map((v, i) => ({
    name: `Day ${i + 1}`,
    views: v.views || 0,
    watch: (v.views || 0) * 2
  }));

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white p-4 md:p-8 transition">

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

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute -bottom-10 left-4 md:left-8 flex items-center gap-4">

          <img
            src={avatarPreview || channel?.avatar || FALLBACK_AVATAR}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-black object-cover"
          />

          <div>
            <h2 className="text-lg md:text-xl font-bold">
              {channel?.name || "Your Channel"}
            </h2>
            <p className="text-gray-300">
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

      {/* VIDEOS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {videos.map((v) => (
          <motion.div key={v._id} whileHover={{ scale: 1.05 }}
            className="bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden">

            <img
              src={v.thumbnail || FALLBACK_THUMB}
              className="h-44 w-full object-cover"
            />

            <div className="p-4">
              <h3>{v.title}</h3>
              <p className="text-gray-400">{v.views} views</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      <AnimatePresence>
        {showEdit && (
          <motion.div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">

            <motion.div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4">

              <div className="flex justify-between">
                <h2>Edit Channel</h2>
                <X onClick={()=>setShowEdit(false)} className="cursor-pointer"/>
              </div>

              <input
                value={updateForm.name}
                placeholder="Channel Name"
                className="w-full p-2 border bg-transparent"
                onChange={(e)=>setUpdateForm({...updateForm,name:e.target.value})}
              />

              <textarea
                value={updateForm.description}
                placeholder="Description"
                className="w-full p-2 border bg-transparent"
                onChange={(e)=>setUpdateForm({...updateForm,description:e.target.value})}
              />

              {/* Avatar */}
              <div onClick={()=>avatarRef.current.click()}
                className="border p-3 text-center cursor-pointer">
                Upload Avatar
              </div>

              <input type="file" hidden ref={avatarRef}
                onChange={(e)=>{
                  const file=e.target.files[0];
                  setUpdateForm({...updateForm,avatar:file});
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />

              {/* Banner */}
              <div onClick={()=>bannerRef.current.click()}
                className="border p-3 text-center cursor-pointer">
                Upload Banner
              </div>

              <input type="file" hidden ref={bannerRef}
                onChange={(e)=>{
                  const file=e.target.files[0];
                  setUpdateForm({...updateForm,banner:file});
                  setBannerPreview(URL.createObjectURL(file));
                }}
              />

              <Button onClick={handleUpdate}>Save</Button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= UPLOAD MODAL ================= */}
      <AnimatePresence>
        {showUpload && (
          <motion.div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">

            <motion.div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4">

              <div className="flex justify-between">
                <h2>Upload Video</h2>
                <X onClick={()=>setShowUpload(false)} className="cursor-pointer"/>
              </div>

              <input
                placeholder="Title"
                className="w-full p-2 border bg-transparent"
                onChange={(e)=>setVideoForm({...videoForm,title:e.target.value})}
              />

              <textarea
                placeholder="Description"
                className="w-full p-2 border bg-transparent"
                onChange={(e)=>setVideoForm({...videoForm,description:e.target.value})}
              />

              <div
                onClick={()=>fileRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e)=>e.preventDefault()}
                className="border-2 border-dashed p-6 text-center cursor-pointer"
              >
                {videoForm.video ? videoForm.video.name : "Drag & Drop or Click"}
              </div>

              <input
                type="file"
                hidden
                ref={fileRef}
                onChange={(e)=>setVideoForm({...videoForm,video:e.target.files[0]})}
              />

              {uploadProgress > 0 && (
                <div className="h-2 bg-gray-300 dark:bg-gray-700">
                  <div
                    className="h-2 bg-indigo-500"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <Button  onClick={handleUpload}>Upload</Button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
