"use client";
import React from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
    ChartDataset,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({
    datasets,
    labels,
}: {
    datasets: ChartDataset<"pie", number[]>[];
    labels: string[];
}) {
    const data: ChartData<"pie", number[], string> = {
        labels: labels,
        datasets: datasets,
    };
    return (
        <Pie
            data={data}
            options={{
                plugins: {
                    legend: {
                        display: true,
                        position: "left",
                    },
                },
            }}
            className="max-w-72 max-h-72"
        />
    );
}
