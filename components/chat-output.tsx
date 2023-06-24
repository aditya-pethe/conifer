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
    <div className="flex flex-col justify-left h-[480px] bg-black text-white border border-white px-10 py-10 rounded-5">
      <p>{botResponse}</p>
    </div>
  );
};

export default ChatOutput;