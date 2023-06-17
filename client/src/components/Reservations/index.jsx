import styles from "./styles.module.css"
import { useState, useEffect } from "react"
import axios from "axios"
import jwt from "jwt-decode"
import { Link, useNavigate } from "react-router-dom"
const Main = () => {
    const user = localStorage.getItem("token")
    let mail = null
    if(user){
        mail = jwt(user).email
    }
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [error, setError] = useState("")
    
    const getData = async () => {
        const {data} = await axios.post('http://localhost:8080/api/reservations', {
            email: mail
        })
        setData(data.reservations)
    }
    useEffect(() => {
        getData()
    },[])
    useEffect(() => {
        console.log(data)
    },[data])

    const deleteReservation = async (_id) => {
        if(window.confirm("Na pewno chcesz usunąć?")){
            setData(data.filter((reservation) => reservation._id != _id))
            await axios.post('http://localhost:8080/api/reservations/delete', {
                id: _id
            })
        }
    }

    const editReservation = (item) => {
        navigate('/reservations/edit', {state: {item}})
    }

    const handleReservations = () => {
        navigate('/reservations')
    }
    const handleRooms = () => {
        navigate('/rooms')
    }
    const handleAddReservation = () => {
        navigate('/reservations/add')
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
                <h1>Rezerwacje</h1>
                <div className = {styles.buttons_container}>
                    <button className={styles.white_btn} onClick = {handleMain}>Strona główna</button>
                    <button className={styles.white_btn} onClick = {handleRooms}>Pokoje</button>
                    <button className={styles.white_btn} onClick = {handleReservations}>Rezerwacje</button>
                    <button className={styles.white_btn} onClick={handleLogout}> Wyloguj </button>
                </div>
            </nav>
            <div className={styles.addNew}>
                <button className={styles.addButton} onClick = {handleAddReservation}>Zarezerwuj pokój</button>
            </div>
            <div className={styles.reservations}>
                {data.map((item, index) => (
                    <div key={index} className = {styles.reservation}>
                        <div>
                            <h2>Rezerwacja {index+1}</h2>
                            <h2>{item.roomName}</h2>
                            <p>Data początkowa: {item.dateStart}</p>
                            <p>Data końcowa: {item.dateEnd}</p>
                        </div>
                        <div className = {styles.buttons}>
                            <button className = {styles.green_btn} onClick={() => editReservation(item)}>Edytuj</button>
                            <button className = {styles.red_btn} onClick={() => deleteReservation(item._id)}>Usuń</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Main