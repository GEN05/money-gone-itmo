import './TransactionForm.css'
import React, {FC, useContext, useState} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

const TransactionForm: FC = () => {
    const [state, setState] = useState<string>('default')
    const [category, setCategory] = useState<string>('')
    const [value, setValue] = useState<string>('')
    const {store} = useContext(Context);

    if (!store.isAuth) {
        return null;
    }

    return (
        <div className='transaction-form'>
            {state === 'active' &&
                <div className='transaction-form_active'>
                    <div className='transaction-form_input'>
                        <input
                            onChange={e => setCategory(e.target.value)}
                            value={category}
                            type="text"
                            placeholder='category'
                        />
                        <input
                            onChange={e => setValue(e.target.value)}
                            value={value}
                            type="text"
                            placeholder='$$$'
                        />
                    </div>
                    <button className='transaction-form_submit'
                            onClick={() => store.addTransaction(Date.now(), category, Number(value))}>
                        Add transaction
                    </button>
                    <span className='transaction-form_close' onClick={() => setState('default')}>✖</span>
                </div>
            }

            {state === 'default' &&
                <div className='transaction-form_default'>
                    <h1>Transactions</h1>
                    <button onClick={() => setState('active')}>+</button>
                </div>
            }
        </div>
    );
};

export default observer(TransactionForm);
