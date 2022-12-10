import './TransactionList.css'
import React, {FC, useContext} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {dateHumanReadable, numberWithCommas} from '../helper'

const TransactionList: FC = () => {
    const {store} = useContext(Context);

    if (!store.isAuth) {
        return null;
    }

    // @ts-ignore
    if (!store.user.transactions || store.user.transactions.length === 0) {
        return <div className='transactions'><span>NO TRANSACTIONS FOUND</span></div>
    }

    return (
        <div className='transactions'>
            {
                [...store.user.transactions].reverse().map(trns => {
                        return (
                            <div id={trns.id} className='transaction'>
                                <div className='transaction_info'>
                                    <span className='transaction_category'>
                                        {trns.category}
                                    </span>
                                    <span>
                                        {dateHumanReadable(new Date(trns.date))}
                                    </span>
                                </div>
                                <span className='transaction_value'>
                                    {`-$${numberWithCommas(trns.value)}`}
                                </span>
                                <span className='transaction_delete' onClick={(e) => {
                                    if (e.currentTarget.parentElement?.id) {
                                        store.deleteTransaction(e.currentTarget.parentElement.id)
                                    }
                                }}>
                                    ❌
                                </span>
                            </div>
                        );
                    }
                )
            }
        </div>
    );
}

export default observer(TransactionList);
