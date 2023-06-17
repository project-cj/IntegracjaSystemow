import styles from "./styles.module.css"
import { Link, useNavigate } from "react-router-dom"
const Main = () => {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate('/')
        window.location.reload()
    }
    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>Admin Panel</h1>
                <button className={styles.white_btn} onClick={handleLogout}> Wyloguj </button>
            </nav>
        </div>
    )
}
export default Main