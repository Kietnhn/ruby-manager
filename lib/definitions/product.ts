import {
    Category,
    Prisma,
    PrismaClient,
    Product,
    StyleGender,
} from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { ICategory } from "../definitions";

export interface ProductFilterOptions {
    category: string[];
    brand: string[];
    collection: string[];
    gender: StyleGender[];
    property: string[];
}
export interface SortByData {
    key: string;
    label: string;
    value: AvailableSortKey;
    direction: Direction;
}

export type AvailableSortKey = keyof Pick<
    Product,
    "name" | "releaseAt" | "createdAt" | "updatedAt"
>;
export type Direction = "asc" | "desc";

export interface IProductCategory extends Product {
    category: ICategory | null;
}
