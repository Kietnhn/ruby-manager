import { Property } from "@prisma/client";

export type GroupedProperties = {
    name: string;
    values: Property[];
};
