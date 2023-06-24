"use client";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import ChatUI from "@/components/chatbot-ui";
import VideoInput from "@/components/video-input"
import ChatOutput from "@/components/chat-output";

export default function Home() {

  const startVideo = "https://www.youtube.com/watch?v=jSP-gSEyVeI"; // langchain tutorial - hardcoded for now
  const [videoTimestamp, setVideoTimestamp] = useState(0);
  const [videoUrl, setVideoUrl] = useState(startVideo);
  const [userQuery, setUserQuery] = useState("");

  const DynamicYouTubeEmbed = dynamic(
    () => import('../components/youtube-embed'),
    { ssr: false } // This line will disable server-side rendering for the component.
  );

  return (
    <main className="bg-black">
      <div className="flex flex-row justify-between items-start w-full">
        <div className="w-1/4">
          {/* Leftmost - empty for now */}
        </div>

        <div className="flex flex-col items-center justify-center w-1/2">
          <VideoInput setVideoUrl={setVideoUrl}/>

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