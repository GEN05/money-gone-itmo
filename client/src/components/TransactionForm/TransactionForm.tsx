import './TransactionForm.css'
import React, {FC, useContext, useState} from 'react';
import Select from 'react-select'
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {ReactComponent as CancelIcon} from './cancel.svg';
import {ReactComponent as SaveIcon} from './save.svg';

const selectOptions = [
    {value: 'supermarket', label: 'Supermarket 🛒'},
    {value: 'cafe', label: 'Cafes ☕'},
    {value: 'shopping', label: 'Shopping 🛍️'},
    {value: 'transport', label: 'Transport 🚕'},
    {value: 'other', label: 'Other 🤷‍♂'},
]

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
                <div>
                    <hr/>
                    <div className='transaction-form_active'>
                        <div className='transaction-form_inputs'>
                            <Select
                                className='transaction-form_select'
                                options={selectOptions}
                                placeholder='Category'
                                value={category === '' ? null : this}
                                onChange={e => setCategory(e?.value || 'other')}
                            />
                            <input
                                className='transaction-form_input'
                                onChange={e => setValue(e.target.value)}
                                value={value}
                                type="number"
                                placeholder='0 €'
                            />
                        </div>
                        <CancelIcon
                            className='transaction-form_close'
                            onClick={() => setState('default')}
                        />
                        <SaveIcon
                            className='transaction-form_submit'
                            onClick={() => {
                                let val: number = Math.abs(Number(value))
                                if (isNaN(val) || val === 0) {
                                    alert('Incorrect transcation value')
                                } else {
                                    store.addTransaction(Date.now(), category, Math.abs(Number(value)))
                                }
                                setCategory('')
                                setValue('')
                            }}
                        />
                    </div>
                    <hr/>
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
