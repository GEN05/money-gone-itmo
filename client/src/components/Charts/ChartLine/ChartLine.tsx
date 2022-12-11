import React, { FC, useContext } from "react";
import { Context } from "../../../index";
import { observer } from "mobx-react-lite";
import { Transaction } from "../../../models/IUser";
import { Line } from "react-chartjs-2";
import {
  dateHumanReadableFull,
  dateToYYYYMMDD,
  trnsFromLastMonth,
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
  ScriptableLineSegmentContext,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const trnsToDataAndLabels = (
  trns: Transaction[],
  maxDate: number
): [string[], number[]] => {
  const trnsMap = new Map<string, number>();
  const maxDateStr: string = dateToYYYYMMDD(new Date(maxDate));
  const maxDay: number = Number(maxDateStr.split("-")[2]);

  for (let i = 1; i <= maxDay; i++) {
    const iDate =
      maxDateStr.split("-").splice(0, 2).join("-") +
      "-" +
      (i > 9 ? String(i) : "0" + String(i));
    trnsMap.set(iDate, NaN);
  }

  trns.forEach((t) => {
    const formattedDate = dateToYYYYMMDD(new Date(new Date(t.date)));

    if (isNaN(trnsMap.get(formattedDate) || NaN)) {
      trnsMap.set(formattedDate, t.value);
    } else {
      // @ts-ignore
      trnsMap.set(formattedDate, trnsMap.get(formattedDate) + t.value);
    }
  });

  return [Array.from(trnsMap.keys()), Array.from(trnsMap.values())];
};

const includesNotNan = (array: number[]): boolean => {
  for (let element of array) {
    if (!isNaN(element)) {
      return true;
    }
  }
  return false;
};

const skipped = (ctx: ScriptableLineSegmentContext, value: any) =>
  ctx.p0.skip || ctx.p1.skip ? value : undefined;

const ChartLine: FC = () => {
  const { store } = useContext(Context);

  const { maxDate, cashLastMonth, cardLastMonth } = trnsFromLastMonth(
    store.user.transactions,
    store.user.transactionsFromBank
  );

  const [labels, trns]: [string[], number[]] = trnsToDataAndLabels(
    cashLastMonth,
    maxDate
  );
  const [, trnsFromBank]: [string[], number[]] = trnsToDataAndLabels(
    cardLastMonth,
    maxDate
  );
  // trns and trnsFromBank are same size
  const trnsTotal: number[] = [];
  for (let i = 0; i < trns.length; i++) {
    // sum trns with same label
    const resultToPush = isNaN(trns[i])
      ? isNaN(trnsFromBank[i])
        ? NaN
        : trnsFromBank[i]
      : isNaN(trnsFromBank[i])
      ? trns[i]
      : trns[i] + trnsFromBank[i];
    trnsTotal.push(resultToPush);
  }

  const datasets = [];

  if (includesNotNan(trnsTotal)) {
    datasets.push({
      label: "Total expenses",
      data: trnsTotal,
      borderColor: "rgb(102,204,206)",
      backgroundColor: "rgba(102,204,206, 0.5)",
      segment: {
        borderColor: (ctx: ScriptableLineSegmentContext) =>
          skipped(ctx, "rgba(102,204,206, 0.5)"),
        borderDash: (ctx: ScriptableLineSegmentContext) => skipped(ctx, [6, 6]),
      },
      spanGaps: true,
    });
  }

  if (includesNotNan(trns)) {
    datasets.push({
      label: "Expenses by cash",
      data: trns,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      segment: {
        borderColor: (ctx: ScriptableLineSegmentContext) =>
          skipped(ctx, "rgba(255, 99, 132, 0.5)"),
        borderDash: (ctx: ScriptableLineSegmentContext) => skipped(ctx, [6, 6]),
      },
      spanGaps: true,
      hidden: true,
    });
  }

  if (includesNotNan(trnsFromBank)) {
    datasets.push({
      label: "Expenses from bank",
      data: trnsFromBank,
      borderColor: "rgb(209,228,134)",
      backgroundColor: "rgba(209,228,134, 0.5)",
      segment: {
        borderColor: (ctx: ScriptableLineSegmentContext) =>
          skipped(ctx, "rgba(209,228,134, 0.5)"),
        borderDash: (ctx: ScriptableLineSegmentContext) => skipped(ctx, [6, 6]),
      },
      spanGaps: true,
      hidden: true,
    });
  }

  const data = {
    labels,
    datasets,
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) =>
            dateHumanReadableFull(new Date(tooltipItems[0].label)),
          label: (tooltipItem: any) =>
            "Spent " + tooltipItem.formattedValue + " $",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default observer(ChartLine);
