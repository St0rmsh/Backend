import { useEffect, useState } from "react";
import { getAllVideos } from "../services/ytapi.service";
import VideoCard from "../components/video/VideoCard";
import SkeletonCard from "../components/video/SkeletonCard";

const Home = () => {
  const categories = ["All", "AI", "Music", "Coding", "Podcasts", "Startups"];

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllVideos();
        setVideos(res.data.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-6">

      {/* ===== CATEGORY BAR (OPTIONAL YT STYLE) ===== */}
      <div className="flex gap-3 overflow-x-auto mb-6 scrollbar-hide">
        
      </div>

      {/* ===== VIDEOS GRID (FIXED) ===== */}
      <div
        className="
        grid 
        gap-x-6 gap-y-10

        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-3 
        xl:grid-cols-3
      "
      >
        {loading
          ? Array(9)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          : videos.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
      </div>

    </div>
  );
};

export default Home;
