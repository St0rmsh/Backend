// 🔥 CLEAN UI COMPONENTS (NO SHADCN)

export const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow">
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="p-5">{children}</div>
);

export const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Input = (props) => (
  <input
    className="border px-3 py-2 rounded-lg w-full focus:outline-none"
    {...props}
  />
);


// ================= DASHBOARD =================

import { useEffect, useState } from "react";
import { Trash2, Pencil, Upload } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getAllVideos, deleteVideo } from "../services/ytapi.service";

export const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({ views: 0, likes: 0, subscribers: 0, watchTime: 0 });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const res = await getAllVideos();
    const vids = res.data.videos || [];
    setVideos(vids);

    const views = vids.reduce((a, v) => a + (v.views || 0), 0);
    const likes = vids.reduce((a, v) => a + (v.likesCount || 0), 0);

    setStats({ views, likes, subscribers: 0, watchTime: views * 2 });
  };

  const handleDelete = async (id) => {
    await deleteVideo(id);
    loadVideos();
  };

  const chartData = videos.map((v, i) => ({ name: `V${i + 1}`, views: v.views || 0 }));

  return (
    <div className="p-6 space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {["Views", "Likes", "Subscribers", "Watch Time"].map((label, i) => (
          <Card key={label}>
            <CardContent>
              <p className="text-gray-500 text-sm">{label}</p>
              <h2 className="text-2xl font-bold mt-2">
                {Object.values(stats)[i]}
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHART */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Views Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ACTIONS */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Videos</h2>
      </div>

      {/* VIDEO LIST */}
      <div className="space-y-4">
        {videos.map((v) => (
          <div key={v._id} className="flex items-center justify-between p-4 border rounded-xl">
            <div className="flex gap-4 items-center">
              <img src={v.thumbnail} className="w-32 h-20 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="text-sm text-gray-500">
                  {v.views} views • {v.likesCount} likes
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="bg-gray-200 text-black">
                <Pencil size={16} />
              </Button>
              <Button className="bg-red-500" onClick={() => handleDelete(v._id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};


// ================= UPLOAD PAGE =================

import { useState } from "react";
import { uploadVideo } from "../services/ytapi.service";

export const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    await uploadVideo(formData, {
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
      }
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">

      <h1 className="text-2xl font-bold">Upload Video</h1>

      {/* DRAG DROP */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFile(e.dataTransfer.files[0]);
        }}
        className="border-2 border-dashed p-10 text-center rounded-xl"
      >
        {file ? file.name : "Drag & Drop Video Here"}
      </div>

      <Input
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* PROGRESS */}
      {progress > 0 && (
        <div className="w-full bg-gray-200 h-2 rounded">
          <div className="bg-green-500 h-2" style={{ width: `${progress}%` }} />
        </div>
      )}

      <Button onClick={handleUpload}>Upload</Button>

    </div>
  );
};
