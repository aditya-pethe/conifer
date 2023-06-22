"use client";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import ChatUI from "@/components/chatbot-ui";
import YouTubeEmbed from "@/components/youtube-embed";
export default function Home() {

  const [videoTimestamp, setVideoTimestamp] = useState(0);

  const DynamicYouTubeEmbed = dynamic(
    () => import('../components/youtube-embed'),
    { ssr: false } // This line will disable server-side rendering for the component.
  );

  return (
  <main className="bg-black">
    <div className="min-h-screen flex flex-col items-center items-end justify-end">
      <DynamicYouTubeEmbed embedId="jSP-gSEyVeI" start={videoTimestamp} />
      <div className="h-[8rem]"/>
      <ChatUI setVideoTimestamp={setVideoTimestamp} />
    </div>
  </main>
  );
}
