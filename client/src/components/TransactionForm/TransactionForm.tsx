import "./TransactionForm.css";
import React, {FC, useContext, useState} from "react";
import Select from "react-select";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {ReactComponent as CancelIcon} from "./close.svg";
import {ReactComponent as SaveIcon} from "./send.svg";
import {ReactComponent as AddIcon} from "./add.svg";
import {ReactComponent as InfoIcon} from "./info.svg";

export type TrnsType = { date: number; category: string; value: number };

type TrnsRawType = { date: string; currency: string; category: string; mcc: string; value: string; status: string };

const selectOptions = [
    {value: "supermarket", label: "Supermarket 🛒"},
    {value: "cafe", label: "Cafes ☕"},
    {value: "shopping", label: "Shopping 🛍️"},
    {value: "transport", label: "Transport 🚕"},
    {value: "other", label: "Other 🤷‍♂"},
];

interface TransactionFormProps {
    trnsList: string,
    setTrnsList: React.Dispatch<React.SetStateAction<string>>,
}

const TransactionForm: FC<TransactionFormProps> = ({trnsList, setTrnsList}) => {
    const [state, setState] = useState<string>("default");
    const [category, setCategory] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const [trnsFromFile, setTrnsFromFile] = useState<TrnsType[]>([]);
    const {store} = useContext(Context);

    // console.log(`in form ${trnsList}`)

    if (!store.isAuth) {
        return null;
    }

    const getTrnsFormCash = () => (
        <div>
            <hr/>
            <div className="transaction-form_active">
                <div className="transaction-form_inputs">
                    <Select
                        className="transaction-form_select"
                        options={selectOptions}
                        placeholder="Category"
                        value={category === "" ? null : this}
                        onChange={e => setCategory(e?.value || "other")}
                    />
                    <input
                        className="transaction-form_input"
                        onChange={e => setValue(e.target.value)}
                        value={value}
                        type="number"
                        placeholder="0 $"
                    />
                </div>
                <div className="transaction-form_icons">
                    <SaveIcon
                        className="transaction-form_submit"
                        onClick={() => {
                            let val: number = Math.abs(Number(value));
                            if (isNaN(val) || val === 0) {
                                alert("Incorrect transaction value");
                            } else {
                                console.log(val);
                                store.addTransaction(Date.now(), category, val);
                            }
                            setCategory("");
                            setValue("");
                        }}
                    />
                    <CancelIcon
                        className="transaction-form_close"
                        onClick={() => {
                            setState("default");
                            setCategory("");
                            setValue("");
                        }}
                    />
                </div>
            </div>
            <hr/>
        </div>
    );

    const getTrnsFormBank = () => {

        const CSVToArray = (strData: string, strDelimiter: string = ";") => {
            // Create a regular expression to parse the CSV values.
            let objPattern = new RegExp(
                (
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
                ),
                "gi"
            );
            // Create an array to hold our data. Give the array
            // a default empty first row.
            let arrData: (string | undefined)[][] = [[]];
            // Create an array to hold our individual pattern
            // matching groups.
            let arrMatches = null;
            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec(strData)) {
                // Get the delimiter that was found.
                let strMatchedDelimiter = arrMatches[1];
                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push([]);
                }
                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                let strMatchedValue = "";
                if (arrMatches[2]) {
                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
                } else {
                    // We found a non-quoted value.
                    strMatchedValue = arrMatches[3];
                }
                // Now that we have our value string, let's add
                // it to the data array.
                // @ts-ignore
                arrData[arrData.length - 1].push(strMatchedValue);
            }
            return arrData;
        };

        const parseTrnsList = (parsedCSV: (string | undefined)[][]): TrnsType[] => {
            const dateIndex = parsedCSV[0].findIndex(t => t === "Дата операции");
            const statusIndex = parsedCSV[0].findIndex(t => t === "Статус");
            const valueIndex = parsedCSV[0].findIndex(t => t === "Сумма операции");
            const currencyIndex = parsedCSV[0].findIndex(t => t === "Валюта операции");
            const categoryIndex = parsedCSV[0].findIndex(t => t === "Категория");
            const mccIndex = parsedCSV[0].findIndex(t => t === "MCC");
            // console.log(dateIndex, statusIndex, valueIndex, currencyIndex, categoryIndex, mccIndex);

            const parseTrns = (trns: TrnsRawType): TrnsType | null => {
                const [date, time]: string[] = trns.date.split(" ");
                const validTime: number = Number(new Date(date.split('.').reverse().join("-") + "T" + time));
                // console.log(Number(new Date(validTime)));
                // console.log(new Date(Number(new Date(validTime))));

                const supermarket = ["Аптеки", "Канцтовары", "Дом, ремонт", "Супермаркеты"];
                const cafe = ["Рестораны", "Фастфуд"];
                const shopping = ["Duty Free", "Дьюти-фри", "Книги", "Косметика", "Красота", "Одежда, обувь, ювелирные изделия и часы", "Одежда, обувь", "Спорттовары", "Сувениры"];
                const transport = ["Авиабилеты", "Аренда авто", "Ж/д билеты", "Каршеринг", "Местный транспорт", "Платные дороги", "Такси", "Топливо", "Транспорт"];

                let validCategory: string;
                if (supermarket.includes(trns.category)) validCategory = "supermarket";
                else if (cafe.includes(trns.category)) validCategory = "cafe";
                else if (shopping.includes(trns.category)) validCategory = "shopping";
                else if (transport.includes(trns.category)) validCategory = "transport";
                else validCategory = "other";

                let validValue: number;
                if (trns.currency === "USD") validValue = Math.abs(Number(trns.value));
                else if (trns.currency === "EUR") validValue = Math.abs(Number(trns.value)) * 1.1;
                else if (trns.currency === "RUB") validValue = Math.abs(Number(trns.value)) / 78;
                else validValue = NaN;

                if (Number.isNaN(validTime) || Number.isNaN(validValue)) {
                    return null;
                }

                return {date: validTime, category: validCategory, value: validValue};
            };

            const validTrns: TrnsRawType[] = parsedCSV
                .splice(1)
                .filter(
                    (trns): trns is string[] =>
                        trns[valueIndex] !== undefined &&
                        trns[statusIndex] !== 'FAILED' &&
                        trns[statusIndex] !== undefined &&
                        trns[valueIndex] !== undefined &&
                        trns[currencyIndex] !== undefined &&
                        trns[categoryIndex] !== undefined &&
                        trns[mccIndex] !== undefined
                )
                .map(trns => ({
                    date: trns[dateIndex],
                    status: trns[statusIndex],
                    value: trns[valueIndex].split(",").join("."),
                    currency: trns[currencyIndex],
                    category: trns[categoryIndex],
                    mcc: trns[mccIndex],
                }));

            return validTrns.map(parseTrns).filter((trns): trns is TrnsType => trns !== null).reverse();
        };

        const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
            try {
                if (!e.target.files) return;
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.readAsText(file, "WINDOWS-1251");
                reader.onload = function () {
                    if (typeof reader.result === "string") {
                        const parsedCSV = CSVToArray(reader.result);
                        const parsedTrns = parseTrnsList(parsedCSV);
                        setTrnsFromFile(parsedTrns);
                        console.log(parsedTrns);
                    }
                };
                reader.onerror = function () {
                    alert("File read failed");
                    console.log(reader.error);
                }
            } catch (e) {
                alert("File upload failed");
                console.log(e);
            }
        };

        return (
            <div>
                <hr/>
                <div className="transaction-form_active">
                    <input
                        onChange={handleFileSelected}
                        type="file"
                        id="file"
                        accept="text/csv"
                    />
                    <div className="tooltip">
                        <InfoIcon className="transaction-form_info"/>
                        <span className="tooltiptext">
                            {"Download bank statement in csv format "}
                            <a target="_blank"
                               rel="noreferrer"
                               href="https://www.tinkoff.ru/events/feed/?preset=all"
                            >
                                *click*
                            </a>
                        </span>
                    </div>
                    <SaveIcon
                        className="transaction-form_submit"
                        onClick={() => {
                            if (trnsFromFile.length !== 0) {
                                try {
                                    store.addTransactionsFromBank(trnsFromFile);
                                } catch (e) {
                                    alert("Failed send your csv");
                                }
                            }
                        }}
                    />
                    <CancelIcon
                        className="transaction-form_close"
                        onClick={() => setState("default")}
                    />
                </div>
                <hr/>
            </div>
        )
    };

    const getTrnsFormDefault = () => (
        <div className="transaction-form_default">
            <h1>Transactions</h1>
            <div className="toggle-wrapper">
                <input
                    type="radio"
                    name="select"
                    id="option-1"
                    checked={trnsList === "cash"}
                    onChange={() => setTrnsList("cash")}
                />
                <input
                    type="radio"
                    name="select"
                    id="option-2"
                    checked={trnsList === "bank"}
                    onChange={() => setTrnsList("bank")}
                />
                <label htmlFor="option-1" className="option option-1">
                    <span>Cash</span>
                </label>
                <label htmlFor="option-2" className="option option-2">
                    <span>Bank</span>
                </label>
            </div>
            <AddIcon
                className="transaction-form_add"
                onClick={() => setState("active")}
            />
            {/*<button onClick={() => setState("active")}>+</button>*/}
        </div>
    );

    return (
        <div className="transaction-form-wrapper">
            {state === "active" && trnsList === "cash" && getTrnsFormCash()}
            {state === "active" && trnsList === "bank" && getTrnsFormBank()}
            {state === "default" && getTrnsFormDefault()}
        </div>
    );
};

export default observer(TransactionForm);
