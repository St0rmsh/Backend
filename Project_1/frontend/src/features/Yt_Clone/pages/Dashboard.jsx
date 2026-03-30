import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getMyVideos } from "../services/ytapi.service";
import { Card, CardContent, Button } from "../components/UI/Index";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    subscribers: 0,
    watchTime: 0
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
  const res = await getMyVideos(); // 🔥 FIXED
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

      {/* STATS */}
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

      {/* VIDEOS */}
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
                  alt=""
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

    </div>
  );
};

export default Dashboard;
