import Image from "next/image";
import Link from "next/link";
import ChatUI from "@/components/chatbot-ui";
import YouTubeEmbed
 from "@/components/youtube-embed";
export default function Home() {
  return (
  <main className="bg-black">
    <div className="min-h-screen flex flex-col items-center items-end justify-end">
      <YouTubeEmbed embedId="jSP-gSEyVeI" />
      <div className="h-[8rem]" />
      <ChatUI></ChatUI>
    </div>
  </main>
  );
}
