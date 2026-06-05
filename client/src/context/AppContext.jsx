import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { dummyUserData } from "../assets/assets";
import { dummyChats } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  //console.log(import.meta.env.VITE_SERVER_URL)
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser,setloadingUser]= useState(true)

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data", {
       headers: {
  Authorization: `Bearer ${token}`
},
      });
       if(data.success){
            setUser(data.user)
        }else{
           toast.error(data.message) 
        }
    } catch (error) {
  toast.error(data.message) 

    }finally{
        setloadingUser(false)
    }
  };

  const createNewchat = async ()=>{
    try{
        if(!user) return toast('logine to create a new chat')
            navigate('/')
     await axios.get('/api/chat/create',{headers: {
  Authorization: `Bearer ${token}`
}})
     await fetchUserChats()
    }catch(error){
       toast.error(error.message)
    }
  }

  const fetchUserChats = async () => {
     try{
        const {data}=await axios.get('/api/chat/get',{headers: {
  Authorization: `Bearer ${token}`
}})
        if(data.success){
            setChats(data.chats) 
            // if the user has no chats create one
            if(data.chats.length===0){
                await createNewchat()
                return fetchUserChats()
            }else{
                setSelectedChat(data.chats[0])
            }
            }else{
                toast.error(data.message)
            }
        }
     catch(error){
 toast.error(error.message)
     }
  };

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setSelectedChat(null);
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    
    if(token){
fetchUser();
    }else{
        setUser(null)
        setloadingUser(false)
    }
  }, [token]);

  const value = {
    navigate,
    user,
    setUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    createNewchat,
    loadingUser,
    fetchUserChats,
    token,
    setToken,
    axios
    
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
