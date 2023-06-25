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



export default function Home() {

  const startVideos = [
    "733m6qBH-jI" // andrew ng lecture - career focused
  ];
  
  // Fetch initial list of video IDs
  const userId = useUser().user?.id;
  const videoObj = useQuery(api.tables.listVideos, {user_id:userId!});
  const addUser = useMutation(api.tables.addUser); // replace 'createUser' with your actual mutation name

  
  const [videoTimestamp, setVideoTimestamp] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [addVideo, setAddVideo] = useState<string[]>([]);
  const [userQuery, setUserQuery] = useState('');

  console.log(videoObj)
  
  useEffect(() => {
    if (videoObj && videoObj.length > 0 && Array.isArray(videoObj[0].video_ids)) {
      const userVideoIds = videoObj[0].video_ids;
      const combinedVideos = [...startVideos, ...userVideoIds];
      setAddVideo(combinedVideos);
    } else if (!videoObj && userId) {
      addUser({ user_id: userId});
    }
  }, [videoObj, userId, addUser]);
  
  

  const DynamicYouTubeEmbed = dynamic(
    () => import('../components/youtube-embed'),
    { ssr: false } // This line will disable server-side rendering for the component.
  );

  return (
    <main className="bg-black">
      <div className="flex flex-row justify-between items-start w-full">
        <div className="w-1/4">
        <VideoSidebar videoIds={addVideo} onSelect={setVideoUrl} />
        </div>

        <div className="flex flex-col items-center justify-center w-1/2">
          <VideoInput setVideoUrl={setVideoUrl} setAddVideo={setAddVideo} addVideo={addVideo} />

          <div className="min-h-[480px] min-w-[853px] mt-[9rem] mb-[8rem]">
            <DynamicYouTubeEmbed embedUrl={videoUrl} start={videoTimestamp} />
          </div>

          <ChatUI setVideoTimestamp={setVideoTimestamp} setUserQuery={setUserQuery} videoUrl={videoUrl}/>
        </div>

        <div className=" w-1/4 max-h-[480px] bg-black text-white rounded-lg p-6 mt-[13.8rem]">
          <ChatOutput userQuery={userQuery}/>
        </div>
      </div>
    </main>
  );
}