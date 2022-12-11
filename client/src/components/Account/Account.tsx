import "./Account.css"
import React, {FC, useContext} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import avatarCat from "../../images/avatar-cat.png"
import avatarDog from "../../images/avatar-dog.png"
import {dateHumanReadableFull, numberWithCommas} from "../helper"

type mapAvatarType = {
    [key: string]: string;
};

const mapAvatar: mapAvatarType = {
    "cat" : avatarCat,
    "dog" : avatarDog,
}

const Account: FC = () => {
    const {store} = useContext(Context);

    if (!store.user.transactions) {
        return null
    }

    return (
        <div className="account">
            <div className="account_info">
                <span className="account_balance">
                    {`$ ${numberWithCommas(store.user.transactions.reduce((acc, t) => acc + t.value, 0))}`}
                </span>
                <span>
                    {dateHumanReadableFull(new Date(), true)}
                </span>
            </div>
            <div className="user_info">
                <img className="avatar" src={mapAvatar[store.user.avatar]}/>
                <div className="user_info_actions">
                    <span className="user_info_name">
                        {store.user.firstName} {store.user.lastName}
                    </span>
                    <span
                        className="email-verification">
                        {store.user.isActivated ? `email verified` : `verify email!!!`}
                    </span>
                    <button onClick={() => store.logout()}>
                        log out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default observer(Account);
