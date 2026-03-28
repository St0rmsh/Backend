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
      const res = await getAllVideos();
      setVideos(res.data.videos || []);
      setLoading(false);
    };

    fetch();
  }, []);

 return (

  
  <div className="px-2 md:px-6">

    <div className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      lg:grid-cols-4 
      xl:grid-cols-5 
      gap-x-5 gap-y-8
    ">

      {loading
        ? Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)
        : videos.map((v) => <VideoCard key={v._id} video={v} />)
      }

    </div>

  </div>
);

};

export default Home;
