from langchain.prompts import (
    ChatPromptTemplate,
    PromptTemplate,
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)


prompt_template = """
Use the following pieces of context to create a concise answer to the question at the end. The 
context is part of a video transcript that was the closest match to a user query. s
If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}
Concise helpful Answer:"""

QA_PROMPT = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
)