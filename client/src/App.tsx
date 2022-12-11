import "./App.css"
import React, {FC, useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {Navigate, useLocation} from "react-router-dom";
import {observer} from "mobx-react-lite";
import Account from "./components/Account/Account";
import TransactionForm from "./components/TransactionForm/TransactionForm";
import TransactionList from "./components/TransactionList/TransactionList";

import Charts from "./components/Charts/Charts";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

const App: FC = () => {
    const {store} = useContext(Context);
    const location = useLocation();

    const [trnsList, setTrnsList] = useState<string>("cash");

    useEffect(() => {
        store.checkAuth();
    }, [store]);

    if (store.isLoading) {
        return (
            <div className="loader-box">
                <div className="loader"/>
            </div>)
    }

    if (!store.isAuth) {
        return <Navigate to="/login" replace state={{from: location}}/>
    }

    return (
        <div className="main-window">
            <div className="dashboard-window">
                <h1>My Dashboard</h1>
                <Charts/>
            </div>
            <hr/>
            <div className="transactions-window">
                <Account/>
                <TransactionForm trnsList={trnsList} setTrnsList={setTrnsList}/>
                <TransactionList trnsList={trnsList}/>
            </div>
        </div>
    );
};

export default observer(App);
