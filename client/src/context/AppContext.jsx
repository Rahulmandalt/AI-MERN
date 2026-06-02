import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { dummyUserData } from "../assets/assets";
import { dummyChats } from "../assets/assets";


const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const navigate= useNavigate()
    const [user,setUser] = useState(null)
    const [chats,setChats] = useState([])
    const [selectedChat,setSelectedChat] = useState(null)
    const [theme,setTheme] = useState(localStorage.getItem('theme') || 'light')

    const fetchUser= async()=>{
        setUser(dummyUserData)
    }

    const fetchUserChats = async()=>{
        setChats(dummyChats)
        setSelectedChat(dummyChats[0])
    }

    useEffect(()=>{
        if(user){
            fetchUserChats()
        }else{
            setSelectedChat(null)
        }
    },[user])

    useEffect(()=>{
        if(theme === 'dark'){
            document.documentElement.classList.add('dark')
        }else{
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    },[theme])

    useEffect(()=>{
        fetchUser();
    },[])

    const value = {
        navigate,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)