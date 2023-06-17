import styles from "./styles.module.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
const Main = () => {
    const [fileData, setFileData] = useState([])
    const [fileProduct, setFileProduct] = useState("")
    const fileProducts = ["rice", "rice2"]

    const getData = (itemName) => {
        fetch(itemName+'.json')
        .then(function(response){
            return response.json()
        })
        .then(function(json){
            console.log(json.results[0])
            setFileData(json.results[0].values)
        })
    }

    useEffect(() => {
        
    }, [])

    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate('/')
        window.location.reload()
    }
    const handleMain = () => {
        console.log(fileData)
        console.log(fileProduct)
        //navigate('/')
    }
    const handleImportJson = () => {
        getData(fileProduct)
    }
    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>Rezerwacja pokoi</h1>
                <div className = {styles.buttons_container}>
                    <button className={styles.white_btn} onClick = {handleMain}>Strona główna</button>
                    <button className={styles.white_btn} onClick={handleLogout}> Wyloguj </button>
                </div>
            </nav>
            <div className={styles.main}>
                <h1>Integracja systemow</h1>
                <h2>Wybierz produkt do importu</h2>
                <select className = {styles.select} onChange={e => setFileProduct(e.target.value)}>
                <option value="" selected disabled hidden>Wybierz produkt</option>
                    {fileProducts.map(obj=>(
                        <option key={obj} value = {obj}>{obj}</option>
                    ))}
                </select>
                {
                    fileProduct && <div className={styles.import_category}>
                        <div className={styles.file_buttons}>
                            <h2>Operacje na plikach lokalnych</h2>
                            <button className={styles.gray_btn} onClick = {()=>handleImportJson(fileProduct)}>Importuj JSON</button>
                            <button className={styles.gray_btn}>Importuj XML</button>
                            <button className={styles.gray_btn}>Eksportuj JSON</button>
                            <button className={styles.gray_btn}>Eksportuj XML</button>
                        </div>
                        <div className={styles.file_buttons}>
                            <h2>Operacje na bazie danych</h2>
                            <button className={styles.gray_btn}>Importuj SQL</button>
                            <button className={styles.gray_btn}>Eksportuj SQL</button>
                        </div>
                    </div>
                }
                
                {fileData && fileData.length>0 && fileData.map((item) => <p>{item.year}, {item.val}</p>)}
            </div>
        </div>
    )
}

export default Main