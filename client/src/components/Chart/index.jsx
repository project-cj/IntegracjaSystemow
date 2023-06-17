import styles from "./styles.module.css"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Line } from 'react-chartjs-2';
import { CategoryScale, LinearScale, Chart, PointElement, LineElement} from "chart.js";

const Charts = (props) => {
    Chart.register(CategoryScale);
    Chart.register(LinearScale);
    Chart.register(PointElement)
    Chart.register(LineElement)
    const item = props.data.values
    const labels = item.map((it) => it.year)
    const values = item.map((it) => it.val)

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Dane",
                data: values,
                backgroundColor: 'rgba(0,0,0,1)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1
            }
        ]
    }
    const options = {
        scales: {
          x: {
            type: 'category',
          },
        },
      };
    //main
    const handleS = () => {
        console.log(item)
        console.log(labels)
    }
    return (
        <div className={styles.main_container}>
            <Line data={data}></Line>
        </div>
    )
}

export default Charts

/*
    {data.map((item, key) => <p key={key}>Rok: {item.year} Cena: {item.val}</p>)}
    <button onClick={handleS}>X</button>
*/