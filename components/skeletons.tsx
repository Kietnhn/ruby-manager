"use client";
import { Skeleton } from "@nextui-org/react";
const shimmer =
    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";
export const SearchProductSkeleton = () => {
    return (
        <div className="grid grid-cols-3  gap-4">
            <Skeleton className="rounded-medium">
                <div className="h-[400px]  rounded-medium bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-medium">
                <div className="h-[400px]  rounded-medium bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-medium">
                <div className="h-[400px]  rounded-medium bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-medium">
                <div className="h-[400px]  rounded-medium bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-medium">
                <div className="h-[400px]  rounded-medium bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-medium">
                <div className="h-[400px]  rounded-medium bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-medium">
                <div className="h-[400px]  rounded-medium bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-medium">
                <div className="h-[400px]  rounded-medium bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-medium">
                <div className="h-[400px]  rounded-medium bg-default-300"></div>
            </Skeleton>
        </div>
    );
};

export const CardItemSkeleton = () => {
    return (
        <Skeleton className="rounded-medium">
            <div className="h-24 rounded-medium bg-default-300"></div>
        </Skeleton>
        // <div
        //     className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
        // >
        //     <div className="h-24 rounded-medium bg-default-300"></div>
        // </div>
    );
};
export const CardFullItemSkeleton = () => {
    return (
        <Skeleton className="rounded-medium">
            <div className="h-[800px] rounded-medium bg-default-300"></div>
        </Skeleton>
    );
};
export const CardColItemSkeleton = () => {
    return (
        <Skeleton className="rounded-medium">
            <div className="h-[400px] rounded-medium bg-default-300"></div>
        </Skeleton>
    );
};
export const StoreImagesSkeleton = () => {
    return (
        <div className="flex justify-between items-center -mx-4">
            <div className="w-1/2 px-4 bg-slate-200 animate-pulse mb-4"></div>
            <div className="w-1/2 px-4 bg-slate-200 animate-pulse mb-4"></div>
            <div className="w-1/2 px-4 bg-slate-200 animate-pulse mb-4"></div>
            <div className="w-1/2 px-4 bg-slate-200 animate-pulse mb-4"></div>
            <div className="w-1/2 px-4 bg-slate-200 animate-pulse mb-4"></div>
            <div className="w-1/2 px-4 bg-slate-200 animate-pulse mb-4"></div>
            <div className="w-1/2 px-4 bg-slate-200 animate-pulse mb-4"></div>
            <div className="w-1/2 px-4 bg-slate-200 animate-pulse mb-4"></div>
            <div className="w-1/2 px-4 bg-slate-200 animate-pulse mb-4"></div>
            <div className="w-1/2 px-4 bg-slate-200 animate-pulse mb-4"></div>
        </div>
    );
};
export const TableCategoriesSkeleton = () => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50"></th>
                        <th className="px-6 py-3 bg-gray-50"></th>
                        <th className="px-6 py-3 bg-gray-50"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
export const TableSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="w-full h-10 rounded-medium bg-slate-200 animate-pulse"></div>
            <div className="w-full h-10 rounded-medium bg-slate-200 animate-pulse"></div>
            <div className="w-full h-10 rounded-medium bg-slate-200 animate-pulse"></div>
            <div className="w-full h-10 rounded-medium bg-slate-200 animate-pulse"></div>
            <div className="w-full h-10 rounded-medium bg-slate-200 animate-pulse"></div>
            <div className="w-full h-10 rounded-medium bg-slate-200 animate-pulse"></div>
            <div className="w-full h-10 rounded-medium bg-slate-200 animate-pulse"></div>
            <div className="w-full h-10 rounded-medium bg-slate-200 animate-pulse"></div>
            <div className="w-full h-10 rounded-medium bg-slate-200 animate-pulse"></div>
        </div>
    );
};
export const CreateUserSkeleton = () => {
    return (
        <div className="flex gap-4">
            <div className="w-1/2 bg-slate-200 animate-pulse rounded-medium h-96"></div>
            <div className="w-1/2 bg-slate-200 animate-pulse rounded-medium h-96"></div>
        </div>
    );
};
