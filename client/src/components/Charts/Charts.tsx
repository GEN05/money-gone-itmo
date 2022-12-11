import './Charts.css'
import React, {FC} from 'react';
import ChartDoughnut from "./ChartDoughnut/ChartDoughnut";
import ChartLine from "./ChartLine/ChartLine";


const Charts: FC = () => {
    return (
        <div className='charts'>
            <div className='chart-line-sizer'>
                <h2>Expenses chart</h2>
                <div className='chart-line'>
                    <div className='chart-line-wrapper '>
                        <ChartLine/>
                    </div>
                </div>
            </div>
            <div className='chart-doughnut-sizer'>
                <h2>Expense Categories</h2>
                <div className='chart-doughnut'>
                    <div className='chart-doughnut-wrapper'>
                        <ChartDoughnut/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;
