import os
from fastapi import FastAPI, HTTPException
from fastapi_async_langchain.responses import StreamingResponse
from pydantic import BaseModel
import requests

from transcript_search import search_transcript, index_video
from chatbot.chat_qa import Chatbot

app = FastAPI()
chatbot = Chatbot()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

langchain_tutorial_url = "https://www.youtube.com/watch?v=jSP-gSEyVeI"

class TimestampQuery(BaseModel):
    query: str
    video_url: str

class ChatQuery(BaseModel):
    query: str

class VideoQuery(BaseModel):
    video_url: str

@app.get("/")
async def root():
    return {"message": "conifer api"}

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.post("/api/timestamp")
async def get_timestamp(request: TimestampQuery):
    try:
        timestamp = search_transcript(request.query, request.video_url, k=1)
        return {"timestamp": timestamp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_qa(request: ChatQuery):
    try:
        chain = chatbot.qachain
        return StreamingResponse.from_chain(chain, request.query, media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/video")
async def store_video(request: VideoQuery):
    try:
        index_video(request.video_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/video_info")
async def get_video_info(video_id: str):
    try:
        response = requests.get(
            'https://www.googleapis.com/youtube/v3/videos',
            params={
                'part': 'snippet',
                'id': video_id,
                'key': YOUTUBE_API_KEY,
            },
        )
        response.raise_for_status()
        data = response.json()
        title = data['items'][0]['snippet']['title']
        channelTitle = data['items'][0]['snippet']['channelTitle']

        return {"title": title, "channelTitle": channelTitle}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except (KeyError, IndexError) as e:
        raise HTTPException(status_code=500, detail="Failed to fetch video information")

