import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const TransactionList: FC = () => {
    const {store} = useContext(Context);

    if (!store.isAuth) {
        return null;
    }

    if (!store.user.transactions) {
        return <div><span>NO TRANSACTIONS FOUND</span></div>
    }

    return (
        <div>
            {
                store.user.transactions.map(trns => {
                    return (
                            <div id={trns.id}>
                                {`(${(new Date(trns.date)).toLocaleDateString("en-GB")}) ${trns.category}: ${trns.value}`}
                                <button onClick={(e) => {
                                    // @ts-ignore
                                    store.deleteTransaction(e.currentTarget.parentElement.id)}
                                }>X</button>
                            </div>
                        );
                    }
                )
            }
        </div>
    );
}

export default observer(TransactionList);
