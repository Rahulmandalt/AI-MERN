import React, { useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { useEffect } from "react";
import Massage from "./Massage";

function ChatBox() {
  const { selectedChat, theme } = useAppContext();

  const containerref = useRef(null)

  const [massages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt,setPrompt]=useState('');
  const [mode, setMode] = useState('text');
   const [isPublished, setIsPublished] = useState(false);

   const onSubmit = async (e)=>{
    e.preventDefault()
   }

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(()=>{
    if(containerref.current){
      containerref.current.scrollTo({
        top:containerref.current.scrollHeight,
        behavior:'smooth'
      })
    }
  },[massages])

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">

      {/* Chat messages */}
      <div ref={containerref} className="flex-1 mb-5 overflow-y-scroll">
        {massages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="logo"
              className="w-full max-56 sm:max-w-68"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me anything.
            </p>
          </div>
        )}

        {massages.map((massage, index) => (
          <Massage key={index} massage={massage} />
        ))}

        {/* {three dotes loading===} */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce">
              
            </div>
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce">
              
            </div>
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce">
            
            </div>
          </div>
        )}
      </div>

    {mode === 'Image' && (
  <label className="inline-flex items-center gap-3 text-sm mx-auto">
    <p className="text-xs">
      Publish Generated Image to community
    </p>

    <input
      type="checkbox"
      className="cursor-pointer"
      checked={isPublished}
      onChange={(e) => setIsPublished(e.target.checked)}
    />
  </label>
)}

      {/*------Prompt input box----- */   }
      <form onSubmit={onSubmit} className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:boder-[#80609F]/30 rounded-full w-full max-w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center">
        <select onChange={(e)=>setMode(e.target.value)} value={mode} className="text-sm pl-3 outline-none">
          <option className=" dark:bg-purple-900" value='text'>Text</option>
          <option className="dark:bg-purple-900" value='Image'>Image</option>
        </select>
        <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} type="text " placeholder="Type your promt here..." className="flex-1 w-full text-sm outline-none" required/>
        <button disabled={loading}>
          <img src={loading ? assets.stop_icon : assets.send_icon} className="w-8 cursor-pointer" alt=""/>
        </button>
      </form> 
    </div>
  );
}

export default ChatBox;
