import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  getMyVideos,
  createChannel,
  getMyChannel
} from "../services/ytapi.service";

import { Card, CardContent, Button } from "../components/UI/Index";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [channel, setChannel] = useState(null);
  const [showChannelModal, setShowChannelModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    handle: "",
    description: ""
  });

  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    subscribers: 0,
    watchTime: 0
  });

  useEffect(() => {
    loadVideos();
    loadChannel();
  }, []);

  // 🔥 LOAD CHANNEL
  const loadChannel = async () => {
    try {
      const res = await getMyChannel();
      setChannel(res.data.channel);
    } catch {
      setChannel(null); // no channel yet
    }
  };

  // 🔥 LOAD VIDEOS
  const loadVideos = async () => {
    const res = await getMyVideos();
    const vids = res.data.videos || [];

    setVideos(vids);

    const views = vids.reduce((a, v) => a + (v.views || 0), 0);
    const likes = vids.reduce((a, v) => a + (v.likesCount || 0), 0);

    setStats({
      views,
      likes,
      subscribers: 0,
      watchTime: views * 2
    });
  };

  // 🔥 CREATE CHANNEL
  const handleCreateChannel = async () => {
    if (!form.name || !form.handle) {
      alert("Name and Handle required");
      return;
    }

    try {
      const res = await createChannel(form);
      setChannel(res.data.channel);
      setShowChannelModal(false);
    } catch (err) {
      console.error(err);
      alert("Channel creation failed");
    }
  };

  // 🔥 DELETE VIDEO
  const handleDelete = async (id) => {
    if (!confirm("Delete this video?")) return;
    await deleteVideo(id);
    loadVideos();
  };

  const chartData = videos.map((v, i) => ({
    name: `V${i + 1}`,
    views: v.views || 0
  }));

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 CHANNEL SECTION */}
      {!channel ? (
        <Card>
          <CardContent className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Create Your Channel</h2>
              <p className="text-sm text-gray-500">
                Start uploading videos like YouTube 🚀
              </p>
            </div>

            <Button
              className="bg-indigo-500 flex items-center gap-2"
              onClick={() => setShowChannelModal(true)}
            >
              <Plus size={16} /> Create Channel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{channel.name}</h2>
              <p className="text-sm text-gray-500">
                @{channel.handle}
              </p>
            </div>
            <span className="text-green-500 text-sm">Channel Active</span>
          </CardContent>
        </Card>
      )}

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Views", value: stats.views },
          { label: "Likes", value: stats.likes },
          { label: "Subscribers", value: stats.subscribers },
          { label: "Watch Time", value: stats.watchTime }
        ].map((item) => (
          <Card key={item.label}>
            <CardContent>
              <p className="text-gray-500 text-sm">{item.label}</p>
              <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔥 CHART */}
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

      {/* 🔥 VIDEOS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Videos</h2>

        <div className="space-y-4">
          {videos.map((v) => (
            <div
              key={v._id}
              className="flex items-center justify-between p-4 border rounded-xl"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={v.thumbnail}
                  className="w-32 h-20 object-cover rounded"
                />

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

                <Button
                  className="bg-red-500"
                  onClick={() => handleDelete(v._id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 CREATE CHANNEL MODAL */}
      {showChannelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

            <h2 className="text-lg font-semibold">Create Channel</h2>

            <input
              placeholder="Channel Name"
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Handle (unique)"
              className="w-full border p-2 rounded"
              value={form.handle}
              onChange={(e) =>
                setForm({ ...form, handle: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <Button
                className="bg-gray-300 text-black"
                onClick={() => setShowChannelModal(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-indigo-500"
                onClick={handleCreateChannel}
              >
                Create
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
