import { apiFetch } from "./client.js";

export const editMessage = (messageId, content)=>
    apiFetch(`/message/${messageId}`,{
        method: "PATCH",
        body: JSON.stringify({ content }),
    });

export const deleteMessage = (messageId)=>
    apiFetch(`/messages/${messageId}`,{
        method: "DELETE",
    });