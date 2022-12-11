import "./TransactionList.css"
import React, {FC, useContext, useState} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {dateHumanReadableFull, numberWithCommas} from "../helper"
import {categoryImgs, categoryTinkoffImgs, categoryTitles} from "../../images/categories";
import {ReactComponent as DeleteIcon} from "../../images/delete.svg";

interface TransactionListProps {
    trnsList: string,
}

const TransactionList: FC<TransactionListProps> = ({trnsList}) => {
    const {store} = useContext(Context);
    const [activeTrns, setActiveTrns] = useState<string>("");

    // console.log(`in list ${trnsList}`)

    if (!store.isAuth) {
        return null;
    }

    if (!store.user.transactionsFromBank || store.user.transactionsFromBank.length === 0) {
        return <div className="transactions"><span>ADD NEW TRANSACTION!</span></div>
    }

    return (
        <div className="transactions">
            {trnsList === "cash" && [...store.user.transactions].reverse().map(trns => {
                    return (
                        <div
                            id={trns.id}
                            key={trns.id}
                            className={"transaction" + (activeTrns === trns.id ? " cursor-disabled" : "")}
                            tabIndex={1}
                            onFocus={() => setActiveTrns(trns.id)}
                            onBlur={() => setActiveTrns("")}
                        >
                            <img
                                className="transaction_category_img"
                                src={categoryImgs[trns.category] || categoryImgs["other"]}
                                alt={trns.category}
                            />

                            <div className="transaction_info">
                                    <span className="transaction_category">
                                        {categoryTitles[trns.category] || "Other"}
                                    </span>
                                <span>
                                        {dateHumanReadableFull(new Date(trns.date))}
                                    </span>
                            </div>

                            <span className="transaction_value">
                                    {`-$${numberWithCommas(trns.value)}`}
                                </span>

                            {activeTrns === trns.id &&
                            <DeleteIcon
                                className="transaction_delete"
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
            )}
            {trnsList === "bank" && [...store.user.transactionsFromBank].reverse().map(trns => {
                    return (
                        <div
                            id={trns.id}
                            key={trns.id}
                            className={"transaction cursor-disabled"}
                        >
                            <img
                                className="transaction_category_img"
                                src={categoryTinkoffImgs[trns.category] || categoryImgs["other"]}
                                alt={trns.category}
                            />

                            <div className="transaction_info">
                                <span className="transaction_category">
                                    {categoryTitles[trns.category] || "Other"}
                                </span>
                                <span>
                                    {dateHumanReadableFull(new Date(trns.date))}
                                </span>
                            </div>

                            <span className="transaction_value">
                                {`-$${numberWithCommas(trns.value)}`}
                            </span>
                        </div>
                    );
                }
            )}
        </div>
    );
};

export default observer(TransactionList);
