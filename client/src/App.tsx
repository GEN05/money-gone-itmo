import './App.css'
import React, {FC, useContext, useEffect} from 'react';
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import StartPage from "./components/StartPage/StartPage";
import Account from "./components/Account/Account";
import TransactionForm from "./components/TransactionForm/TransactionForm";
import TransactionList from "./components/TransactionList/TransactionList";
import Charts from "./components/Charts/Charts";

import { Chart, registerables} from 'chart.js';
import { Bar } from 'react-chartjs-2';
Chart.register(...registerables);

const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
}
const options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
}


const App: FC = () => {
    const {store} = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    if (store.isLoading) {
        return <div>Loading...</div>
    }

    if (!store.isAuth) {
        return (
            <div className='main-window'>
                <StartPage/>
            </div>
        );
    }

    return (
        <div className='main-window'>
            <div className='first-window'>
                <h1>My Dashboard</h1>
                <Charts/>
                {/*<div className='charts'>*/}
                {/*    <Bar data={data} options={options}/>*/}
                {/*</div>*/}
            </div>
            <div className='second-window'>
                <Account/>
                <TransactionForm/>
                <TransactionList/>
            </div>
        </div>
    );
};

export default observer(App);
