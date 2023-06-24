import os
import threading
import queue

from fastapi import FastAPI
from fastapi_async_langchain.responses import StreamingResponse
from pydantic import BaseModel
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chat_models import ChatOpenAI

from lanarky import LangchainRouter
from transcript_search import search_transcript
from chatbot.chat_qa import Chatbot

app = FastAPI()
chatbot = Chatbot()

langchain_tutorial_url = "https://www.youtube.com/watch?v=jSP-gSEyVeI"


class timestampQuery(BaseModel):
    query: str
    video_url:str

class chatQuery(BaseModel):
    query: str

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}
    

@app.post("/api/timestamp")
async def get_timestamp(request:timestampQuery):
    # print("question: ", request.query)
    # best_doc = search_transcript(request.query, request.video_url, k=1)
    # text = best_doc.metadata["text"]
    timestamp = search_transcript(request.query, request.video_url, k=1)
    return {"timestamp":timestamp}

@app.post("/api/chat")
async def chat_qa(request:chatQuery):
    chain = chatbot.qachain
    return StreamingResponse.from_chain(chain, request.query, media_type="text/event-stream")