"use client";
import { useRouter } from "next/navigation";
import React from "react";

const AccessForbidden = () => {
    const router = useRouter();
    return (
        <main className="w-full h-full flex-center flex-col gap-4">
            <h1 className="text-4xl font-semibold text-warning-500">
                Access Forbidden
            </h1>
            <p>Sorry, you don't have permission to access the requested page</p>
            <p
                className="hover:underline text-primary text-medium font-semibold hover:cursor-pointer"
                onClick={() => router.back()}
            >
                Back to previous
            </p>
        </main>
    );
};

export default AccessForbidden;
