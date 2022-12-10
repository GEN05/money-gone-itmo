import './StartPage.css'
import React, {FC, useContext, useState} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

const StartPage: FC = () => {
    const [state, setState] = useState<string>('login')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const {store} = useContext(Context);

    function signInPage() {
        return (
            <div className='startpage-form'>
                <div className='startpage-actions'>
                    <span className='startpage-action' onClick={() => setState('login')}><b>Sign in</b></span>
                    <span className='startpage-action' onClick={() => setState('register')}>Sign up</span>
                </div>
                <div className='startpage-data'>
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
                </div>
            </div>
        )
    }

    function signUpPage() {
        return (
            <div className='startpage-form'>
                <div className='startpage-actions'>
                    <span className='startpage-action' onClick={() => setState('login')}>Sign in</span>
                    <span className='startpage-action' onClick={() => setState('register')}><b>Sign up</b></span>
                </div>
                <div className='startpage-data'>
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
                    <button onClick={() => store.registration(email, password, firstName, lastName)}>
                        register
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='startpage'>
            {state === 'login' && signInPage()}
            {state === 'register' && signUpPage()}
        </div>
    );
};

export default observer(StartPage);
