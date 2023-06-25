import React, { useEffect, useState } from 'react';
import Image from 'next/image'

type VideoThumbnailProps = {
  videoId: string;
  onDelete: (videoId: string) => void;
};

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ videoId, onDelete }) => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoChannel, setVideoChannel] = useState('');
  
  useEffect(() => {
    fetch(`/api/video_info?video_id=${videoId}`)
      .then(response => response.json())
      .then(video => {
        setVideoTitle(video.title);
        setVideoChannel(video.channelTitle);
      });
  }, [videoId]);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

  return (
    <div className="video-thumbnail relative flex items-center border-2 border-gray-700 hover:border-purple-500 transition-colors duration-200 rounded-md mx-auto w-full">
      <button onClick={() => onDelete(videoId)} className="absolute top-0 right-0 m-2 text-xl font-bold text-white hover:text-red-500 transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <Image
        src={thumbnailUrl}
        alt="Video thumbnail"
        width={256} // you may need to adjust these values depending on your layout
        height={144} // you may need to adjust these values depending on your layout
        className="mr-4 ml-4 rounded-md"
      />
      <div className="flex flex-col justify-between overflow-hidden h-32 w-64 mr-4">
        <h3 className="text-sm font-bold text-white overflow-ellipsis overflow-hidden">{videoTitle}</h3>
        <p className="text-xs text-gray-300 overflow-ellipsis whitespace-nowrap mt-[1em]">{videoChannel}</p>
      </div>
    </div>
  );
};

export default VideoThumbnail;
