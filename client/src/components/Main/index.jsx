import styles from "./styles.module.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import saveAs from "file-saver"
import Charts from '../Chart'
var xml2js = require('xml2js');

const Main = () => {
    const [fileData, setFileData] = useState([])
    const [fileProduct, setFileProduct] = useState("")

    //used to narrow down years in chart
    const [fileDataSecond, setFileDataSecond] = useState([])
    var parseString = require('xml2js').parseString;
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
        console.log(beginYear)
        console.log(endYear)
        
        let dat = fileDataSecond.values.filter((obj) => obj.year>"2001")
        dat = dat.filter((obj) => obj.year<"2010")
        setFileData({ ...fileDataSecond, values: [...dat] });

        //navigate('/')
    }


    //data handlers
    

    const fileProducts = [
        {key: "rice", value: "Ryż - za 1kg"},
        {key: "butter", value: "Masło świeże o zawartości tłuszczu ok. 82,5% - za 200g"},
        {key: "roll", value: "Bułka pszenna - za 50g"},
        {key: "bread", value: "Chleb pszenno-żytni - za 0,5kg"},
        {key: "sausage", value: "Kiełbasa wędzona - za 1kg"},
        {key: "oil", value: "Olej rzepakowy produkcji krajowej - za 1l"},
        {key: "sugar", value: "Cukier biały kryształ - za 1kg"},
        {key: "honey", value: "Miód pszczeli - za 400g"},
        {key: "eggs", value: "Jaja kurze świeże - za 1szt."},
        {key: "pasta", value: "Makaron jajeczny - za 400g"}
    ]
    const [beginYear, setBeginYear] = useState()
    const [endYear, setEndYear] = useState()

    const getData = (itemName) => {
        return fetch(itemName+'.json')
        .then(function(response){
            return response.json()
        })
        .then(function(json){
            if(json.results){
                console.log(json.results[0])
                const data = json.results[0]
                data.id = fileProduct
                setFileData(data)
                setFileDataSecond(data)
            } else {
                console.log(json)
                const data = json
                data.id = fileProduct
                setFileData(data)
                setFileDataSecond(data)
            }
        })
    }
    const getDataXML = (itemName) => {
        console.log(itemName+'.xml')
        fetch(itemName+'.xml')
        .then(response => response.text())
        .then(data => {
            parseString(data, function (err, result) {
                if(result.singleVariableData){
                    const x = result.singleVariableData.results[0].unitData[0]
                    x.id = fileProduct
                    x.name = x.name[0]
                    x.values = x.values[0].yearVal
                    x.values = x.values.map((item) => item = {
                        year: item.year[0],
                        val: parseFloat(item.val[0]),
                        attrId: parseInt(item.attrId[0])
                    })
                    setFileData(x)
                    setFileDataSecond(x)
                }
                if(result.root){
                    const x = result.root
                    x.id = fileProduct
                    x.name = x.name[0]
                    x.values = x.values.map((item) => item = {
                        year: item.year[0],
                        val: parseFloat(item.val[0]),
                        attrId: parseInt(item.attrId[0])
                    })
                    setFileData(x)
                    setFileDataSecond(x)
                }
            });
        })

    }
    
    useEffect(() => {
        if(fileData.values.length>0){
            if(!beginYear && !endYear){
                setBeginYear(fileData.values[0].year)
                setEndYear(fileData.values[fileData.values.length - 1].year)
                console.log("x")
            }
        }     
    }, [fileData])

    useEffect(() => {
        if(fileData.values.length>0){
            if(beginYear && endYear){
                let dat = fileDataSecond.values.filter((obj) => obj.year>=beginYear)
                dat = dat.filter((obj) => obj.year<=endYear)
                setFileData({ ...fileDataSecond, values: [...dat] });
                console.log("xx")
            }
        }     
    }, [beginYear, endYear])
    
    const handleImportJson = () => {
        getData(fileProduct)
    }
    const handleExportJson = async () => {
        var blob = new Blob([JSON.stringify(fileData)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileProduct+'.json');
    }
    const handleImportXml = () => {
        getDataXML(fileProduct)
    }
    const handleExportXml = () => {
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(fileData);
        console.log(xml)
        var blob = new Blob([xml], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileProduct+'.xml')
    }
    const handleImportDb = async () => {
        try {
            const data = await axios.post('http://localhost:8080/api/item/import', {
                product: fileProduct
            })
            setFileData(data.data)
            setFileDataSecond(data.data)
            console.log("Pobrano dane Mongo")
            alert("Zaimportowano dane z bazy!")
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
            alert("Zapisano dane w bazie!")
        } catch (e) {
            alert(e.response.data.message)
            console.log(e)
        }
    }
    const handleImportAPI = async () => {

    }

    const handleExportAPI = async () => {
        
    }

    const handleLog = () => {
        console.log(fileData)
        console.log(fileDataSecond)
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
                            <h2>Operacje na bazie danych*</h2>
                            <button className={styles.gray_btn} onClick = {handleImportDb}>Importuj SQL</button>
                            <button className={styles.gray_btn} onClick = {handleExportDb}>Eksportuj SQL</button>
                        </div>
                        <div className={styles.file_buttons}>
                            <h2>Operacje na API i resetowanie danych*</h2>
                            <button className={styles.gray_btn} onClick = {handleImportAPI}>Importuj API</button>
                            <button className={styles.gray_btn} onClick = {handleExportAPI}>Reset danych</button>
                        </div>
                    </div>
                }
                {fileData && fileData.values.length>0 &&
                    <div className={styles.select_box}>
                        <h2>Wybierz zakres lat</h2>
                        <div className={styles.select_box_2}>
                            <div className={styles.select_box_3}>
                                <h3>Data początkowa</h3>
                                <select className = {styles.select} onChange={e => setBeginYear(e.target.value)} on>
                                    {fileDataSecond.values
                                    .filter(obj => obj.year < endYear)
                                    .map(obj=>(
                                        <option key={obj.year} value = {obj.year}>{obj.year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.select_box_3}>
                                <h3>Data końcowa</h3>
                                <select className = {styles.select} onChange={e => setEndYear(e.target.value)}>
                                {fileDataSecond.values
                                .filter(obj => obj.year > beginYear)
                                .map(obj=>(
                                    <option selected key={obj.year} value = {obj.year}>{obj.year}</option>
                                ))}
                                </select>
                            </div>
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