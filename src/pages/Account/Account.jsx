import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getMe, updateMe, deleteMe } from "../../api/users.js";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import styles from "./Account.module.css";
import { useAuth } from "../../context/useAuth.js";

export default function Account(){
    const navigate = useNavigate();

    const {user, setUser} = useAuth();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        displayName: "",
        avatarUrl: "",
    });

    
    const [profileError, setProfileError] = useState(null);
    const [profileSuccess, setProfileSuccess] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(()=>{
        async function load(){
            try{
                const data = await getMe();

                setUser(data);

                setForm({
                    displayName: data.displayName || "",
                    avatarUrl: data.avatarUrl || ""
                });
            }catch(err){
                setProfileError(err.message);
            }finally{
                setLoading(false);
            }
        }

        load();
    },[setUser]);

    function handleChange(e){
        const { name, value } = e.target;
        setForm((prev)=>({...prev, [name]: value}));
    }

    async function handleUpdate(e){
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);

        try{
            const updated = await updateMe(form);
            setUser(updated);

            setProfileSuccess("Profile updated successfully");
        }catch(err){
            setProfileError(err.message);
        }
    }

    function handleDelete(){
        setShowConfirm(true);
        setDeleteError(null);
    }

    async function confirmDelete(){
        try{
            await deleteMe();
            setShowConfirm(false);
            navigate("/login");
        }catch(err){
            setDeleteError(err.message);
        }
    }

    if(loading) return <div>Loading...</div>;

    if(!user) return <div>No user found</div>;

    return(
        <section className={styles.accountSection}>
            <div className={styles.accountContainer}>
                <h2>My account</h2>

                <div className={styles.avatarContainer}>
                    <h3>{user.username}</h3>

                    <img src={user.avatarUrl} alt="avatar" className={styles.avatar} />
                </div>

                <form onSubmit={handleUpdate} className={styles.profileForm}>
                    <h3>Update Profile</h3>

                    <div>
                        <label>
                            Display Name:
                        </label>
                        <input
                            name="displayName"
                            value= {form.displayName}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>
                            Avatar Url:
                        </label>
                        <input
                            name = "avatarUrl"
                            value={form.avatarUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className={styles.updateProfileBtn}>Update Profile</button>

                    {profileError && (
                        <div className={styles.feedback}>
                            {profileError}
                        </div>
                    )}

                    {profileSuccess && (
                        <div className={styles.feedback}>
                            {profileSuccess}
                        </div>
                    )}
                </form>

                <div className = {styles.deleteContainer}>
                    <h3>Delete Account</h3>

                    <p className={styles.warningMsg}>
                        WARNING: There will be no way to recover your account
                    </p>

                    <button onClick={handleDelete} type="button" className={styles.deleteAccountBtn}>Delete</button>

                    {deleteError && (
                        <div className={styles.feedback}>
                            {deleteError}
                        </div>
                    )}
                </div>

                <ConfirmModal
                    isOpen = {showConfirm}
                    message = "Are you sure you want to delete your account?"
                    confirmText = "Delete Forever"
                    onConfirm = {confirmDelete}
                    onCancel = {()=> setShowConfirm(false)}
                />
            </div>
        </section>
    )
}