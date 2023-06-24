from cmd import PROMPT
import openai
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
# from langchain.callbacks.base import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)
from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.chains.conversational_retrieval.prompts import CONDENSE_QUESTION_PROMPT
from langchain.chains.question_answering import load_qa_chain
from langchain.chains import LLMChain

# from transcript_search import search_transcript
from prompts import QA_PROMPT
import pinecone

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX")
PINECONE_ENV = os.getenv("PINECONE_ENV")

openai.api_key = OPENAI_API_KEY
pinecone.init(
    api_key=PINECONE_API_KEY,  # find at app.pinecone.io
    environment=PINECONE_ENV,  # next to api key in console
    )

openai.api_key = OPENAI_API_KEY
embed = OpenAIEmbeddings(
        model='text-embedding-ada-002',
        openai_api_key=OPENAI_API_KEY
    )

class Chatbot:
    
    def __init__(self):
        
        self.chat = ChatOpenAI(model="gpt-4", streaming=True, temperature=0)
        self.vectorstore = Pinecone.from_existing_index(PINECONE_INDEX, OpenAIEmbeddings())
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

        question_generator = LLMChain(llm=ChatOpenAI(model='gpt-3.5-turbo'), prompt=CONDENSE_QUESTION_PROMPT)
        doc_chain = load_qa_chain(self.chat, chain_type="stuff", prompt=QA_PROMPT)

        self.qachain = ConversationalRetrievalChain(

            question_generator=question_generator,
            combine_docs_chain=doc_chain,
            retriever = self.vectorstore.as_retriever(), 
            memory=self.memory,
            # chain_type="stuff",
        )
        
        return


    async def get_full_response(self, query:str):
        response = self.qachain({"question": query, "chat_history": self.memory})
        return response

# def test_chatbot():
#     bot = Chatbot()
#     query = "how do i create an agent in langchain"
#     print(bot.get_full_response(query))

# test_chatbot()