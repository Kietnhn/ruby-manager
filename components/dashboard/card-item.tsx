"use client";
import { Button, Card, CardBody } from "@nextui-org/react";
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

export default function CardItem({
    amount,
    icon,
    title,
    trending,

    className,
}: {
    title: string;
    amount: string;
    trending: "increase" | "decrease" | "balance";
    icon: React.ReactNode;
    className?: string;
}) {
    return (
        <Card className={className}>
            <CardBody>
                <div className="w-full flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            isIconOnly
                            className="pointer-events-none rounded-full"
                        >
                            {icon}
                        </Button>
                        <p className="text-small text-default-500">{title}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-semibold text-foreground">
                            {amount}
                        </p>
                        {trending === "decrease" ? (
                            <TrendingDownIcon className="w-8 h-8 text-red-500" />
                        ) : trending === "increase" ? (
                            <TrendingUpIcon className="w-8 h-8 text-success-500" />
                        ) : (
                            <MinusIcon className="w-8 h-8 text-warning-500" />
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
