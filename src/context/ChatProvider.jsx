import { useState, useCallback } from "react";
import { ChatContext } from "./ChatContext.js";
import { getChats } from "../api/chats.js";

export function ChatProvider({children}){
    const [chats, setChats] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchChats = useCallback(async(cursor=null)=>{
        try{
            const res = await getChats(cursor);
            if(cursor){
                setChats((prev)=>[...prev, ...(res.chats || [] )]);
            }else{
                setChats(res.Chats || []);
            }

            setNextCursor(res.nextCursor);
        }catch(error){
            console.error(error);
        }
    },[]);

    return (
        <ChatContext.Provider
            value = {{
                chats,
                setChats,
                fetchChats,
                nextCursor,
                setNextCursor,
                loading,
                setLoading
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}