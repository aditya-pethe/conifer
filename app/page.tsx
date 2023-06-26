"use client";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useQuery, useMutation } from "convex/react";
import {api} from "../convex/_generated/api"
import { useUser } from "@clerk/clerk-react";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import ChatUI from "@/components/chatbot-ui";
import VideoInput from "@/components/video-input"
import ChatOutput from "@/components/chat-output";
import VideoSidebar from "@/components/video-sidebar";
import SignInPage from '@/components/signin';



export default function Home() {

  const { user } = useUser();

  const startVideos = [
    "SqcY0GlETPk", // mosh react tutorial - good search
    // "HtI9easWtAA", // pinecone lecture - topical
    // "733m6qBH-jI", // andrew ng lecture - career focused
    // "zeJD6dqJ5lo" // 3blue1brown
  ];
  
  // Fetch initial list of video IDs
  const userId = useUser().user?.id;
  const videoObj = useQuery(api.tables.listVideos, {user_id:userId!});
  const addUser = useMutation(api.tables.addUser); // replace 'createUser' with your actual mutation name
  const deleteVideo = useMutation(api.tables.deleteVideo);
  
  const [videoTimestamp, setVideoTimestamp] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [addVideo, setAddVideo] = useState<string[]>([]);
  const [userQuery, setUserQuery] = useState('');

  console.log(videoObj)
  
  useEffect(() => {
    if (videoObj && videoObj.length > 0 && Array.isArray(videoObj[0].video_ids)) {
      const userVideoIds = videoObj[0].video_ids;
      const combinedVideos = Array.from(new Set([...startVideos, ...userVideoIds]));
      setAddVideo(combinedVideos);
    } else if (!videoObj && userId) {
      addUser({ user_id: userId});
    }
  }, [videoObj, userId, addUser]);
  
  const onDelete = async (videoId: string) => {
    // Delete the video from the database
    await deleteVideo({ video_id: videoId, user_id: userId! });
    // Remove the videoId from local state
    setAddVideo(prevState => prevState.filter(id => id !== videoId));
    setVideoUrl("");
  };


  const DynamicYouTubeEmbed = dynamic(
    () => import('../components/youtube-embed'),
    { ssr: false } // This line will disable server-side rendering for the component.
  );

  return (
    <main className="bg-black">
      <div className="flex flex-row justify-between items-start w-full">
        <div className="w-1/4">
        <VideoSidebar videoIds={addVideo} onSelect={setVideoUrl} onDelete={onDelete}/>
        </div>

        <div className="flex flex-col items-center justify-center w-1/2">
          <VideoInput setVideoUrl={setVideoUrl} setAddVideo={setAddVideo} addVideo={addVideo} />

          <div className="min-h-[480px] min-w-[853px] mt-[9rem] mb-[8rem]">
            <DynamicYouTubeEmbed embedUrl={videoUrl} start={videoTimestamp} />
          </div>

          <ChatUI setVideoTimestamp={setVideoTimestamp} setUserQuery={setUserQuery} videoUrl={videoUrl}/>
        </div>

        <div className=" w-1/4 max-h-[480px] bg-black text-white rounded-lg p-6 mt-[11rem]">
          <ChatOutput userQuery={userQuery}/>
        </div>
      </div>
    </main>
  );
}