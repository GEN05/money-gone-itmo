import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const {store} = useContext(Context);


    return (
        <div>
            <input
                onChange={e => setFirstName(e.target.value)}
                value={firstName}
                type="text"
                placeholder='First Name'
            />
            <input
                onChange={e => setLastName(e.target.value)}
                value={lastName}
                type="text"
                placeholder='Last Name'
            />
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder='Email'
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='Password'
            />
            <button onClick={() => store.login(email, password)}>
                log in
            </button>
            <button onClick={() => store.registration(email, password, firstName, lastName)}>
                register
            </button>
        </div>
    );
};

export default observer(LoginForm);
