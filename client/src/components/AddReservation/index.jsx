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
    const navigate = useNavigate()
    const [dateStart, setDateStart] = useState("2023-06-15")
    const [dateEnd, setDateEnd] = useState("2023-06-15")
    const [data, setData] = useState([])
    const [room, setRoom] = useState("Wybierz pokoj")
    
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

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log("ss")
        const response = await axios.post('http://localhost:8080/api/reservations/add', {
            dateStart: dateStart,
            dateEnd: dateEnd,
            roomName: room,
            mail: mail
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
                <h1>Nowa rezerwacja</h1>
                <div className = {styles.buttons_container}>
                    <button className={styles.white_btn} onClick = {handleMain}>Strona główna</button>
                    <button className={styles.white_btn} onClick = {handleRooms}>Pokoje</button>
                    <button className={styles.white_btn} onClick = {handleReservations}>Rezerwacje</button>
                    <button className={styles.white_btn} onClick= {handleLogout}> Wyloguj </button>
                </div>
            </nav>
            <div className={styles.reservations}>
                <h1>Złóż rezerwację</h1>
                <form method = "POST"  onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="room">Pokój</label>
                    <select className = {styles.select} onChange={e => setRoom(e.target.value)} name = "room">
                        {data.map(obj=>(
                            <option key={obj.name} value = {obj.name}>{obj.name}</option>
                        ))}
                    </select>
                    <label htmlFor="dateStart">Data początkowa</label>
                    <input className={styles.date} type = "date" name="dateStart" value={dateStart} onChange={e => setDateStart(e.target.value)}></input>
                    <label htmlFor="dateEnd">Data końcowa</label>
                    <input className={styles.date} type = "date" name="dateEnd" value={dateEnd} onChange={e => setDateEnd(e.target.value)}></input>
                    <input className={styles.green_btn} type="submit" value="Sprawdź dostępność"></input>
                </form>
            </div>
        </div>
    )
}

export default Main