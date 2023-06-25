import React, { useEffect, useState } from 'react';

type ChatOutputProps = {
  userQuery: string;
};

const ChatOutput: React.FC<ChatOutputProps> = ({ userQuery }) => {
  const [botResponse, setBotResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setBotResponse(''); // Clear previous response when a new query is made.
      if(userQuery === ''){
          return;
      }
      try {
        const response = await fetch("/api/chat", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: userQuery })
        });

        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');

          reader.read().then(function processText({ done, value }):any {
            if (done) {
              console.log('Stream complete');
              return;
            }

            setBotResponse(prev => prev + decoder.decode(value));
            return reader.read().then(processText);
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userQuery]);

  return (
    <div className="flex flex-col w-[full] bg-black text-white b rounded-5">
      <div className="mb-6">
        <h1 className="text-3xl text-center font-bold">QA</h1>
        <hr className="border-t border-white mt-2"/>
      </div>
      <div className="p-4 border-2 border-gray-700 h-[750px]">
        <p className="text-purple-500">{userQuery}</p>
        <br></br>
        <p>{botResponse}</p>
      </div>
      
    </div>
  );
};

export default ChatOutput;