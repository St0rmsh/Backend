import { useEffect, useState, useRef } from "react";
import {
    UploadCloud,
    BarChart3,
    X,
    Image as ImageIcon,
    CheckCircle2,
    Video,
    Sparkles,
    Users,
    Eye,
    TrendingUp,
    Settings,
    ShieldCheck,
    Edit,
    Trash2,
    MoreVertical,
    BarChart,
    Search,
    Clock,
    Signal,
    Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
    CartesianGrid,
    Cell
} from "recharts";
import { toast } from "react-hot-toast";

import {
    getMyVideos,
    getMyChannel,
    updateChannel,
    uploadVideo,
    createChannel,
    getStudioStats,
    deleteVideo,
    updateVideo
} from "../services/ytapi.service";

import { Card, CardContent, Button, Input } from "../components/UI/Index";
import TrustMeter from "../components/UI/TrustMeter";

const FALLBACK_AVATAR = "https://ui-avatars.com/api/?name=User&background=random";
const FALLBACK_BANNER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop";

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [channel, setChannel] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showUpload, setShowUpload] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showEditVideo, setShowEditVideo] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Refs
    const fileRef = useRef(null);
    const thumbRef = useRef(null);
    const avatarRef = useRef(null);
    const bannerRef = useRef(null);

    // Forms
    const [videoForm, setVideoForm] = useState({ title: "", description: "", video: null, thumbnail: null });
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [editVideoForm, setEditVideoForm] = useState({ title: "", description: "", visibility: "public", isPublished: true, thumbnail: null });
    const [editThumbnailPreview, setEditThumbnailPreview] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    
    const [channelForm, setChannelForm] = useState({ name: "", description: "", avatar: null, banner: null });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    const [createForm, setCreateForm] = useState({ name: "", handle: "", description: "", avatar: null, banner: null });
    const [dragging, setDragging] = useState(null); // 'video', 'thumb', 'avatar', 'banner'

    const handleDrag = (e, zone) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragover') setDragging(zone);
        else setDragging(null);
    };

    const handleDrop = (e, zone, callback) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(null);
        const file = e.dataTransfer.files[0];
        if (file) callback(file);
    };

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [vRes, cRes, sRes] = await Promise.all([
                getMyVideos(),
                getMyChannel(),
                getStudioStats().catch(() => ({ data: { stats: null } }))
            ]);

            setVideos(vRes.data.videos || []);
            setChannel(cRes.data.channel || null);
            setStats(sRes.data.stats || null);

            if (cRes.data.channel) {
                setChannelForm({
                    name: cRes.data.channel.name || "",
                    description: cRes.data.channel.description || "",
                    avatar: null,
                    banner: null
                });
            }
        } catch (err) {
            console.error("Dashboard load error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Analytics Processing
    const retentionData = stats?.retentionCurve?.map((val, i) => ({
        bucket: `${i * 5}%`,
        value: val
    })) || [];

    // Handlers
    const handleUpload = async () => {
        if (!videoForm.title || !videoForm.video) return toast.error("Title and Video required");
        
        const tid = toast.loading("Archiving signal...");
        try {
            const fd = new FormData();
            Object.entries(videoForm).forEach(([k, v]) => v && fd.append(k, v));
            
            await uploadVideo(fd, {
                onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total))
            });

            toast.success("Broadcast successful", { id: tid });
            setShowUpload(false);
            setVideoForm({ title: "", description: "", video: null, thumbnail: null });
            setThumbnailPreview(null);
            setUploadProgress(0);
            loadAllData();
        } catch (err) {
            toast.error("Transmission failed", { id: tid });
            setUploadProgress(0);
        }
    };

    const handleUpdateChannel = async () => {
        const tid = toast.loading("Updating station ID...");
        try {
            const fd = new FormData();
            Object.entries(channelForm).forEach(([k, v]) => v && fd.append(k, v));
            await updateChannel(fd);
            toast.success("Station updated", { id: tid });
            setShowEdit(false);
            loadAllData();
        } catch (err) {
            toast.error("Update failed", { id: tid });
        }
    };

    const handleDeleteVideo = async (id) => {
        const tid = toast.loading("Purging signal...");
        try {
            await deleteVideo(id);
            toast.success("Signal purged", { id: tid });
            setShowEditVideo(null);
            setConfirmDelete(false);
            loadAllData();
        } catch (err) {
            toast.error("Purge failed", { id: tid });
        }
    };

    const handleEditVideo = async () => {
        const tid = toast.loading("Updating metadata...");
        try {
            const fd = new FormData();
            Object.entries(editVideoForm).forEach(([k, v]) => {
                if (v !== null && v !== undefined) fd.append(k, v);
            });
            await updateVideo(showEditVideo._id, fd);
            toast.success("Metadata synced", { id: tid });
            setShowEditVideo(null);
            setEditThumbnailPreview(null);
            loadAllData();
        } catch (err) {
            toast.error("Sync failed", { id: tid });
        }
    };

    if (loading) return <div className="min-h-screen bg-main flex items-center justify-center font-black uppercase text-xs tracking-widest text-muted">Synchronizing...</div>;

    // ONBOARDING
    if (!channel) {
        return (
            <div className="min-h-screen bg-main flex flex-col items-center justify-center p-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full text-center space-y-8">
                    <div className="w-20 h-20 bg-brand-orange/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-brand-orange overflow-hidden border-2 border-brand-orange/20">
                        {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" /> : <Signal size={40} />}
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-6xl font-display font-black tracking-tighter uppercase italic leading-[0.8] text-main">
                            Launch Your <span className="text-brand-orange">Signal.</span>
                        </h1>
                        <p className="text-muted font-bold italic text-sm pr-4">Establish your station ID to begin broadcasting neural content.</p>
                    </div>
                    
                    <Card className="p-8 space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input 
                                    label="Station Name" 
                                    placeholder="The Morning Feed" 
                                    value={createForm.name} 
                                    onChange={e => setCreateForm({...createForm, name: e.target.value})} 
                                />
                            </div>
                            <div className="flex-1">
                                <Input 
                                    label="Station Handle" 
                                    placeholder="@handle" 
                                    value={createForm.handle} 
                                    onChange={e => setCreateForm({...createForm, handle: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => avatarRef.current.click()}
                                onDragOver={e => handleDrag(e, 'avatar')}
                                onDragLeave={e => handleDrag(e, null)}
                                onDrop={e => handleDrop(e, 'avatar', f => { setCreateForm({...createForm, avatar: f}); setAvatarPreview(URL.createObjectURL(f)); })}
                                className={`p-4 rounded-2xl border transition-all text-left group
                                    ${dragging === 'avatar' ? 'border-brand-orange bg-brand-orange/10 scale-[0.98]' : 'bg-surface-low border-black/5 hover:border-brand-orange/30'}
                                `}
                            >
                                <label className="text-[9px] font-black uppercase text-muted group-hover:text-brand-orange block mb-1">Station Icon</label>
                                <div className="flex items-center gap-2">
                                    <ImageIcon size={14} className="text-muted" />
                                    <span className="text-[10px] font-bold text-main truncate">{createForm.avatar ? createForm.avatar.name : dragging === 'avatar' ? "Release Image" : "Select Image"}</span>
                                </div>
                            </button>
                            <button 
                                onClick={() => bannerRef.current.click()}
                                onDragOver={e => handleDrag(e, 'banner')}
                                onDragLeave={e => handleDrag(e, null)}
                                onDrop={e => handleDrop(e, 'banner', f => setCreateForm({...createForm, banner: f}))}
                                className={`p-4 rounded-2xl border transition-all text-left group
                                    ${dragging === 'banner' ? 'border-brand-earth bg-brand-earth/10 scale-[0.98]' : 'bg-surface-low border-black/5 hover:border-brand-earth/30'}
                                `}
                            >
                                <label className="text-[9px] font-black uppercase text-muted group-hover:text-brand-earth block mb-1">Signal Banner</label>
                                <div className="flex items-center gap-2">
                                    <ImageIcon size={14} className="text-muted" />
                                    <span className="text-[10px] font-bold text-main truncate">{createForm.banner ? createForm.banner.name : dragging === 'banner' ? "Release Image" : "Select Image"}</span>
                                </div>
                            </button>
                        </div>

                        <input type="file" hidden ref={avatarRef} accept="image/*" onChange={e => {
                            const f = e.target.files[0];
                            if(f) { setCreateForm({...createForm, avatar: f}); setAvatarPreview(URL.createObjectURL(f)); }
                        }} />
                        <input type="file" hidden ref={bannerRef} accept="image/*" onChange={e => {
                            const f = e.target.files[0];
                            if(f) { setCreateForm({...createForm, banner: f}); }
                        }} />

                        <Button variant="brand" className="w-full py-5 uppercase text-base font-black tracking-widest shadow-2xl" onClick={async () => {
                            if(!createForm.name || !createForm.handle) return toast.error("Name and Handle required");
                            const tid = toast.loading("Initializing Station...");
                            try {
                                const fd = new FormData();
                                Object.entries(createForm).forEach(([k,v]) => v && fd.append(k,v));
                                await createChannel(fd);
                                toast.success("Station Online", { id: tid });
                                setAvatarPreview(null);
                                loadAllData();
                            } catch(e) { toast.error("Initialization Failed", { id: tid }); }
                        }}>
                            Initialize Signal
                        </Button>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-12">
            
            {/* TOP BAR / NAVIGATION */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-4 border-black pb-8 gap-6 relative group/header">
                {/* SUBTLE BANNER EFFECT */}
                {channel?.banner && (
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10 bg-center bg-cover transition-opacity group-hover/header:opacity-[0.05]" style={{backgroundImage: `url(${channel.banner})`}} />
                )}
                
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[2rem] bg-black flex items-center justify-center text-white overflow-hidden border-2 border-black/5 shadow-2xl">
                            {channel?.avatar ? (
                                <img src={channel.avatar} className="w-full h-full object-cover" />
                            ) : (
                                <BarChart3 size={32} />
                            )}
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="text-3xl sm:text-5xl font-display font-black uppercase italic tracking-tighter leading-none">{channel?.name || "Studio"}</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Active Node: {channel?.handle || "UNLISTED"}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                    <Button variant="ghost" className="flex-1 sm:flex-none justify-center" onClick={() => {
                        if (channel) {
                            setChannelForm({
                                name: channel.name || "",
                                description: channel.description || "",
                                avatar: null,
                                banner: null
                            });
                            setAvatarPreview(null);
                            setBannerPreview(null);
                        }
                        setShowEdit(true);
                    }}>
                        <Settings size={18} /> Edit Station
                    </Button>
                    <Button variant="brand" className="flex-1 sm:flex-none justify-center" onClick={() => setShowUpload(true)}>
                        <UploadCloud size={18} /> Publish Content
                    </Button>
                </div>
            </div>

            {/* QUICK STATS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: "Total Views", value: stats?.totalViews || 0, icon: Eye, color: "orange" },
                    { label: "Watch (Hrs)", value: stats?.watchTimeHours || 0, icon: Clock, color: "earth" },
                    { label: "Subscribers", value: stats?.subscribers || 0, icon: Users, color: "green" },
                    { label: "Trust Score", value: `${stats?.avgTrustScore || 0}%`, icon: ShieldCheck, color: "orange" },
                ].map((s, i) => (
                    <Card key={i} className="bg-surface border-none shadow-none group">
                        <CardContent className="p-5 sm:p-6 flex justify-between items-center">
                            <div>
                                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted mb-1">{s.label}</p>
                                <p className="text-3xl sm:text-4xl font-display font-black text-main">{s.value}</p>
                            </div>
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-${s.color}/10 text-brand-${s.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <s.icon size={20} className="sm:w-6 sm:h-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ANALYTICS & HIGHLIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Retention Bar Chart */}
                <Card className="lg:col-span-2">
                    <CardContent className="p-8 space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-xl font-display font-black uppercase italic flex items-center gap-2">
                                    <TrendingUp className="text-brand-orange" size={20} /> Retention Analysis
                                </h3>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Audience drop-off across all signals</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="bg-brand-orange text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">Real-Time</span>
                            </div>
                        </div>

                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={retentionData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis 
                                        dataKey="bucket" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 9, fontWeight: 900, fill: '#666', uppercase: true}} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 9, fontWeight: 900, fill: '#666'}} 
                                    />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255, 77, 0, 0.05)'}}
                                        contentStyle={{borderRadius: '1rem', border: '2px solid black', fontWeight: 900}}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {retentionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index < 5 ? 'var(--color-brand-orange)' : 'var(--color-brand-tan)'} />
                                        ))}
                                    </Bar>
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Insight */}
                <div className="space-y-6">
                    <Card className="bg-black text-white p-8 space-y-4">
                        <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="text-2xl font-display font-black uppercase italic leading-none">Smart <br /> Algorithms</h3>
                        <p className="text-xs font-bold text-white/60 leading-relaxed italic">
                            Your content trust index is <span className="text-brand-orange">+{stats?.avgTrustScore || 0}%</span> higher than average. 
                            AI Verification is active on all nodes.
                        </p>
                    </Card>
                    <TrustMeter score={(stats?.avgTrustScore || 0) / 100} />
                </div>
            </div>

            {/* VIDEO MANAGEMENT SECTION */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <h3 className="text-2xl sm:text-3xl font-display font-black uppercase italic tracking-tight">Signal Management</h3>
                    <div className="relative w-full md:w-auto">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input 
                            placeholder="SEARCH ARCHIVES..." 
                            className="w-full bg-surface-low border border-main rounded-xl pl-10 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-orange/20 outline-none"
                        />
                    </div>
                </div>

                <div className="border-t-2 border-black">
                    {/* DESKTOP TABLE */}
                    <table className="w-full text-left hidden md:table">
                        <thead>
                            <tr className="border-b border-main text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                                <th className="py-6 px-4">Signal</th>
                                <th className="py-6 px-4">Visibility</th>
                                <th className="py-6 px-4">Performance</th>
                                <th className="py-6 px-4">Status</th>
                                <th className="py-6 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-main/50">
                            {videos.map(v => (
                                <tr key={v._id} className="group hover:bg-surface transition-colors">
                                    <td className="py-5 px-4 min-w-[300px]">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-24 aspect-video rounded-xl bg-surface-low border border-main overflow-hidden shrink-0 relative">
                                                <img src={v.thumbnail} className="w-full h-full object-cover" />
                                                <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-orange/20">
                                                    <div className="h-full bg-brand-orange" style={{width: `${Math.round(v.trustScore || 0)}%`}} />
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-main truncate group-hover:text-brand-orange transition-colors">{v.title}</p>
                                                <p className="text-[10px] font-bold text-muted truncate uppercase tracking-tighter mt-1">Archived {new Date(v.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${v.visibility === 'public' ? 'bg-brand-green' : 'bg-brand-tan'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{v.visibility}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 text-[10px] font-black">
                                                <span className="flex items-center gap-1.5"><Eye size={12} className="text-muted" /> {v.views}</span>
                                                <span className="flex items-center gap-1.5"><Signal size={12} className="text-muted" /> {Math.round(v.trustScore || 0)}%</span>
                                            </div>
                                            <div className="h-1 w-24 bg-main rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-orange" style={{width: `${Math.min(100, (v.views / 1000) * 100)}%`}} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4">
                                        {v.status === "PROCESSING" ? (
                                            <span className="bg-brand-orange/10 text-brand-orange text-[9px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse">Verifying</span>
                                        ) : v.isPublished ? (
                                            <span className="bg-brand-green/10 text-brand-green text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Broadcast Live</span>
                                        ) : (
                                            <span className="bg-brand-tan/10 text-brand-tan text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Drafted</span>
                                        )}
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => {
                                                setShowEditVideo(v);
                                                setEditThumbnailPreview(v.thumbnail);
                                                setEditVideoForm({
                                                    title: v.title,
                                                    description: v.description,
                                                    visibility: v.visibility,
                                                    isPublished: v.isPublished,
                                                    thumbnail: null
                                                });
                                            }} className="p-2 hover:bg-black hover:text-white rounded-lg transition-colors"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteVideo(v._id)} className="p-2 hover:bg-brand-red hover:text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* MOBILE CARD LIST */}
                    <div className="md:hidden divide-y divide-main/20">
                         {videos.map((v) => (
                             <div key={v._id} className="py-6 space-y-4">
                                 <div className="flex gap-4">
                                     <div className="w-24 h-14 bg-surface-low rounded-xl overflow-hidden shrink-0 border border-main/10 relative">
                                         {v.thumbnail && <img src={v.thumbnail} className="w-full h-full object-cover" />}
                                         <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-orange/20">
                                            <div className="h-full bg-brand-orange" style={{width: `${Math.round(v.trustScore || 0)}%`}} />
                                         </div>
                                     </div>
                                     <div className="min-w-0 flex-1">
                                         <p className="font-display font-black text-sm text-main line-clamp-2 leading-tight">{v.title}</p>
                                         <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1.5 border border-main rounded-full px-2 py-0.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${v.visibility === 'public' ? 'bg-brand-green' : 'bg-brand-tan'}`} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">{v.visibility}</span>
                                            </div>
                                            {v.status === "PROCESSING" ? (
                                                <span className="text-brand-orange text-[8px] font-black uppercase tracking-widest animate-pulse">Verifying</span>
                                            ) : v.isPublished ? (
                                                <span className="text-brand-green text-[8px] font-black uppercase tracking-widest">Live</span>
                                            ) : (
                                                <span className="text-brand-tan text-[8px] font-black uppercase tracking-widest">Draft</span>
                                            )}
                                         </div>
                                     </div>
                                 </div>

                                 <div className="flex items-center justify-between pt-2">
                                     <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter text-muted">
                                         <span className="flex items-center gap-1.5"><Eye size={12} /> {v.views}</span>
                                         <span className="flex items-center gap-1.5"><Signal size={12} /> {Math.round(v.trustScore || 0)}%</span>
                                     </div>
                                     <div className="flex gap-2">
                                            <button onClick={() => {
                                                setShowEditVideo(v);
                                                setEditThumbnailPreview(v.thumbnail);
                                                setEditVideoForm({
                                                    title: v.title,
                                                    description: v.description,
                                                    visibility: v.visibility,
                                                    isPublished: v.isPublished,
                                                    thumbnail: null
                                                });
                                            }} className="p-2.5 bg-stitch-grey rounded-xl text-main active:scale-95 transition-all"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteVideo(v._id)} className="p-2.5 bg-brand-red/5 text-brand-red rounded-xl active:scale-95 transition-all"><Trash2 size={16} /></button>
                                     </div>
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            
            {/* 1. Upload Modal (SIGNAL GATEWAY) */}
            <AnimatePresence>
                {showUpload && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUpload(false)} className="absolute inset-0 bg-black/80 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative bg-white border border-black/10 rounded-[2rem] sm:rounded-[3rem] w-full max-w-5xl p-6 sm:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] max-h-[90vh] overflow-y-auto no-scrollbar">
                            <div className="flex justify-between items-center mb-6 sm:mb-8">
                                <div className="space-y-0.5">
                                    <h2 className="text-2xl sm:text-4xl font-display font-black uppercase italic tracking-tighter leading-none">Signal Gateway</h2>
                                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted">Prepare neural broadcast to network</p>
                                </div>
                                <button onClick={() => setShowUpload(false)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all"><X size={18} /></button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                                <div className="space-y-6">
                                    {/* VIDEO RECEIVER */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Aural/Visual Source</label>
                                        <div 
                                            onClick={() => fileRef.current.click()}
                                            onDragOver={e => handleDrag(e, 'video')}
                                            onDragLeave={e => handleDrag(e, null)}
                                            onDrop={e => handleDrop(e, 'video', f => setVideoForm({...videoForm, video: f}))}
                                            className={`group/drop aspect-video border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all p-8 text-center relative overflow-hidden
                                                ${videoForm.video ? 'border-brand-green bg-brand-green/5' : dragging === 'video' ? 'border-brand-orange bg-brand-orange/10 scale-[0.98]' : 'border-black/10 hover:border-brand-orange bg-surface-low'}
                                            `}
                                        >
                                            <div className="relative z-10 flex flex-col items-center">
                                                {videoForm.video ? <div className="w-16 h-16 bg-brand-green/20 rounded-3xl flex items-center justify-center text-brand-green mb-4"><Play size={32} /></div> : <div className="w-16 h-16 bg-brand-orange/10 rounded-3xl flex items-center justify-center text-brand-orange mb-4 group-hover/drop:scale-110 transition-transform"><UploadCloud size={32} /></div>}
                                                <p className="text-[10px] font-black uppercase tracking-widest max-w-[200px] truncate">{videoForm.video ? videoForm.video.name : dragging === 'video' ? "Release to Inject" : "Inject Raw Signal Data"}</p>
                                                {!videoForm.video && <p className="text-[9px] font-bold text-muted mt-2 uppercase">MP4, HLS or High-Def MP4</p>}
                                            </div>
                                            {!videoForm.video && <div className="absolute inset-0 bg-brand-orange/5 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />}
                                            <input type="file" hidden ref={fileRef} accept="video/*" onChange={e => setVideoForm({...videoForm, video: e.target.files[0]})} />
                                        </div>
                                    </div>

                                    {/* THUMBNAIL RECEIVER */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Identification Art (Thumbnail)</label>
                                        <div 
                                            onClick={() => thumbRef.current.click()}
                                            onDragOver={e => handleDrag(e, 'thumb')}
                                            onDragLeave={e => handleDrag(e, null)}
                                            onDrop={e => handleDrop(e, 'thumb', f => { setVideoForm({...videoForm, thumbnail: f}); setThumbnailPreview(URL.createObjectURL(f)); })}
                                            className={`aspect-video border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
                                                ${thumbnailPreview ? 'border-brand-green' : dragging === 'thumb' ? 'border-brand-orange bg-brand-orange/10 scale-[0.98]' : 'border-black/10 hover:border-brand-orange bg-surface-low'}
                                            `}
                                        >
                                            {thumbnailPreview ? (
                                                <img src={thumbnailPreview} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
                                            ) : (
                                                <div className="text-center font-black text-[9px] uppercase space-y-3 opacity-40">
                                                    <ImageIcon size={32} className="mx-auto" /> 
                                                    <span className="tracking-widest">{dragging === 'thumb' ? "Release Identification" : "Generate Frame ID"}</span>
                                                </div>
                                            )}
                                            <input type="file" hidden ref={thumbRef} accept="image/*" onChange={e => {
                                                const file = e.target.files[0];
                                                if(file) { setVideoForm({...videoForm, thumbnail: file}); setThumbnailPreview(URL.createObjectURL(file)); }
                                            }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <div className="space-y-6 flex-1">
                                        <Input label="Broadcast Title" placeholder="What is the core message?" value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} />
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Signal Intelligence Notes</label>
                                                <span className="text-[9px] font-black text-muted opacity-50">{videoForm.description.length}/1000</span>
                                            </div>
                                            <textarea 
                                                value={videoForm.description} 
                                                onChange={e => setVideoForm({...videoForm, description: e.target.value})}
                                                placeholder="Provide deep context for the AI audit..."
                                                className="w-full h-32 bg-surface-low border border-black/10 rounded-[2rem] p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-brand-orange/10 transition-all resize-none placeholder:italic placeholder:font-normal"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-black/5">
                                        {uploadProgress > 0 ? (
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" /> Synchronizing Signal</span>
                                                    <span>{uploadProgress}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${uploadProgress}%` }}
                                                        className="h-full bg-brand-orange shadow-[0_0_15px_rgba(255,77,0,0.5)]" 
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <Button variant="brand" className="w-full py-6 text-base shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99]" onClick={handleUpload}>
                                                Initiate Network Broadcast
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 2. Edit Video Modal */}
            <AnimatePresence>
                {showEditVideo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowEditVideo(null); setConfirmDelete(false); }} className="absolute inset-0 bg-black/80 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative bg-white border border-black/10 rounded-[2.5rem] sm:rounded-[3.5rem] w-full max-w-xl p-6 sm:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-6 sm:space-y-10 max-h-[90vh] overflow-y-auto no-scrollbar overflow-x-hidden">
                             {/* DECORATIVE TERMINAL HEADER */}
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-brand-red" />
                             
                             <div className="flex justify-between items-center mb-6">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter">Metadata Editor</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">Update broadcast telemetry</p>
                                </div>
                                <button onClick={() => { setShowEditVideo(null); setConfirmDelete(false); }} className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all"><X size={20} /></button>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Input label="Signal Title" value={editVideoForm.title} onChange={e => setEditVideoForm({...editVideoForm, title: e.target.value})} />
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted">Signal Briefing</label>
                                            <textarea 
                                                value={editVideoForm.description} 
                                                onChange={e => setEditVideoForm({...editVideoForm, description: e.target.value})}
                                                className="w-full h-32 bg-surface-low border border-black/5 rounded-[1.5rem] p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-brand-orange/10 transition-all resize-none"
                                                placeholder="Editorial notes for the AI auditor..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Broadcast Identification (Thumbnail)</label>
                                        <div 
                                            onClick={() => thumbRef.current.click()}
                                            onDragOver={e => handleDrag(e, 'thumb-edit')}
                                            onDragLeave={e => handleDrag(e, null)}
                                            onDrop={e => handleDrop(e, 'thumb-edit', f => { setEditVideoForm({...editVideoForm, thumbnail: f}); setEditThumbnailPreview(URL.createObjectURL(f)); })}
                                            className={`aspect-video border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group/thumb
                                                ${dragging === 'thumb-edit' ? 'border-brand-orange bg-brand-orange/10 scale-[0.98]' : 'border-black/10 hover:border-brand-orange bg-surface-low'}
                                            `}
                                        >
                                            {editThumbnailPreview ? (
                                                <img src={editThumbnailPreview} className="w-full h-full object-cover transition-transform hover:scale-105" />
                                            ) : (
                                                <div className="text-center font-black text-[9px] uppercase space-y-2 opacity-40">
                                                    <ImageIcon size={24} className="mx-auto" /> 
                                                    <span>Missing Image Data</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-brand-orange/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                                <ImageIcon size={24} />
                                                <span className="text-[10px] font-black uppercase tracking-widest mt-2">{dragging === 'thumb-edit' ? "Release Replacement" : "Change Thumbnail"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* VISIBILITY */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Visibility</label>
                                        <div className="flex bg-surface-low p-1.5 rounded-[1.5rem] border border-black/5">
                                            {['public', 'unlisted', 'private'].map((v) => (
                                                <button
                                                    key={v}
                                                    onClick={() => setEditVideoForm({...editVideoForm, visibility: v})}
                                                    className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                                                        ${editVideoForm.visibility === v ? 'bg-black text-white shadow-xl scale-[1.05]' : 'text-muted hover:text-black'}
                                                    `}
                                                >
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Network Status</label>
                                        <div className="flex bg-surface-low p-1.5 rounded-[1.5rem] border border-black/5">
                                            {[
                                                { label: 'Live', value: true },
                                                { label: 'Draft', value: false }
                                            ].map((s) => (
                                                <button
                                                    key={s.label}
                                                    onClick={() => setEditVideoForm({...editVideoForm, isPublished: s.value})}
                                                    className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                                                        ${editVideoForm.isPublished === s.value 
                                                            ? (s.value ? 'bg-brand-green text-white shadow-lg scale-[1.05]' : 'bg-black text-white shadow-lg scale-[1.05]') 
                                                            : 'text-muted hover:text-black'
                                                        }
                                                    `}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 flex flex-col gap-4">
                                    <Button variant="brand" className="w-full py-5 text-base shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99]" onClick={handleEditVideo}>
                                        Sync Metadata to Network
                                    </Button>

                                    <div className="pt-6 mt-4 border-t border-black/5">
                                        {!confirmDelete ? (
                                            <button 
                                                onClick={() => setConfirmDelete(true)}
                                                className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-red/40 hover:text-brand-red transition-all"
                                            >
                                                Decommission Signal
                                            </button>
                                        ) : (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                className="space-y-5 p-6 bg-brand-red/5 border border-brand-red/10 rounded-[2rem] text-center"
                                            >
                                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-red">Confirm Permanent Signal Purge?</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button onClick={() => setConfirmDelete(false)} className="py-3 rounded-xl bg-white text-black border border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-all">Abort</button>
                                                    <button onClick={() => handleDeleteVideo(showEditVideo._id)} className="py-3 rounded-xl bg-brand-red text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 transition-all">Purge Signal</button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 3. Edit Station Modal (IDENTITY COMMAND) */}
            <AnimatePresence>
                {showEdit && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEdit(false)} className="absolute inset-0 bg-black/80 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative bg-white border border-black/10 rounded-[2.5rem] sm:rounded-[3.5rem] w-full max-w-2xl p-6 sm:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto no-scrollbar overflow-x-hidden">
                             {/* DECORATIVE ACCENT */}
                             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange via-brand-earth to-brand-green" />

                             <div className="flex justify-between items-center mb-10">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter">Identity Command</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">Update station broadcasting credentials</p>
                                </div>
                                <button onClick={() => setShowEdit(false)} className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all"><X size={20} /></button>
                            </div>

                            <div className="space-y-8">
                                {/* INTEGRATED PREVIEW */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Signal Branding Preview</label>
                                    <div className="relative aspect-[3/1] bg-surface-low rounded-3xl border border-black/5 overflow-hidden group/identity">
                                        <div 
                                            onClick={() => bannerRef.current.click()}
                                            onDragOver={e => handleDrag(e, 'banner-edit')}
                                            onDragLeave={e => handleDrag(e, null)}
                                            onDrop={e => handleDrop(e, 'banner-edit', f => { setChannelForm({...channelForm, banner: f}); setBannerPreview(URL.createObjectURL(f)); })}
                                            className={`absolute inset-0 cursor-pointer overflow-hidden transition-all
                                                ${dragging === 'banner-edit' ? 'ring-4 ring-inset ring-brand-earth/50 opacity-90 scale-[0.99]' : ''}
                                            `}
                                        >
                                            {bannerPreview || channel?.banner ? (
                                                <img src={bannerPreview || channel?.banner} className="w-full h-full object-cover brightness-90 group-hover/identity:scale-105 transition-transform duration-1000" />
                                            ) : (
                                                <div className="w-full h-full bg-black/5 flex items-center justify-center text-[9px] font-black uppercase opacity-20">No Banner Data</div>
                                            )}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/identity:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-black uppercase tracking-widest">Update Banner</div>
                                        </div>
                                        
                                        <div 
                                            onClick={() => avatarRef.current.click()}
                                            onDragOver={e => handleDrag(e, 'avatar-edit')}
                                            onDragLeave={e => handleDrag(e, null)}
                                            onDrop={e => handleDrop(e, 'avatar-edit', f => { setChannelForm({...channelForm, avatar: f}); setAvatarPreview(URL.createObjectURL(f)); })}
                                            className={`absolute -bottom-4 left-8 w-24 h-24 rounded-[2.2rem] border-4 border-white overflow-hidden shadow-2xl cursor-pointer group/avatar bg-stitch-grey transition-all
                                                ${dragging === 'avatar-edit' ? 'scale-90 ring-4 ring-brand-orange' : ''}
                                            `}
                                        >
                                            {avatarPreview || channel?.avatar ? (
                                                <img src={avatarPreview || channel?.avatar} className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-brand-orange/5 text-brand-orange">
                                                    <Camera size={24} className="mb-1" />
                                                    <span className="text-[7px] font-black uppercase">Identity</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-brand-orange/40 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center text-white">
                                                <ImageIcon size={20} className="mb-1" />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Update Icon</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-start pl-36 pt-2">
                                        <button 
                                            onClick={() => avatarRef.current.click()}
                                            className="flex items-center gap-2 px-4 py-2 bg-black/5 hover:bg-black hover:text-white rounded-full transition-all text-[9px] font-black uppercase tracking-widest group"
                                        >
                                            <Edit size={12} className="group-hover:rotate-12 transition-transform" />
                                            Change Station Icon
                                        </button>
                                    </div>
                                    <input type="file" hidden ref={avatarRef} accept="image/*" onChange={e => {
                                        const f = e.target.files[0];
                                        if(f) { setChannelForm({...channelForm, avatar: f}); setAvatarPreview(URL.createObjectURL(f)); }
                                    }} />
                                    <input type="file" hidden ref={bannerRef} accept="image/*" onChange={e => {
                                        const f = e.target.files[0];
                                        if(f) { setChannelForm({...channelForm, banner: f}); setBannerPreview(URL.createObjectURL(f)); }
                                    }} />
                                </div>

                                <div className="space-y-6">
                                    <Input label="Identity Name" value={channelForm.name} onChange={e => setChannelForm({...channelForm, name: e.target.value})} />
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Broadcast Mission Statement</label>
                                        <textarea 
                                            value={channelForm.description} 
                                            onChange={e => setChannelForm({...channelForm, description: e.target.value})}
                                            className="w-full h-28 bg-surface-low border border-black/10 rounded-[2rem] p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-brand-orange/10 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <Button variant="brand" className="w-full py-5 text-sm uppercase shadow-xl" onClick={handleUpdateChannel}>Sync Station ID Across Network</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Dashboard;
