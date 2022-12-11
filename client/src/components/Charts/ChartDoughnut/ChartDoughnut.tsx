import React, { FC, useContext } from "react";
import { Context } from "../../../index";
import { observer } from "mobx-react-lite";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { numberWithCommas, trnsFromLastMonth } from "../../helper";
import { categoryTitles, CategoryType } from "../../../images/categories";

ChartJS.register(ArcElement, Tooltip, Legend);

const colorByCategory: CategoryType = {
  supermarket: "rgba(178, 210, 53, 0.6)",
  cafe: "rgba(249, 95, 48, 0.6)",
  shopping: "rgba(234, 92, 129, 0.6)",
  transport: "rgba(0, 170, 173, 0.6)",
  other: "rgba(242, 178, 0, 0.6)",
};

const ChartDoughnut: FC = () => {
  const { store } = useContext(Context);

  const allCategories = [
    "supermarket",
    "cafe",
    "shopping",
    "transport",
    "other",
  ];
  // colors used for each category in last month
  const lastMonthColors: string[] = [];
  // all categories encountered in the last month
  const lastMonthCategories: string[] = [];
  // expenses per category in the last month
  const lastMonthCategoriesValue: number[] = [];

  const { cashLastMonth, cardLastMonth } = trnsFromLastMonth(
    store.user.transactions,
    store.user.transactionsFromBank
  );

  allCategories.forEach((category) => {
    const categoryTotalValue = [...cashLastMonth, ...cardLastMonth]
      .filter((t) => t.category === category)
      .map((t) => t.value)
      .reduce((a, b) => a + b, 0);
    if (categoryTotalValue) {
      lastMonthColors.push(colorByCategory[category]);
      lastMonthCategories.push(categoryTitles[category]);
      lastMonthCategoriesValue.push(categoryTotalValue);
    }
  });

  const data = {
    labels: lastMonthCategories,
    datasets: [
      {
        label: "# of Votes",
        data: lastMonthCategoriesValue,
        backgroundColor: lastMonthColors,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => tooltipItems[0].label,
          label: (tooltipItem: any) =>
            "Spent: " + numberWithCommas(tooltipItem.parsed) + " $",
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default observer(ChartDoughnut);
