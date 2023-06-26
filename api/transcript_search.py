import requests
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
from dotenv import load_dotenv
import urllib.parse
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
import pinecone
from uuid import uuid4

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")
PINECONE_INDEX = os.getenv("PINECONE_INDEX")

pinecone.init(
    api_key=PINECONE_API_KEY,  # find at app.pinecone.io
    environment=PINECONE_ENV,  # next to api key in console
    )

embed = OpenAIEmbeddings(
        model='text-embedding-ada-002',
        openai_api_key=OPENAI_API_KEY
    )

def hello():
    print("hello world")

def get_playlist_from_url(playlist_url):

    parsed_url = urllib.parse.urlparse(playlist_url)
    query_params = urllib.parse.parse_qs(parsed_url.query)
    playlist_id = query_params["list"][0]

    # Get the playlist ID
    # playlist_id = "PLRLVhGQeJDTLiw-ZJpgUtZW-bseS2gq9-"

    url = "https://www.googleapis.com/youtube/v3/playlistItems"

    params = {
        'part': 'snippet',
        'maxResults': 25,
        'playlistId': playlist_id,
        'key': YOUTUBE_API_KEY
    }

    response = requests.get(url, params=params)
    return response.json()

def get_id_from_video(video_url):
    parsed_url = urllib.parse.urlparse(video_url)
    query_params = urllib.parse.parse_qs(parsed_url.query)
    return query_params["v"][0]


def get_video_from_url(video_url):

    video_id = get_id_from_video(video_url)
    return YouTubeTranscriptApi.get_transcript(video_id)


def preprocess_transcript(transcript):

    string_idx = 0
    for i,obj in enumerate(transcript):

        obj["string_index"] = string_idx
        string_idx += len(obj["text"]) + 1 # this + 1 is to account for the whitespace during the join

        transcript[i] = obj
    
    formatter = TextFormatter()
    formatted_transcript = formatter.format_transcript(transcript).replace("\n", " ")

    return transcript, formatted_transcript


# chunk by an arbitrary chunk size - a potential improvement is using spacy or NLTK as the splitter
def chunk_by_text(text, transcript, video_id, chunk_size = 1000, chunk_overlap = 20):

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = chunk_size,
        chunk_overlap  = chunk_overlap
    )

    docs = []  # List holding all the documents

    for i,chunk in enumerate(text_splitter.split_text(text)):
        # Generate documents
        string_index = i * (chunk_size - chunk_overlap)

        docs.append(Document(
            page_content=chunk, 
            metadata={
                # "string_index": i * (chunk_size - chunk_overlap)
                "chunk_timestamp": match_timestamp(string_index, transcript),
                "video_id": video_id
            }))

    return docs

# this function basically walks through the timestamps, and finds the closest one before the given chunk
# definitely room for optimization here - I think its o(n^2) when there is o(n) solution

def match_timestamp(string_index, raw_transcript):

    for i,timestamp_obj in enumerate(raw_transcript):

        if string_index == 0:
            return raw_transcript[0]["start"]
            

        elif timestamp_obj['string_index'] == string_index:
            return raw_transcript[i-1]["start"]
             

        elif timestamp_obj['string_index'] > string_index:
            return raw_transcript[i-1]["start"]
            

        elif i == len(raw_transcript) - 1:
            return raw_transcript[-1]["start"]


def create_embeddings(chunked_text):

    ids = []
    embeddings = []
    metadatas = []

    for i,chunk in enumerate(chunked_text):

        text = chunk.page_content
        chunk_metadata = chunk.metadata

        chunk_metadata["chunk_index"] = i
        chunk_metadata["text"] = text

        metadatas.append(chunk_metadata)
    
    ids = [str(uuid4()) for _ in chunked_text]
    embeddings = embed.embed_documents([c.page_content for c in chunked_text])

    return ids, embeddings, metadatas

def is_video_indexed(video_url):

    # I think this is dumb but apparently I need to a vector to query the DB
    test_vector = [0 for _ in range(1536)]
    # check that video is not already indexed
    video_id = get_id_from_video(video_url)
    index = pinecone.Index(PINECONE_INDEX)
    query_result = index.query(
        vector=test_vector,
        filter={
            "video_id": {"$eq": f"{video_id}"},
        },
        top_k=1,
        include_metadata=True
    )
    # print(video_id)
    # print(query_result)
    return len(query_result['matches']) > 0

def index_video(video_url):

    if is_video_indexed(video_url):
        return

    # read video transcript, we need 2 versions: timestamped and formatted
    video_id = get_id_from_video(video_url)
    transcript = get_video_from_url(video_url)
    timestamped_transcript, formatted_transcript = preprocess_transcript(transcript)    

    # chunk formatted transcript and add closest timestamps at the start of each chunk
    chunked_text = chunk_by_text(formatted_transcript, timestamped_transcript, video_id, chunk_size = 500, chunk_overlap = 20)

    # reformat chunked text to be upserted into pinecone
    ids, embeddings, metadatas = create_embeddings(chunked_text)    

    index = pinecone.Index(PINECONE_INDEX)
    index.upsert(vectors=zip(ids,embeddings,metadatas))


def search_transcript(query, video_url, k=3):

    video_id = get_id_from_video(video_url)

    embeddings = OpenAIEmbeddings()
    docsearch = Pinecone.from_existing_index(PINECONE_INDEX, embeddings)
    
    similar_docs = docsearch.similarity_search_with_score(query, k=k, filter={"video_id":video_id})

    best_doc = similar_docs[-1][0]
    total_seconds = best_doc.metadata["chunk_timestamp"]

    # parsing timestamp from url
    def convert_seconds(total_seconds):
        minutes, seconds = divmod(total_seconds, 60)
        return int(minutes), int(seconds)

    minutes, seconds = convert_seconds(total_seconds)
    for s in similar_docs:
        print(s)
    # print(f"exact timestamp - {minutes}:{seconds}")

    return total_seconds

langchain_tutorial_url = "https://www.youtube.com/watch?v=jSP-gSEyVeI"

search_transcript("How do you create a langchain agent?", langchain_tutorial_url)

# print(is_video_indexed(langchain_tutorial_url))


