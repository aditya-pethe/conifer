import React from 'react';

type VideoThumbnailProps = {
  videoId: string;
};

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ videoId }) => {
  // You can customize the thumbnail URL based on YouTube's URL structure
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

  return (
    <div className="video-thumbnail flex items-start border-2 border-purple-500 rounded-md mx-auto p-2">
      <img src={thumbnailUrl} alt="Video thumbnail" className="w-30 h-20 mr-4 rounded-md" />
      <div>
        <h3 className="text-sm font-bold text-purple-500">Video Title</h3> {/* Replace this with actual title */}
        <p className="text-xs text-gray-300">Video Description</p> {/* Replace this with actual description */}
      </div>
    </div>
  );
};

export default VideoThumbnail;
