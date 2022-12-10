import './App.css'
import React, {FC, useContext, useEffect} from 'react';
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import StartPage from "./components/StartPage/StartPage";
import Account from "./components/Account/Account";
import TransactionForm from "./components/TransactionForm/TransactionForm";
import TransactionList from "./components/TransactionList/TransactionList";

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
            <StartPage/>
        );
    }

    return (
        <div className='main-window'>
            <div className='first-window'>
                <h1>HERE WILL BE STATISTICS</h1>
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
