import React, {FC, useContext} from 'react';
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {Transaction} from "../../../models/IUser";
import {Line} from 'react-chartjs-2';
import {
    dateHumanReadableFull,
    dateHumanReadableMonth,
    dateHumanReadableMonthYear,
    dateToYYYYMM,
    dateToYYYYMMDD
} from "../../helper";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ScriptableLineSegmentContext
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const trnsToDataAndLabels = (trns: Transaction[]): [string[], number[]] => {
    const trnsMap = new Map<string, number>();
    const maxDate: string = dateToYYYYMMDD(new Date(Math.max(...trns.map(t => t.date))));
    const maxDay: number = Number(maxDate.split('-')[2]);

    for (let i = 1; i <= maxDay; i++) {
        const iDate =
            maxDate
                .split('-')
                .splice(0, 2)
                .join('-') + '-' + (i > 9 ? String(i) : '0' + String(i));
        trnsMap.set(iDate, NaN);
    }

    trns.forEach(t => {
        const formattedDate = dateToYYYYMMDD(new Date((new Date(t.date))));

        if (isNaN(trnsMap.get(formattedDate) || NaN)) {
            trnsMap.set(formattedDate, t.value)
        } else {
            // @ts-ignore
            trnsMap.set(formattedDate, trnsMap.get(formattedDate) + t.value)
        }
    });

    return [Array.from(trnsMap.keys()), Array.from(trnsMap.values())];
};

const skipped = (ctx: ScriptableLineSegmentContext, value: any) => ctx.p0.skip || ctx.p1.skip ? value : undefined;

const ChartLine: FC = () => {
    const {store} = useContext(Context);

    const curMonthTrns = [...store.user.transactions].filter(t => dateToYYYYMM(new Date()) === dateToYYYYMM(new Date(t.date)))
    const [labels, trnsData]: [string[], number[]] = trnsToDataAndLabels(curMonthTrns);
    const data = {
        labels,
        datasets: [
            {
                label: 'Expenses in ' + dateHumanReadableMonthYear(new Date()),
                data: trnsData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                segment: {
                    borderColor: (ctx: ScriptableLineSegmentContext) => skipped(ctx, 'rgb(0,0,0,0.2)'),
                    borderDash: (ctx: ScriptableLineSegmentContext) => skipped(ctx, [6, 6]),
                },
                spanGaps: true
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: (tooltipItems: any) => dateHumanReadableFull(new Date(tooltipItems[0].label)),
                    label: (tooltipItem: any) => 'Spent ' + tooltipItem.formattedValue + ' $',
                }
            },
        },
    };

    return (
        <Line data={data} options={options}/>
    );
};

export default observer(ChartLine);
