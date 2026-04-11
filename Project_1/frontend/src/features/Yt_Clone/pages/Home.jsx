import { useEffect, useState } from "react";
import { getAllVideos } from "../services/ytapi.service";
import VideoCard from "../components/video/VideoCard";
import SkeletonCard from "../components/video/SkeletonCard";
import { motion } from "framer-motion";

const Home = () => {
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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6">
      
      {/* ===== VIDEOS GRID (3 Columns requested) ===== */}
      <div
        className="
        grid 
        gap-x-8 gap-y-12
        grid-cols-1 
        sm:grid-cols-2 
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

      {/* FOOTER */}
      <div className="mt-20 border-t border-main pt-12 text-center pb-12">
         <p className="text-main font-bold opacity-30 text-sm italic tracking-widest uppercase">
           AI Verified Content Network
         </p>
      </div>

    </div>
  );
};

export default Home;
