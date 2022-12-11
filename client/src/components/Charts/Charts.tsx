import "./Charts.css";
import React, { FC, useContext } from "react";
import ChartDoughnut from "./ChartDoughnut/ChartDoughnut";
import ChartLine from "./ChartLine/ChartLine";
import { dateHumanReadableMonthYear } from "../helper";
import { Context } from "../../index";

const Charts: FC = () => {
  const { store } = useContext(Context);
  const isAnyTransaction =
    store.user.transactions.length > 0 ||
    store.user.transactionsFromBank.length > 0;

  return (
    <div className="charts">
      <div className="chart-line-sizer">
        <h2>{`${dateHumanReadableMonthYear(new Date(), true)} expenses`}</h2>
        <div className="chart-line">
          <div className="chart-line-wrapper ">
            {isAnyTransaction ? (
              <ChartLine />
            ) : (
              <div className="empty-chart">Waiting for transactions</div>
            )}
          </div>
        </div>
      </div>
      <hr />
      <div className="chart-doughnut-sizer">
        <h2>Expense Categories</h2>
        <div className="chart-doughnut">
          <div className="chart-doughnut-wrapper">
            {isAnyTransaction ? (
              <ChartDoughnut />
            ) : (
              <span className="empty-chart">Waiting for transactions</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
