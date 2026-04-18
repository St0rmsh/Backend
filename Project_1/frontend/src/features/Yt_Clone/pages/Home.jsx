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
    <div className="max-w-[2200px] mx-auto px-4 sm:px-10 lg:px-12 py-8 sm:py-12">
      
      {/* ===== VIDEOS GRID ===== */}
      <div
        className="
        grid 
        gap-x-6 gap-y-12
        sm:gap-x-8 sm:gap-y-16
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4
        2xl:grid-cols-5
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
      <div className="mt-32 border-t border-black/5 pt-16 text-center pb-16">
         <p className="text-[10px] font-black opacity-30 tracking-[0.4em] uppercase">
            Neural Content Verification Network &copy; 2026
         </p>
      </div>

    </div>
  );
};

export default Home;
