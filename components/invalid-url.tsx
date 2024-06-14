"use client";
import { useRouter } from "next/navigation";
import React from "react";

const InvalidUrl = () => {
    const router = useRouter();
    return (
        <main className="w-full h-full flex-center flex-col gap-4">
            <h1 className="text-4xl font-semibold text-warning-500">
                Invalid URL
            </h1>
            <p>
                Somethings went wrong at the url, Please{" "}
                <span
                    className="hover:underline text-primary text-medium font-semibold hover:cursor-pointer"
                    onClick={() => router.back()}
                >
                    try again
                </span>
            </p>
        </main>
    );
};

export default InvalidUrl;
