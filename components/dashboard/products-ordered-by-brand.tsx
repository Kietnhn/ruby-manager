import { getSoldBrand } from "@/lib/actions/dashboard";
import { Card, CardBody } from "@nextui-org/react";
import DoughnutChart from "../charts/doughnut-chart";

export default async function ProductsOrderedByBrand() {
    const brandOrdered = await getSoldBrand();
    const labels = brandOrdered.map((item) => item.brand);
    const datasets = [
        {
            data: brandOrdered.map((item) => item.value),
            backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
            ],
        },
    ];
    const totalBrandOrdered = brandOrdered.reduce(
        (total, item) => total + item.value,
        0
    );
    return (
        <Card>
            <CardBody className="flex-center">
                <DoughnutChart
                    datasets={datasets}
                    labels={labels}
                    title="Brand purchased"
                    centerTitle={totalBrandOrdered.toString()}
                />
            </CardBody>
        </Card>
    );
}
