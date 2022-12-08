import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const TransactionForm: FC = () => {
    const [category, setCategory] = useState<string>('')
    const [value, setValue] = useState<string>('')
    const {store} = useContext(Context);


    return (
        <div>
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
            <button onClick={() => store.addTransaction(Date.now(), category, Number(value))}>
                Add transaction
            </button>
        </div>
    );
};

export default observer(TransactionForm);
