import styles from "./styles.module.css"
import { useState, useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
const Main = () => {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [error, setError] = useState("")
    
    const getData = async () => {
        const {data} = await axios.get('http://localhost:8080/api/rooms')
        setData(data.rooms)
    }
    useEffect(() => {
        getData()
    },[])
    useEffect(() => {
        console.log(data)
    },[data])

    const handleReservations = () => {
        navigate('/reservations')
    }
    const handleRooms = () => {
        navigate('/rooms')
    }
    const handleMain = () => {
        navigate('/')
    }
    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate('/')
        window.location.reload()
    }

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>Pokoje</h1>
                <div className = {styles.buttons_container}>
                    <button className={styles.white_btn} onClick = {handleMain}>Strona główna</button>
                    <button className={styles.white_btn} onClick = {handleRooms}>Pokoje</button>
                    <button className={styles.white_btn} onClick = {handleReservations}>Rezerwacje</button>
                    <button className={styles.white_btn} onClick={handleLogout}> Wyloguj </button>
                </div>
            </nav>
            <div className={styles.rooms}>
                {data.map((item, index) => (
                    <div key={index} className={styles.room}>
                        <h2>{item.name}</h2>
                        <p>Liczba łóżek: {item.beds}</p>
                        <h3>Opis pokoju</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
  </div>
        </div>
    )
}

export default Main