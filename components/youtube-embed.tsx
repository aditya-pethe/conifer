import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

type YouTubeEmbedProps = {
  embedId: string;
  start:number;
};

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ embedId, start }) => {
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
    <div className="video-responsive flex justify-center border-2 border-gray-700">
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${embedId}`}
        playing={playing}
        width="853px"
        height="480px"
        controls={true}
        onReady={onReady}
      />
    </div>
  );
};

export default YouTubeEmbed;
