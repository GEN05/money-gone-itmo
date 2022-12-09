import React, {FC, useContext, useEffect} from 'react';
import LoginForm from "./components/LoginForm";
import TransactionForm from "./components/TransactionForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import TransactionList from "./components/TransactionList";

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
            <div>
                <LoginForm/>
            </div>
        );
    }

    return (
        <div>
            <h1>{store.isAuth ? `Welcome ${store.user.firstName} ${store.user.lastName}` : 'Please log in'}</h1>
            <h1>{store.user.isActivated ? `Account confirmed with ${store.user.email}` : `Please confirm account with ${store.user.email}`}</h1>
            <button onClick={() => store.logout()}>log out</button>

            <TransactionForm/>
            <TransactionList/>

        </div>
    );
};

export default observer(App);
