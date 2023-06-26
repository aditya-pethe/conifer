import os
from fastapi import FastAPI
from fastapi_async_langchain.responses import StreamingResponse
from pydantic import BaseModel
import requests

from transcript_search import search_transcript, index_video
from chatbot.chat_qa import Chatbot

app = FastAPI()
chatbot = Chatbot()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

langchain_tutorial_url = "https://www.youtube.com/watch?v=jSP-gSEyVeI"

class timestampQuery(BaseModel):
    query: str
    video_url:str

class chatQuery(BaseModel):
    query: str

class videoQuery(BaseModel):
    video_url:str

@app.get("/")
async def root():
    return {"message":"conifer api"}

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.post("/api/timestamp")
async def get_timestamp(request:timestampQuery):
    timestamp = search_transcript(request.query, request.video_url, k=1)
    return {"timestamp":timestamp}

@app.post("/api/chat")
async def chat_qa(request:chatQuery):
    chain = chatbot.qachain
    return StreamingResponse.from_chain(chain, request.query, media_type="text/event-stream")

@app.post("/api/video")
async def store_video(request:videoQuery):
    index_video(request.video_url)

@app.get("/api/video_info")
async def get_video_info(video_id: str):
    response = requests.get(
        'https://www.googleapis.com/youtube/v3/videos',
        params={
            'part': 'snippet',
            'id': video_id,
            'key': YOUTUBE_API_KEY,
        },
    )
    data = response.json()
    title = data['items'][0]['snippet']['title']
    channelTitle = data['items'][0]['snippet']['channelTitle']  # get the channel title

    return {"title": title, "channelTitle": channelTitle}  # return the channel title
