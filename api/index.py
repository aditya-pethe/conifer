from fastapi import FastAPI
from transcript_search import search_transcript
from pydantic import BaseModel

app = FastAPI()
langchain_tutorial_url = "https://www.youtube.com/watch?v=jSP-gSEyVeI"

class Query(BaseModel):
    query: str
    video_url:str

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}
    

@app.post("/api/chat")
async def get_timestamp(request:Query):
    print("question: ", request.query)
    timestamp = search_transcript(request.query, request.video_url)    
    return {"timestamp":timestamp}