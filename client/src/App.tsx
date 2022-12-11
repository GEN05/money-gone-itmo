import "./App.css"
import React, {FC, useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import StartPage from "./components/StartPage/StartPage";
import Account from "./components/Account/Account";
import TransactionForm from "./components/TransactionForm/TransactionForm";
import TransactionList from "./components/TransactionList/TransactionList";
import Charts from "./components/Charts/Charts";

import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

const App: FC = () => {
    const {store} = useContext(Context);
    const [trnsList, setTrnsList] = useState<string>("cash");

    useEffect(() => {
        if (localStorage.getItem("token")) {
            store.checkAuth()
        }
    }, [store])

    if (store.isLoading) {
        return (
            <div className="loader-box">
                <div className="loader"/>
            </div>)
    }

    if (!store.isAuth) {
        return (
            <div className="main-window">
                <StartPage/>
            </div>
        );
    }

    return (
        <div className="main-window">
            <div className="dashboard-window">
                <h1>My Dashboard</h1>
                <Charts/>
            </div>
            <div className="transactions-window">
                <Account/>
                <TransactionForm trnsList={trnsList} setTrnsList={setTrnsList}/>
                <TransactionList trnsList={trnsList}/>
            </div>
        </div>
    );
};

export default observer(App);
