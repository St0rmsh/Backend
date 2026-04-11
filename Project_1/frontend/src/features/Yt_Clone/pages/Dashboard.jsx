import { useEffect, useState, useRef } from "react";
import {
  UploadCloud,
  BarChart3,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Video,
  Sparkles,
  Users,
  Eye,
  Heart,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Settings,
  ShieldCheck,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";
import { toast } from "react-hot-toast";

import {
  getMyVideos,
  getMyChannel,
  updateChannel,
  uploadVideo,
  createChannel
} from "../services/ytapi.service";

import { Card, CardContent, Button, Input } from "../components/UI/Index";
import { useTheme } from "../context/ThemeContext";

// ===== FALLBACKS =====
const FALLBACK_AVATAR = "https://ui-avatars.com/api/?name=User&background=random";
const FALLBACK_BANNER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop";
const FALLBACK_THUMB = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop";

const Dashboard = () => {
  const { theme } = useTheme();
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

  // State to track dragging
  const [isDragging, setIsDragging] = useState({
    createAvatar: false,
    createBanner: false,
    editAvatar: false,
    editBanner: false,
    uploadVideo: false,
    uploadThumb: false
  });

  // Helper for drag states
  const setDrag = (key, val) => setIsDragging(prev => ({ ...prev, [key]: val }));

  // Helper for prevent default
  const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };

  // Helper for drop events
  const handleDropFile = (e, key, callback) => {
    prevent(e);
    setDrag(key, false);
    const file = e.dataTransfer.files[0];
    if (file) callback(file);
  };

  // ===== LOAD =====
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
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
    } catch (err) {
      console.error(err);
    }
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

    const toastId = toast.loading("Archiving video signal...");
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

      toast.success("Broadcast archived successfully!", { id: toastId });
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Transmission failed", { id: toastId });
      setUploadProgress(0);
    }
  };

  // ===== CREATE CHANNEL =====
  const handleCreate = async () => {
    if (!createForm.name || !createForm.handle) {
      return toast.error("Name and Handle are required for station ID");
    }

    const toastId = toast.loading("Establishing station ID...");
    try {
      const fd = new FormData();
      Object.entries(createForm).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });

      await createChannel(fd);
      toast.success("Welcome to the Curator Network! 🎬", { id: toastId });
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Establishment failed", { id: toastId });
    }
  };

  // ===== UPDATE CHANNEL =====
  const handleUpdate = async () => {
    const toastId = toast.loading("Saving station changes...");
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

      toast.success("Station updated successfully!", { id: toastId });
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed", { id: toastId });
    }
  };

  // ===== ANALYTICS =====
  const analyticsData = videos.slice(0, 7).reverse().map((v, i) => ({
    name: `V${i + 1}`,
    views: v.views || 0,
    watch: (v.views || 0) * 1.5
  }));

  // =========================
  // ONBOARDING VIEW (EMPTY CHANNEL)
  // =========================
  if (!channel || !channel.name) {
    return (
      <div className="min-h-screen bg-main flex flex-col items-center justify-center p-6 md:p-12 selection:bg-brand-indigo/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* LURE */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <div className="w-14 h-14 bg-gradient-to-tr from-brand-indigo to-brand-purple rounded-2xl flex items-center justify-center text-white shadow-2xl ai-glow-indigo">
                 <Sparkles className="w-8 h-8" />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-indigo">Curator Access</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-main leading-[0.9] uppercase italic">
               The Stage Is <br /> <span className="text-brand-indigo">Waiting.</span>
            </h1>
            
            <p className="text-xl text-muted font-medium max-w-md leading-relaxed">
               Establish your station ID and begin broadcasting high-fidelity neural content to the world.
            </p>

            <div className="flex flex-wrap gap-8 text-[11px] font-bold text-main/60 uppercase tracking-widest pt-4">
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-emerald" /> AI Verification</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-purple" /> Global Reach</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-indigo" /> Premium Stats</span>
            </div>
          </div>

          {/* FORM */}
          <Card className="glass-heavy border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <CardContent className="p-8 md:p-12 space-y-8">
               <h2 className="text-2xl font-display font-black text-main uppercase italic border-b border-main pb-4">Initialize Station</h2>
               
               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Input 
                     label="Station Name"
                     placeholder="The Curated Hub"
                     value={createForm.name}
                     onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                   />
                   <Input 
                     label="Station Handle"
                     placeholder="@curator"
                     icon={Users}
                     value={createForm.handle}
                     onChange={(e) => setCreateForm({...createForm, handle: e.target.value})}
                   />
                 </div>

                 <Input 
                   label="Mission Brief"
                   placeholder="Share your creative intent..."
                   value={createForm.description}
                   onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                 />

                 <div className="grid grid-cols-2 gap-4">
                    {/* Create Avatar */}
                    <div 
                      onClick={() => createAvatarRef.current.click()}
                      onDragOver={(e) => { prevent(e); setDrag('createAvatar', true); }}
                      onDragLeave={() => setDrag('createAvatar', false)}
                      onDrop={(e) => handleDropFile(e, 'createAvatar', (file) => {
                        setCreateForm({...createForm, avatar:file}); 
                        setCreateAvatarPreview(URL.createObjectURL(file));
                      })}
                      className={`group aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 text-center
                        ${isDragging.createAvatar ? 'border-brand-indigo bg-brand-indigo/10 scale-105' : 'border-main bg-surface-low hover:border-brand-indigo'}
                      `}
                    >
                      {createAvatarPreview ? (
                        <img src={createAvatarPreview} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon className={`w-6 h-6 mb-2 transition-colors ${isDragging.createAvatar ? 'text-brand-indigo' : 'text-muted group-hover:text-brand-indigo'}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted">Avatar</span>
                          <p className="text-[8px] mt-1 text-muted/50 hidden group-hover:block uppercase tracking-tighter italic">or drop file</p>
                        </>
                      )}
                      <input type="file" hidden ref={createAvatarRef} accept="image/*" onChange={(e) => {
                        const file=e.target.files[0];
                        if(file) { setCreateForm({...createForm, avatar:file}); setCreateAvatarPreview(URL.createObjectURL(file)); }
                      }} />
                    </div>

                    {/* Create Banner */}
                    <div 
                      onClick={() => createBannerRef.current.click()}
                      onDragOver={(e) => { prevent(e); setDrag('createBanner', true); }}
                      onDragLeave={() => setDrag('createBanner', false)}
                      onDrop={(e) => handleDropFile(e, 'createBanner', (file) => {
                        setCreateForm({...createForm, banner:file}); 
                        setCreateBannerPreview(URL.createObjectURL(file));
                      })}
                      className={`group aspect-video rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 text-center h-full
                        ${isDragging.createBanner ? 'border-brand-indigo bg-brand-indigo/10 scale-105' : 'border-main bg-surface-low hover:border-brand-indigo'}
                      `}
                    >
                       {createBannerPreview ? (
                        <img src={createBannerPreview} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon className={`w-6 h-6 mb-2 transition-colors ${isDragging.createBanner ? 'text-brand-indigo' : 'text-muted group-hover:text-brand-indigo'}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted">Banner</span>
                          <p className="text-[8px] mt-1 text-muted/50 hidden group-hover:block uppercase tracking-tighter italic">or drop file</p>
                        </>
                      )}
                      <input type="file" hidden ref={createBannerRef} accept="image/*" onChange={(e) => {
                        const file=e.target.files[0];
                        if(file) { setCreateForm({...createForm, banner:file}); setCreateBannerPreview(URL.createObjectURL(file)); }
                      }} />
                    </div>
                 </div>
               </div>

               <Button 
                variant="brand" 
                onClick={handleCreate}
                className="w-full py-6 text-sm flex items-center justify-center"
               >
                 Launch My Channel <ArrowRight className="w-5 h-5 ml-2" />
               </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // =========================
  // MAIN STUDIO VIEW
  // =========================
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10 space-y-12 bg-main min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-brand-indigo w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-main/60">Creator Dashboard</span>
          </div>
          <h1 className="text-4xl font-display font-black text-main uppercase italic tracking-tighter">
            Studio <span className="text-brand-indigo">Command</span>
          </h1>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Button variant="ghost" onClick={() => setShowEdit(true)} className="flex-1 md:flex-none">
            <Settings className="w-4 h-4" /> Edit Station
          </Button>
          <Button variant="brand" onClick={() => setShowUpload(true)} className="flex-1 md:flex-none">
            <UploadCloud className="w-4 h-4" /> Publish Content
          </Button>
        </div>
      </div>

      {/* STATION PROFILE HEADER */}
      <div className="relative group">
        <div className="absolute inset-0 bg-brand-indigo/10 blur-[100px] opacity-20 -z-10" />
        <Card className="overflow-hidden border-white/5">
           <div className="relative h-48 md:h-64 overflow-hidden">
              <img 
                src={bannerPreview || channel?.banner || FALLBACK_BANNER} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-12 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 w-[calc(100%-2rem)]">
                 <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-[2rem] border-4 border-white/10 overflow-hidden shadow-2xl bg-surface shrink-0">
                   <img 
                     src={avatarPreview || channel?.avatar || FALLBACK_AVATAR} 
                     className="w-full h-full object-cover" 
                     alt="avatar"
                   />
                 </div>
                 <div className="pb-2 text-center sm:text-left">
                    <h2 className="text-xl md:text-3xl font-display font-black text-white uppercase italic tracking-tighter line-clamp-1">
                      {channel?.name}
                    </h2>
                    <p className="text-brand-indigo font-black text-xs uppercase tracking-widest mt-0.5">
                      @{channel?.handle}
                    </p>
                 </div>
              </div>
           </div>
        </Card>
      </div>

      {/* BENTO STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[
          { label: "Views", val: stats.views, icon: Eye, color: "brand-indigo" },
          { label: "Subs", val: stats.subs, icon: Users, color: "brand-purple" },
          { label: "Aura", val: stats.likes, icon: Heart, color: "brand-crimson" },
          { label: "Flux", val: stats.watch, icon: Clock, color: "brand-emerald" },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full bg-brand-indigo/[0.02] border-white/5">
              <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-5">
                <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-${stat.color}/10 text-${stat.color} shadow-lg shadow-${stat.color}/10`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-main/60 truncate">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-display font-black text-main mt-0.5 md:mt-1 truncate">{stat.val.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ANALYTICS HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2">
            <CardContent>
               <div className="flex items-center justify-between mb-8">
                 <h3 className="font-display font-black text-main uppercase italic flex items-center gap-3">
                   <TrendingUp className="text-brand-emerald w-5 h-5" /> Resonance Trends
                 </h3>
                 <div className="flex gap-2">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-indigo" /><span className="text-[9px] font-black uppercase text-muted">Views</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-emerald" /><span className="text-[9px] font-black uppercase text-muted">Watch</span></div>
                 </div>
               </div>
               
               <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-brand-indigo)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--color-brand-indigo)" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorWatch" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-brand-emerald)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--color-brand-emerald)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-glass)', borderRadius: '1rem', border: '1px solid var(--border-main)', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="var(--color-brand-indigo)" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" dataKey="watch" stroke="var(--color-brand-emerald)" strokeWidth={3} fillOpacity={1} fill="url(#colorWatch)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         <Card className="flex flex-col justify-center items-center p-8 bg-brand-purple/5 border-brand-purple/20 text-center relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-purple/20 blur-[60px] group-hover:bg-brand-purple/40 transition-all duration-700" />
            <div className="w-20 h-20 bg-brand-purple/10 rounded-full flex items-center justify-center mb-6 ai-glow-purple">
               <Video className="w-8 h-8 text-brand-purple" />
            </div>
            <h3 className="text-xl font-display font-black text-main uppercase italic mb-2">Grow Your Vision</h3>
            <p className="text-sm text-muted font-medium mb-8">AI-verified content achieves <span className="text-brand-purple">x2.4</span> more engagement in the Curator Network.</p>
            <Button variant="brand" className="w-full bg-brand-purple hover:bg-brand-purple/90 shadow-brand-purple/20" onClick={() => setShowUpload(true)}>
               Analyze New Clip
            </Button>
         </Card>
      </div>

      {/* CONTENT MANAGEMENT */}
      <div className="space-y-6">
        <h3 className="text-2xl font-display font-black text-main uppercase italic tracking-tighter">
          Archived <span className="text-brand-indigo">Signals</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {videos.length > 0 ? videos.map((v, i) => {
            const totalOpinions = (v.likesCount || 0) + (v.dislikesCount || 0);
            const likeRatio = totalOpinions > 0 ? Math.round((v.likesCount / totalOpinions) * 100) : 0;
            
            return (
              <motion.div 
                 key={v._id} 
                 whileHover={{ y: -8 }}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.05 }}
                 className="group"
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-main group-hover:border-brand-indigo/50 transition-all bg-surface shadow-sm hover:shadow-2xl">
                  <img 
                    src={v.thumbnail || FALLBACK_THUMB} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt="thumb" 
                  />
                  
                  {/* AI BADGES */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20">
                    {v?.verification?.finalVerdict === "TRUE" && (
                       <div className="glass px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xl">
                          <ShieldCheck className="w-3 h-3 text-brand-emerald" />
                          <span className="text-[8px] font-black uppercase text-white">Verified</span>
                       </div>
                    )}
                    {v?.deepfakeScore > 0.5 && (
                      <div className="glass px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xl">
                         <Sparkles className="w-3 h-3 text-brand-purple" />
                         <span className="text-[8px] font-black uppercase text-white">AI Clarified</span>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Button variant="ghost" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                       View Stats
                     </Button>
                  </div>
                </div>

                <div className="mt-4 px-1 space-y-3">
                   <h4 className="font-bold text-main truncate leading-snug group-hover:text-brand-indigo transition-colors">{v.title}</h4>
                   
                   <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-main/60">
                         <span>{v.views} Views</span>
                         <span className={likeRatio >= 80 ? 'text-brand-emerald' : likeRatio >= 50 ? 'text-brand-indigo' : 'text-brand-crimson'}>
                           {likeRatio}% Resonance
                         </span>
                      </div>
                      
                      {/* LIKE/DISLIKE RATIO BAR */}
                      <div className="h-1 w-full bg-main rounded-full overflow-hidden flex shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${likeRatio}%` }}
                           className="h-full bg-brand-indigo"
                         />
                         <div className="h-full flex-1 bg-surface-low" />
                      </div>

                      <div className="flex items-center gap-4 text-[9px] font-bold text-main/40">
                         <span className="flex items-center gap-1"><ThumbsUp className="w-2.5 h-2.5" /> {v.likesCount || 0}</span>
                         <span className="flex items-center gap-1"><ThumbsDown className="w-2.5 h-2.5" /> {v.dislikesCount || 0}</span>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-2 border-t border-main/50">
                      <span className="text-[8px] font-bold text-brand-emerald flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> LIVE
                      </span>
                      <span className="text-[8px] font-bold text-muted uppercase">ARCHIVED ON {new Date(v.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="col-span-full py-20 text-center glass rounded-[3rem] border-dashed border-2 border-main">
               <p className="text-muted font-bold italic">No signals archived in this station yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= EDIT MODAL (REDESIGNED) ================= */}
      <AnimatePresence>
        {showEdit && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass-heavy border border-white/10 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] w-full max-w-xl shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-main">
                <h2 className="text-2xl font-display font-black text-main uppercase italic">Edit Station ID</h2>
                <button onClick={() => setShowEdit(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              <div className="space-y-6">
                 <Input 
                   label="Station Name"
                   value={updateForm.name}
                   onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                 />
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">Mission briefing</label>
                    <textarea 
                      value={updateForm.description}
                      onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                      className="w-full p-5 rounded-2xl bg-surface-low border border-main text-main font-bold outline-none focus:ring-2 focus:ring-brand-indigo/50 min-h-[100px] resize-none"
                    />
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Edit Avatar */}
                    <div 
                      onClick={() => avatarRef.current.click()} 
                      onDragOver={(e) => { prevent(e); setDrag('editAvatar', true); }}
                      onDragLeave={() => setDrag('editAvatar', false)}
                      onDrop={(e) => handleDropFile(e, 'editAvatar', (file) => {
                        setUpdateForm({...updateForm, avatar:file}); 
                        setAvatarPreview(URL.createObjectURL(file));
                      })}
                      className={`group aspect-video rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center
                        ${isDragging.editAvatar ? 'border-brand-indigo bg-brand-indigo/10 scale-105' : 'border-main bg-surface-low'}
                      `}
                    >
                       {avatarPreview || channel?.avatar ? (
                         <img src={avatarPreview || channel?.avatar} className="w-full h-full object-cover" /> 
                       ) : (
                         <div className="text-center">
                           <ImageIcon className={`w-6 h-6 mx-auto mb-1 ${isDragging.editAvatar ? 'text-brand-indigo' : 'text-muted'}`} />
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted">Avatar</span>
                         </div>
                       )}
                       <input type="file" hidden ref={avatarRef} accept="image/*" onChange={(e) => {
                          const file=e.target.files[0];
                          if(file) { setUpdateForm({...updateForm, avatar:file}); setAvatarPreview(URL.createObjectURL(file)); }
                        }} />
                    </div>

                    {/* Edit Banner */}
                    <div 
                      onClick={() => bannerRef.current.click()} 
                      onDragOver={(e) => { prevent(e); setDrag('editBanner', true); }}
                      onDragLeave={() => setDrag('editBanner', false)}
                      onDrop={(e) => handleDropFile(e, 'editBanner', (file) => {
                        setUpdateForm({...updateForm, banner:file}); 
                        setBannerPreview(URL.createObjectURL(file));
                      })}
                      className={`group aspect-video rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center
                        ${isDragging.editBanner ? 'border-brand-indigo bg-brand-indigo/10 scale-105' : 'border-main bg-surface-low'}
                      `}
                    >
                       {bannerPreview || channel?.banner ? (
                         <img src={bannerPreview || channel?.banner} className="w-full h-full object-cover" /> 
                       ) : (
                         <div className="text-center">
                            <ImageIcon className={`w-6 h-6 mx-auto mb-1 ${isDragging.editBanner ? 'text-brand-indigo' : 'text-muted'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Banner</span>
                         </div>
                       )}
                       <input type="file" hidden ref={bannerRef} accept="image/*" onChange={(e) => {
                          const file=e.target.files[0];
                          if(file) { setUpdateForm({...updateForm, banner:file}); setBannerPreview(URL.createObjectURL(file)); }
                        }} />
                    </div>
                 </div>
              </div>

              <div className="pt-4">
                <Button variant="brand" onClick={handleUpdate} className="w-full py-5">
                   Confirm ID Updates
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= UPLOAD MODAL (REDESIGNED) ================= */}
      <AnimatePresence>
        {showUpload && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass-heavy border border-white/10 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] w-full max-w-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-main">
                <h2 className="text-2xl font-display font-black text-main uppercase italic">Broadcast New Signal</h2>
                <button onClick={() => {setShowUpload(false); setUploadProgress(0);}} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    {/* Upload Video Signal */}
                    <div
                      onClick={() => !uploadProgress && fileRef.current.click()}
                      onDragOver={(e) => { prevent(e); !uploadProgress && setDrag('uploadVideo', true); }}
                      onDragLeave={() => setDrag('uploadVideo', false)}
                      onDrop={(e) => !uploadProgress && handleDropFile(e, 'uploadVideo', (file) => {
                        setVideoForm({...videoForm, video: file});
                      })}
                      className={`aspect-square border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all p-6 text-center
                        ${videoForm.video ? 'border-brand-emerald/50 bg-brand-emerald/5' : isDragging.uploadVideo ? 'border-brand-indigo bg-brand-indigo/10 scale-105' : 'border-main bg-surface-low hover:border-brand-indigo'}
                      `}
                    >
                      {videoForm.video ? <CheckCircle2 className="w-12 h-12 text-brand-emerald mb-3 ai-glow-emerald" /> : <UploadCloud className={`w-12 h-12 mb-3 ${isDragging.uploadVideo ? 'text-brand-indigo' : 'text-brand-indigo'}`} />}
                      <p className="text-xs font-black uppercase text-main truncate max-w-full px-2">{videoForm.video ? videoForm.video.name : "Transmit Signal"}</p>
                      <input type="file" hidden ref={fileRef} accept="video/*" onChange={(e) => setVideoForm({...videoForm, video: e.target.files[0]})} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Input label="Title" value={videoForm.title} onChange={(e) => setVideoForm({...videoForm, title: e.target.value})} />
                    
                    {/* Thumbnail Drag & Drop */}
                    <div 
                      onClick={() => !uploadProgress && thumbRef.current.click()}
                      onDragOver={(e) => { prevent(e); !uploadProgress && setDrag('uploadThumb', true); }}
                      onDragLeave={() => setDrag('uploadThumb', false)}
                      onDrop={(e) => !uploadProgress && handleDropFile(e, 'uploadThumb', (file) => {
                        setVideoForm({...videoForm, thumbnail:file}); 
                        setThumbnailPreview(URL.createObjectURL(file));
                      })}
                      className={`h-10 border border-dashed rounded-xl flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer
                        ${thumbnailPreview ? 'border-brand-emerald/30 text-brand-emerald' : isDragging.uploadThumb ? 'border-brand-indigo bg-brand-indigo/10 scale-105 text-brand-indigo' : 'border-main text-muted hover:border-brand-indigo'}
                      `}
                    >
                       {thumbnailPreview ? "Thumbnail Selected" : isDragging.uploadThumb ? "Drop Now" : "Upload Thumbnail"}
                       <input type="file" hidden ref={thumbRef} accept="image/*" onChange={(e) => {
                          const file=e.target.files[0];
                          if(file) { setVideoForm({...videoForm, thumbnail:file}); setThumbnailPreview(URL.createObjectURL(file)); }
                        }} />
                    </div>

                    <textarea 
                      placeholder="Signal description..."
                      value={videoForm.description}
                      onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-surface-low border border-main text-xs font-bold outline-none focus:ring-2 focus:ring-brand-indigo/50 h-24 resize-none"
                    />
                 </div>
              </div>

              {uploadProgress > 0 && (
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase text-brand-indigo">
                     <span>Broadcasting signal...</span>
                     <span>{uploadProgress}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-main rounded-full overflow-hidden shadow-inner">
                      <motion.div animate={{ width: `${uploadProgress}%` }} className="h-full bg-gradient-to-r from-brand-indigo to-brand-purple ai-glow-indigo shadow-lg" />
                   </div>
                </div>
              )}

              <div className="pt-4">
                 <Button variant="brand" className="w-full py-5" onClick={handleUpload} disabled={uploadProgress > 0}>
                   {uploadProgress > 0 ? "Archiving Signal..." : "Publish Broadcast"}
                 </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
