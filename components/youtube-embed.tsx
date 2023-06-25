import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

type YouTubeEmbedProps = {
  embedUrl: string;
  start:number;
};

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ embedUrl, start }) => {
  const [isReady, setIsReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    setIsReady(false);
    setPlaying(false);
  }, [start]);

  const onReady = () => {
    if (!isReady && playerRef.current) {
      playerRef.current.seekTo(start, 'seconds');
      setIsReady(true);
      // Introduce a delay of 1 second before the video starts playing
      setTimeout(() => {
        setPlaying(true);
      }, 1000);
    }
  };

  return (
    <div className="video-responsive flex justify-center items-center border-2 border-gray-700 h-[480px] w-[853px]">
      <div className="flex justify-center items-center w-full h-full">
        {embedUrl ? (
          <ReactPlayer
            ref={playerRef}
            url={embedUrl}
            playing={playing}
            width="100%"
            height="100%"
            controls={true}
            onReady={onReady}
          />
        ) : (
          <div className="bg-black w-[50%] rounded-lg shadow-lg text-center">
            <p className="text-xl text-white">Welcome to conifer search! To get started, select a video and ask questions below</p>
          </div>        )}
      </div>
    </div>
  );
};

export default YouTubeEmbed;
