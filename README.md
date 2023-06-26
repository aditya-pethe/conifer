
<p align="center">
  <img width="500" alt="Screen Shot 2023-06-25 at 9 11 15 PM" src="https://github.com/aditya-pethe/conifer/assets/50645024/53720b0b-ffaf-41e1-a30c-75b3061a9f5e">
</p>

## Demo
Try out the app here! 
https://conifer-amber.vercel.app/

## Inspiration

I'm tired of 2x-ing my lecture videos and tutorials. Lots of valuable information is in long form video content, but searching through this is a pain. Conifer allows users to search long form youtube videos in natural language. Students with hours of lecture videos, developers stuck in tutorial purgatory, and impatient movie watchers could all benefit from something like this.

## What it does

Given a user query, Conifer navigates to the timestamp in the video that mostly closely matches the query, and produces gpt4 powered response to the query based on the video. 

Key features

- Adding / saving videos 
- Searching a youtube timestamp
- Chatbot QA based on query

## How we built it

There are a few key technical components to Conifer:
- **Video Ingestion:** Given a youtube video, get the timestamped transcript and "chunk" it, associating the closest timestamp with each of the chunks. Store these chunks and associated vector embeddings in pincone.
- **Transcript Search:** Given a user query and video, search the pinecone index for the matching record and retrieve its timestamp. Then change the video player to the closest matching timestamp
- **Chatbot QA:** Answer the user query given the relevant documents retrieved from pinecone - stream the response back using langchain / fastapi streaming
- **Database / Accounts:** Handle adding / deleting videos, and setup a convex DB to support this. Each user can have a unique collection of videos etc. 

### Technologies

Conifer is build with next.js and uses a fast api backend. In addition, users and accounts are managed with convex, while transcript vectors and search is powered by a pinecone db. Finally, authentication is handled by clerk. 

## Challenges we ran into

Many things were challenging - but a few notable things:

- streaming: I ended up using a convenient prebuilt library for this
- convex: great DB, but learning it on the fly was difficult

## Accomplishments that we're proud of

- MVP: It's usable in its current form, which is great
- Accurate timestamp search: this is the key feature of the whole thing, and in general its pretty good. It uses a combination of metadata filtering and embedding search. Also, mapping timestamps -> data chunks wasn't simple at first.
- Fast streaming: I think the streaming is great, fast completion time which is nice

## What we learned

- Don't change your idea halfway through
- Hacking with a bunch of new technologies is hard but fun!

## What's next for Conifer

A couple features I would have liked to have added:
- Search across all videos - could be toggled on and off
- Chat history that maps to a video - right now there are no user chats, but their could be chats per vid
