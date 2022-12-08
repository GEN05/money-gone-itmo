import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import TransactionForm from "./components/TransactionForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";
import TransactionList from "./components/TransactionList";

const App: FC = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (store.isLoading) {
        return <div>Загрузка...</div>
    }

    if (!store.isAuth) {
        return (
            <div>
                <LoginForm/>
                <button onClick={getUsers}>Получить пользователей</button>
            </div>
        );
    }

    return (
        <div>
            <h1>{store.isAuth ? `Добро пожаловать ${store.user.firstName} ${store.user.lastName}` : 'АВТОРИЗУЙТЕСЬ'}</h1>
            <h1>{store.user.isActivated ? `Аккаунт подтвержден по почте ${store.user.email}` : `ПОДТВЕРДИТЕ АККАУНТ!!!! ${store.user.email}`}</h1>
            <button onClick={() => store.logout()}>Выйти</button>

            <TransactionForm/>

            <TransactionList/>

            <div>
                <button onClick={getUsers}>Получить пользователей</button>
            </div>
            {users.map(user =>
                <div id={user.email}>{user.email}</div>
            )}
        </div>
    );
};

export default observer(App);
