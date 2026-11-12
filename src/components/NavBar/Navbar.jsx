import { useEffect } from "react";
import { NavLink } from "react-router";
import styles from "./Navbar.module.css";
import AccountContainer from "../AccountContainer/AccountContainer.jsx";
import { useAuth } from "../../context/useAuth.js";
import { useChats } from "../../context/useChats.js";
import truncateText from "../../functions/truncateText.js";
import plusIcon from "../../icons/plus-circle-outline.svg";
import groupAvatar from "../../icons/account-group.svg";
import defaultAvatar from "../../icons/default-group.svg";

export default function Navbar(){
    const { user } = useAuth();
    const { chats, setChats, fetchChats, nextCursor, setNextCursor, loading, setLoading } = useChats();

    useEffect(()=>{
        if(user){
            fetchChats();
        }else{
            setChats([]);
            setNextCursor(null);
        }
    },[user, fetchChats, setChats, setNextCursor]);

    const loadMoreChats = async() =>{
        if(!nextCursor || loading ) return;

        try{
            setLoading(true);

            const res = await fetchChats(nextCursor);

            if(!res || !res.chats) return null;

            setChats((prev)=> [...prev, ...res.chats]);

            setNextCursor(res.nextCursor ?? null);
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

    const handleScroll = (e)=>{
        const element = e.target;
        
        if(element.scrollHeight <= element.clientHeight) return;

        const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50;

        if(nearBottom){
            loadMoreChats();
        }
    };

    return(
        <nav className={styles.nav}>
            <div className={styles.upperNav}>

                <h1 className={styles.logo}>App</h1>

                <div className={styles.chatsContainer} onScroll={handleScroll}>

                    <NavLink to="/chats/new" className={({isActive})=> `${styles.newChatBtn} ${isActive ? styles.active : ""}`}>
                        <img src={plusIcon} alt="create new chat" className={styles.plusIcon}/>
                    </NavLink>

                    {chats.map((chat)=>{
                        const otherMember = chat.chatMembers?.find(
                            (m)=> m.user.id !== user?.id,
                        );

                        const label = chat.isGroup ? chat.name || "Group chat" : chat.name || otherMember?.user.displayName || "Chat";

                        const lastMessage = chat.messages?.[0];

                        const rawPreview = lastMessage?.deletedAt ? "Message deleted" : lastMessage?.content || "";

                        const preview = truncateText(rawPreview, 50);

                        return(
                            <NavLink key = {chat.id} to={`/chats/${chat.id}`} className={({isActive})=>`${styles.chatBtn} ${isActive ? styles.active : ""}`}>
                                <img 
                                    src={chat.isGroup ? groupAvatar : otherMember?.user.avatarUrl ? otherMember.user.avatarUrl : defaultAvatar } 
                                    alt="chat image" 
                                    className = {styles.chatAvatar}
                                />
                                <div className={styles.chatContent}>
                                    <div className={styles.chatLabel}>
                                        {truncateText(label, 24)}
                                    </div>
                                    {preview && (
                                        <div className={styles.chatPreview}>{preview}</div>
                                    )}
                                </div>
                            </NavLink>
                        )
                    })}

                    {loading && <div className={ styles.loading}>Loading...</div>}
                </div>
            </div>

            <div className={styles.accountContainer}>
                    <AccountContainer/>
            </div>
        </nav>
    )
}