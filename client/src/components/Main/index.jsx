import styles from "./styles.module.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import saveAs from "file-saver"
import Charts from '../Chart'
const Main = () => {
    //navigation handlers
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


    //data handlers
    const [fileData, setFileData] = useState([])
    const [fileProduct, setFileProduct] = useState("")
    const fileProducts = [
        {key: "rice", value: "Ryż"},
        {key: "rice2", value: "Ryż2"}
    ]
    const getData = (itemName) => {
        fetch(itemName+'.json')
        .then(function(response){
            return response.json()
        })
        .then(function(json){
            console.log(json.results[0])
            const data = json.results[0]
            data.id = fileProduct
            setFileData(data)
        })
    }
    /*
    useEffect(() => {
        
    }, [])
    */
    const handleImportJson = () => {
        getData(fileProduct)
    }
    const handleExportJson = async () => {
        var blob = new Blob([JSON.stringify(fileData)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "rice.json");
    }
    const handleImportXml = () => {

    }
    const handleExportXml = () => {
        
    }
    const handleImportDb = async () => {
        try {
            const data = await axios.post('http://localhost:8080/api/item/import', {
                product: fileProduct
            })
            setFileData(data.data)
            console.log("Pobrano dane Mongo")
        } catch (e) {
            alert(e.response.data.message)
            console.log(e)
        }
        
    }
    const handleExportDb = async () => {
        try {
            const data = await axios.post('http://localhost:8080/api/item/export', {
                product: {...fileData, id: fileProduct}
            })
            console.log("Wyslano dane mongo")
        } catch (e) {
            alert(e.response.data.message)
            console.log(e)
        }
        
    }


    //main
    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>Integracja systemów</h1>
                <div className = {styles.buttons_container}>
                    <button className={styles.white_btn} onClick = {handleMain}>Strona główna</button>
                    <button className={styles.white_btn} onClick={handleLogout}> Wyloguj </button>
                </div>
            </nav>
            <div className={styles.main}>
                <h2>Wybierz produkt do importu</h2>
                <select className = {styles.select} onChange={e => setFileProduct(e.target.value)}>
                <option value="" selected disabled hidden>Wybierz produkt</option>
                    {fileProducts.map(obj=>(
                        <option key={obj.key} value = {obj.key}>{obj.value}</option>
                    ))}
                </select>
                {
                    fileProduct && <div className={styles.import_category}>
                        <div className={styles.file_buttons}>
                            <h2>Operacje na plikach JSON</h2>
                            <button className={styles.gray_btn} onClick = {handleImportJson}>Importuj JSON</button>
                            <button className={styles.gray_btn} onClick = {handleExportJson}>Eksportuj JSON</button>
                            
                        </div>
                        <div className={styles.file_buttons}>
                            <h2>Operacje na plikach XML</h2>
                            <button className={styles.gray_btn} onClick = {handleImportXml}>Importuj XML</button>
                            <button className={styles.gray_btn} onClick = {handleExportXml}>Eksportuj XML</button>
                        </div>
                        <div className={styles.file_buttons}>
                            <h2>Operacje na bazie danych</h2>
                            <button className={styles.gray_btn} onClick = {handleImportDb}>Importuj SQL</button>
                            <button className={styles.gray_btn} onClick = {handleExportDb}>Eksportuj SQL</button>
                        </div>
                    </div>
                }
                {/*fileData && fileData.values.length>0 && fileData.values.map((item, key) => <p key={key}>Rok: {item.year} Cena: {item.val}</p>)*/}
                {fileData && fileData.values.length>0 && <Charts data={fileData}></Charts>}
                
            </div>
        </div>
    )
}

export default Main