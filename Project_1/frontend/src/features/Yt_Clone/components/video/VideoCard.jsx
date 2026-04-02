import { Link } from "react-router-dom";
import { useRef, useState } from "react";


const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (let key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value >= 1) return `${value} ${key}${value > 1 ? "s" : ""} ago`;
  }

  return "just now";
};

const VideoCard = ({ video }) => {
  const channel = video.channel;

  

  return (
    <div className="w-full">

      <Link to={`/video/${video._id}`}>
        <img src={video.thumbnail} className="w-full h-48 object-cover rounded-xl" />
      </Link>

      <div className="flex mt-2 gap-2">
        <Link to={channel?.handle ? `/channel/${channel.handle}` : "#"}>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {channel?.name?.charAt(0)}
          </div>
        </Link>

        <div>
          <p className="font-semibold">{video.title}</p>
          <p className="text-sm text-gray-500">{channel?.name}</p>
          <p className="text-sm text-gray-500">
            {video.views} views • {formatTimeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
