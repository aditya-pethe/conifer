import React, { useState, ChangeEvent, FormEvent } from 'react';

type VideoInputProps = {
  setVideoUrl: React.Dispatch<React.SetStateAction<string>>;
};

const VideoInput: React.FC<VideoInputProps> = ({ setVideoUrl }) => {
  const [input, setInput] = useState<string>('');

  const onInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setVideoUrl(input);
    setInput('');
  };

  return (
    <div className="p-4 w-full max-w-[40%] mx-auto bg-black text-white rounded-b-xl shadow-md flex items-center space-x-4 border border-gray-700 border-2 border-t-0">
      <form onSubmit={onFormSubmit} className="flex flex-row w-full mt-6 mb-2">
        <input
            type="text"
            className="flex-grow bg-black h-8 px-2 transition duration-200 border rounded text-white text-sm focus:outline-none focus:border-blue-300"
            style={input ? { textAlign: 'left' } : { textAlign: 'center' }}
            value={input}
            onChange={onInputChange}
            placeholder="Add a video by url"
            onFocus={(e) => {
                e.target.style.textAlign = 'left';
                e.target.placeholder = '';
              }}
            onBlur={(e) => {
            if (!e.target.value) {
                e.target.style.textAlign = 'center';
                e.target.placeholder = 'Add a video by url';
            }}}
        />
        <button type="submit" className="h-8 w-8 flex items-center justify-center ml-2 bg-purple-800 rounded-full focus:shadow-outline hover:bg-purple-900">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        </button>
      </form>
    </div>
  );
};

export default VideoInput;
