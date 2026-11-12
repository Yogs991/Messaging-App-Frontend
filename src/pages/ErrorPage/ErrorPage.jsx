import styles from "./ErrorPage.module.css";
import { Link } from "react-router";

export default function ErrorPage(){
    return(
        <main className={styles.main}>
            <div className={styles.errorContainer}>
                <h1>Error</h1>
                <div className={styles.errorContent}>
                    <p>The page you're looking for doesn't exist or has been moved.</p>
                </div>
                <p>
                    Click <Link to="/">here</Link> to go back to home page.
                </p>
            </div>
        </main>
    )
}