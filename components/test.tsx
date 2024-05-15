"use client";

import { ICategory } from "@/lib/definitions";
import CategoryTree from "./category-tree";

export default function Test({ categories }: { categories: ICategory[] }) {
    return <CategoryTree categories={categories} />;
}
