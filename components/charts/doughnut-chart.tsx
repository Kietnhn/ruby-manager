"use client";
import React from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
    ChartDataset,
    Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "next-themes";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function DoughnutChart({
    datasets,
    labels,
    title = "Title",
    centerTitle = "Center Title",
}: {
    datasets: ChartDataset<"doughnut", number[]>[];
    labels: string[];
    title?: string;
    centerTitle?: string;
}) {
    const { theme } = useTheme();
    const data: ChartData<"doughnut", number[], string> = {
        labels: labels,
        datasets: datasets,
    };
    const doughtnutLabel = {
        id: "doughtnutLabelId",
        afterDatasetDraw(chart: any) {
            const { ctx, data } = chart;
            const centerX = chart.getDatasetMeta(0).data[0]?.x;
            const centerY = chart.getDatasetMeta(0).data[0]?.y;
            //
            ctx.save();
            ctx.font = "bold 3rem sans-serif";

            ctx.fillStyle = "#a1a1aa";
            (ctx.textAlign = "center"),
                (ctx.textBaseline = "middle"),
                ctx.fillText(centerTitle, centerX, centerY);
        },
    };
    return (
        <Doughnut
            data={data}
            options={{
                cutout: "90%",

                plugins: {
                    title: {
                        position: "top",
                        text: title,
                        display: true,

                        color: "#a1a1aa",
                        font: {
                            weight: "bolder",
                            size: 20,
                        },
                    },
                    legend: {
                        display: true,
                        position: "bottom",
                    },
                },
            }}
            plugins={[doughtnutLabel]}
            className="max-w-72 max-h-72"
        />
    );
}
