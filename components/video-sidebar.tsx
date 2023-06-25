import React from 'react';
import { useUser } from "@clerk/clerk-react";
import VideoThumbnail from "./video-thumbnail";
import Thumbnail from "./video-thumbnail2"

interface VideoSidebarProps {
  videoIds: Array<string>; // received from parent component
  onSelect: (videoUrl: string) => void;
  onDelete: (videoId: string) => void;
};

const VideoSidebar: React.FC<VideoSidebarProps> = ({ videoIds, onSelect, onDelete }) => {  
  const { user } = useUser();
  // const user_id = user?.id;

  const getVideoUrl = (videoId: string): string => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  return (
    <div className="bg-black text-white p-4 mt-[11.5em] border-white text-center">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Videos</h1>
        <hr className="border-t border-white mt-2"/>
      </div>
      <div className="overflow-y-auto h-[70vh]">
        {videoIds.map((videoId) => (
          <button key={videoId} onClick={() => onSelect(getVideoUrl(videoId))} className="mb-4">
            <VideoThumbnail videoId={videoId} onDelete={onDelete}/>
            {/* <Thumbnail videoId={videoId}/> */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoSidebar;
