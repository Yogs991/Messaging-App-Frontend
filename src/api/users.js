import { apiFetch } from "./client.js";

export async function getMe(){
    try {
        return await apiFetch("/users/me");
    } catch (error) {
        if(error.message === "Unauthorized"){
            return null;
        }

        throw error;
    }
}

export const updateMe = (data)=>{
    apiFetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export const deleteMe = ()=>{
    apiFetch("/users/me",{
        method: "DELETE",
    });
}

export const searchUsers = (query, limit = 15)=>{
    if(!query?.trim()) return Promise.resolve([]);

    return apiFetch(`/users?search=${encodeURIComponent(query)}&limit=${limit}`);
}

export const getPublicProfile =(userId)=>{
    apiFetch(`/users/${userId}`);
}