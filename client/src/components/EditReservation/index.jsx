import styles from "./styles.module.css"
import { useState, useEffect } from "react"
import axios from "axios"
import jwt from "jwt-decode"
import { Link, useNavigate, useLocation } from "react-router-dom"
const Main = () => {
    const user = localStorage.getItem("token")
    let mail = null
    if(user){
        mail = jwt(user).email
    }
    const location = useLocation()
    const reservation = location.state?.item
    const navigate = useNavigate()
    const [dateStart, setDateStart] = useState(reservation.dateStart)
    const [dateEnd, setDateEnd] = useState(reservation.dateEnd)

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

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log("ss")
        const response = await axios.post('http://localhost:8080/api/reservations/save', {
            id: reservation._id,
            dateStart: dateStart,
            dateEnd: dateEnd,
            roomName: reservation.roomName
        }).catch(function (error){
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                alert(error.response.data.message)
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
              console.log(error.config);
        })
        if(response)
            if(window.confirm(response.data.message))
                navigate('/reservations')
        
        
    }

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>Edycja rezerwacji</h1>
                <div className = {styles.buttons_container}>
                    <button className={styles.white_btn} onClick = {handleMain}>Strona główna</button>
                    <button className={styles.white_btn} onClick = {handleRooms}>Pokoje</button>
                    <button className={styles.white_btn} onClick = {handleReservations}>Rezerwacje</button>
                    <button className={styles.white_btn} onClick= {handleLogout}> Wyloguj </button>
                </div>
            </nav>
            <div className={styles.reservations}>
                <h1>Dane rezerwacji</h1>
                <h2>Pokój: {reservation.roomName}</h2>
                <form method = "POST"  onSubmit={handleSubmit} className={styles.form}>
                    <label htmlFor="dateStart">Data początkowa</label>
                    <input className={styles.date} type = "date" name="dateStart" value={dateStart} onChange={e => setDateStart(e.target.value)}></input>
                    <label htmlFor="dateEnd">Data końcowa</label>
                    <input className={styles.date} type = "date" name="dateEnd" value={dateEnd} onChange={e => setDateEnd(e.target.value)}></input>
                    <input className={styles.green_btn} type="submit" value="Zmień rezerwację"></input>
                </form>
            </div>
        </div>
    )
}

export default Main