"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { exportToXLSX } from "../lib/utils";
import {
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { FullProduct } from "@/lib/definitions";

const ImpExpButtons = ({
    data,
    impUrl,
    nameFile,
    impData,
}: {
    impData: FullProduct[];
    data: any[];
    nameFile: string;
    impUrl: string;
}) => {
    console.log({ products: impData });

    return (
        <div className="flex gap-2 mt-2">
            <Button
                size="sm"
                variant="light"
                onClick={() => exportToXLSX(data, nameFile)}
            >
                <ArrowUpTrayIcon className="w-5 h-5" />
                Export
            </Button>
            <Link href={impUrl}>
                <Button size="sm" variant="light">
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Import
                </Button>
            </Link>
        </div>
    );
};

export default ImpExpButtons;
