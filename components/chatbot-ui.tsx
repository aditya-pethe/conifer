'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';

type Message = {
    user: string;
    message: string;
};

const ChatUI: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    const onInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setInput(e.target.value);
    };

    const onFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setMessages([...messages, { user: 'You', message: input }]);
        setInput('');
    };

    return (
        <div className="p-6 w-full max-w-[40%] mx-auto bg-black text-white rounded-t-xl shadow-md flex items-center space-x-4 border border-gray-700 border-2 border-b-0">
            <div className="flex-1 z-0 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`text-white p-2 rounded ${message.user === 'You' ? 'ml-auto bg-blue-600' : 'mr-auto bg-gray-600'}`}>
                        {message.message}
                    </div>
                ))}
            </div>
            <form onSubmit={onFormSubmit} className="flex flex-row w-full mt-10 mb-[4rem]">
                <input
                    type="text"
                    className="flex-grow bg-black h-10 px-2 transition duration-200 border rounded text-white text-sm focus:outline-none focus:border-blue-300"
                    value={input}
                    onChange={onInputChange}
                    placeholder="Ask a question"
                />
                <button type="submit" className="h-10 px-5 ml-2 text-white transition-colors duration-150 bg-purple-800 rounded-lg focus:shadow-outline hover:bg-purple-900">Send</button>
            </form>
        </div>
    );
};

export default ChatUI;
