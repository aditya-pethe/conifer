'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';

type ChatUIProps = {
    setVideoTimestamp: React.Dispatch<React.SetStateAction<number>>;
    setUserQuery: React.Dispatch<React.SetStateAction<string>>;
    videoUrl:string;
  };

type Message = {
    user: string;
    message: string;
};

const ChatUI: React.FC<ChatUIProps> = ({ setVideoTimestamp, setUserQuery, videoUrl }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    const onInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setInput(e.target.value);
    };


    async function searchTimestamp(query:string): Promise<number> {
        const queryData = {
            query: query,
            video_url: videoUrl
        };
        
        const response = await fetch('/api/timestamp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryData)
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        
          const data = await response.json();
          return data.timestamp;
    }

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        // setMessages([...messages, { user: 'You', message: input }]);
        setUserQuery(input);
        const newTimestamp = await searchTimestamp(input);
        setInput('');
        // const newTimestamp = Number(input);
        // console.log(newTimestamp);
        setVideoTimestamp(newTimestamp);
      };

    return (
        <div className="p-6 w-full max-w-[80%] mx-auto bg-black text-white rounded-t-xl shadow-md flex items-center space-x-4 border border-gray-700 border-2 border-b-0">
            <div className="flex-1 z-0 overflow-y-auto">
                {/* {messages.map((message, index) => (
                    <div key={index} className={`text-white p-2 rounded ${message.user === 'You' ? 'ml-auto bg-blue-600' : 'mr-auto bg-gray-600'}`}>
                        {message.message}
                    </div>
                ))} */}
            </div>
            <form onSubmit={onFormSubmit} className="flex flex-row w-full mt-10 mb-[4rem]">
                <input
                    type="text"
                    className="flex-grow bg-black h-10 px-2 transition duration-200 border rounded text-white text-sm focus:outline-none focus:border-blue-300"
                    style={input ? { textAlign: 'left' } : { textAlign: 'center' }}
                    value={input}
                    onChange={onInputChange}
                    placeholder="Ask a question to search the video"
                    onFocus={(e) => {
                        e.target.style.textAlign = 'left';
                        e.target.placeholder = '';
                    }}
                    onBlur={(e) => {
                    if (!e.target.value) {
                        e.target.style.textAlign = 'center';
                        e.target.placeholder = 'Ask a question to search the video';
                    }}}
                />
                <button type="submit" className="h-10 px-5 ml-2 text-white transition-colors duration-150 bg-purple-800 rounded-lg focus:shadow-outline hover:bg-purple-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 transform rotate-90">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatUI;
