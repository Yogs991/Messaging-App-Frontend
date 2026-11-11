import { useContext } from "react";
import { ChatContext } from "./ChatContext.js";

export function useChats(){
    return useContext(ChatContext);
}