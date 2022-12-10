import './TransactionList.css'
import React, {FC, useContext, useState} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {dateHumanReadable, numberWithCommas} from '../helper'
import {categoryImgs, categoryTitles} from "./categories";
import {ReactComponent as DeleteIcon} from './delete.svg';


const TransactionList: FC = () => {
    const {store} = useContext(Context);
    const [activeTrns, setActiveTrns] = useState<string>('')

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
                            <div
                                id={trns.id}
                                className={'transaction' + (activeTrns === trns.id ? ' cursor-disabled' : '')}
                                tabIndex={1}
                                onFocus={() => setActiveTrns(trns.id)}
                                onBlur={() => setActiveTrns('')}
                            >
                                <img
                                    className='transaction_category_img'
                                    src={categoryImgs[trns.category] || categoryImgs['other']}
                                    alt={trns.category}
                                />

                                <div className='transaction_info'>
                                    <span className='transaction_category'>
                                        {categoryTitles[trns.category]}
                                    </span>
                                    <span>
                                        {dateHumanReadable(new Date(trns.date))}
                                    </span>
                                </div>

                                <span className='transaction_value'>
                                    {`-$${numberWithCommas(trns.value)}`}
                                </span>

                                {activeTrns === trns.id &&
                                    <DeleteIcon
                                        className='transaction_delete'
                                        onClick={(e) => {
                                            if (e.currentTarget.parentElement?.id) {
                                                store.deleteTransaction(e.currentTarget.parentElement.id)
                                            }
                                        }}
                                    />
                                }
                            </div>
                        );
                    }
                )
            }
        </div>
    );
}

export default observer(TransactionList);
