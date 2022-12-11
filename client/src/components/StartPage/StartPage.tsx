import "./StartPage.css"
import React, {FC, useContext, useState} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import avatarCat from "../../images/avatar-cat.png"
import avatarDog from "../../images/avatar-dog.png"
import {Link, useLocation, useNavigate} from "react-router-dom";

const StartPage: FC = () => {
    const {store} = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();

    const [state, setState] = useState<string>("login");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("dog");
    const [newEmail, setNewEmail] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    function signInPage() {
        return (
            <div className="startpage-form">
                <div className="startpage-actions">
                    <span
                        className="startpage-action"
                        onClick={() => setState("login")}
                    >
                        <b>Sign in</b>
                    </span>
                    <span
                        className="startpage-action"
                        onClick={() => setState("register")}
                    >
                        Sign up
                    </span>
                </div>
                <div className="startpage-data">
                    <input
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Email"
                    />
                    <input
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        name="password"
                        autoComplete="password"
                        placeholder="Password"
                    />
                    <Link
                        to="/request-reset"
                    >
                        forgot password?
                    </Link>
                    <button
                        onClick={async () => {
                            await store.login(email, password);
                            // @ts-ignore
                            if (location.state?.from) {
                                // @ts-ignore
                                navigate(location.state.from);
                            }

                            navigate("/profile");
                        }}
                    >
                        log in
                    </button>
                </div>
            </div>
        )
    }

    function signUpPage() {
        return (
            <div className="startpage-form">
                <div className="startpage-actions">
                    <span
                        className="startpage-action"
                        onClick={() => setState("login")}>
                        Sign in
                    </span>
                    <span
                        className="startpage-action"
                        onClick={() => setState("register")}>
                        <b>Sign up</b>
                    </span>
                </div>
                <div className="startpage-data">
                    <input
                        onChange={e => setFirstName(e.target.value)}
                        value={firstName}
                        type="text"
                        name="firstName"
                        autoComplete="name"
                        placeholder="First Name"
                    />
                    <input
                        onChange={e => setLastName(e.target.value)}
                        value={lastName}
                        type="text"
                        name="lastName"
                        autoComplete="name"
                        placeholder="Last Name"
                    />
                    <p>Choose profile picture</p>
                    <div className="avatars">
                        <div className="avatar-input">
                            <input
                                onChange={(e) => {setAvatar(e.target.value); console.log(e.target.value)}}
                                type="radio"
                                id="avatarDog"
                                value="dog"
                                checked={avatar === "dog"}
                            />
                            <label htmlFor="avatarDog">
                                <img className="avatar" src={avatarDog} alt="Dog avatar"/>
                            </label>
                        </div>
                        <div className="avatar-input">
                            <input
                                onChange={(e) => {setAvatar(e.target.value); console.log(e.target.value)}}
                                type="radio"
                                id="avatarCat"
                                value="cat"
                                checked={avatar === "cat"}
                            />
                            <label htmlFor="avatarCat">
                                <img className="avatar" src={avatarCat} alt="Cat avatar"/>
                            </label>
                        </div>
                    </div>
                    <input
                        onChange={e => setNewEmail(e.target.value)}
                        value={newEmail}
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Email"
                    />
                    <input
                        onChange={e => setNewPassword(e.target.value)}
                        value={newPassword}
                        type="password"
                        name="password"
                        autoComplete="off"
                        placeholder="Password"
                    />
                    <button onClick={() => store.registration(newEmail, newPassword, firstName, lastName, avatar)}>
                        register
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="startpage">
            {state === "login" && signInPage()}
            {state === "register" && signUpPage()}
        </div>
    );
};

export default observer(StartPage);
