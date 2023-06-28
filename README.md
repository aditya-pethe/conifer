
<p align="center">
  <img width="500" alt="Screen Shot 2023-06-25 at 9 11 15 PM" src="https://github.com/aditya-pethe/conifer/assets/50645024/53720b0b-ffaf-41e1-a30c-75b3061a9f5e">
</p>

## About

Never 2x watch again!

Conifer is semantic search for youtube videos. Lots of valuable information is in long form video content, but searching through this is a pain. Conifer allows users to search long form youtube videos in natural language. Students with hours of lecture videos, developers stuck in tutorial purgatory, and impatient movie watchers could all benefit from something like this.

Try out the app here! 
https://conifer-amber.vercel.app/

## Usage tips

- Conifer performs better on long form content. Search is more suited to hour long lectures or tutorials than short clips.
- Because it searches transcripts conifer doesn't really support videos without speech

## What it does

Given a user query, Conifer navigates to the timestamp in the video that mostly closely matches the query, and produces gpt4 powered response to the query based on the video. 

Key features

- Adding / saving videos 
- Searching a youtube timestamp
- Chatbot QA based on query

## How I built it

There are a few key technical components to Conifer:
- **Video Ingestion:** Given a youtube video, get the timestamped transcript and "chunk" it, associating the closest timestamp with each of the chunks. Store these chunks and associated vector embeddings in pincone.
- **Transcript Search:** Given a user query and video, search the pinecone index for the matching record and retrieve its timestamp. Then change the video player to the closest matching timestamp
- **Chatbot QA:** Answer the user query given the relevant documents retrieved from pinecone - stream the response back using langchain / fastapi streaming
- **Database / Accounts:** Handle adding / deleting videos, and setup a convex DB to support this. Each user can have a unique collection of videos etc. 

Conifer is build with next.js and uses a fast api backend. In addition, users and accounts are managed with convex, while transcript vectors and search is powered by a pinecone db. Finally, authentication is handled by clerk. 

## Demo
Here is my video demo, as part of my submission to pinecone's 2023 hacakthon: https://devpost.com/software/conifer-f05ozu

<p align="center">
  <a href="https://www.youtube.com/watch?v=nt16rI0B3JY">
    <img src="https://img.youtube.com/vi/nt16rI0B3JY/0.jpg" alt="FastAPI Crash Course" />
  </a>
</p>


