import React, {FC, useContext} from 'react';
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";

import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import {dateHumanReadableMonth, numberWithCommas} from "../../helper";

ChartJS.register(ArcElement, Tooltip, Legend);


const ChartDoughnut: FC = () => {
    const {store} = useContext(Context);

    const categories = ['supermarket', 'cafe', 'shopping', 'transport', 'other'];
    const categoriesTotalValue: number[] = [];

    categories.forEach(category => {
        const categoryTotalValue = [...store.user.transactions]
            .filter(t => t.category === category)
            .map(t => t.value)
            .reduce((a, b) => a + b, 0);
        categoriesTotalValue.push(categoryTotalValue)
    });

    const data = {
        labels: categories,
        datasets: [
            {
                label: '# of Votes',
                data: categoriesTotalValue,
                backgroundColor: [
                    'rgba(178, 210, 53, 0.6)',
                    'rgba(249, 95, 48, 0.6)',
                    'rgba(234, 92, 129, 0.6)',
                    'rgba(0, 170, 173, 0.6)',
                    'rgba(242, 178, 0, 0.6)',
                ],
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: (tooltipItems: any) => tooltipItems[0].label,
                    label: (tooltipItem: any) => 'Spent: ' + tooltipItem.formattedValue + ' $',
                    footer: (tooltipItems: any) => (
                        'Total percentage: ' +
                        numberWithCommas(tooltipItems[0].parsed / categoriesTotalValue.reduce((acc, val) => acc + val, 0) * 100) + '%'),
                }
            },
        },
    };

    return (
        <Doughnut data={data} options={options}/>
    );
};

export default observer(ChartDoughnut);
