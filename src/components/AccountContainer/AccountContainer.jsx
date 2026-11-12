import {useState, useRef, useEffect } from "react";
import { Link, useNavigate} from "react-router";
import { useAuth } from "../../context/useAuth.js";
import truncateText from "../../functions/truncateText.js";
import styles from "./AccountContainer.module.css";
import cog from "../../icons/cog.svg";

export default function AccountContainer(){
    const {user, isAuthenticated, logout, loading} = useAuth();

    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    //closes on outside click
    useEffect(()=>{
        function handleClick(e){
            if(menuRef.current && !menuRef.current.contains(e.target)){
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return ()=> document.removeEventListener("mousedown", handleClick);
    },[]);

    if(loading){
        return <div className={styles.container}>Loading...</div>;
    }

    if(!isAuthenticated){
        return(
            <div className={styles.container}>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        );
    }

    return(
        <div className={styles.container} ref={menuRef}>
            <div className={styles.userInfo}>

                <img src={user.avatarUrl} alt="avatar" className={styles.avatar} />

                <p className={styles.displayName}>{truncateText(user?.displayName || user?.username, 20)}</p>

                <button className={styles.gear} onClick={()=> setOpen((prev)=> !prev)}>
                    <img src={cog.svg} alt="settings icon" className={styles.settingsIcon} />
                </button>
                
                {open && (
                    <div className={styles.dropdown}>
                        <Link to="/account" onClick={()=> setOpen(false)}>
                            Account
                        </Link>

                        <button onClick={()=>{ logout(); navigate("/"); setOpen(false)}}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}