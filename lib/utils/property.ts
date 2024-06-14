import { Property } from "@prisma/client";
import { GroupedProperties } from "../definitions/property";

export function groupPropertiesByName(data: Property[]): GroupedProperties[] {
    const groupedData: { [name: string]: GroupedProperties } = {};

    data.forEach((obj) => {
        if (!groupedData[obj.name]) {
            groupedData[obj.name] = {
                name: obj.name,
                values: [],
            };
        }
        groupedData[obj.name].values.push(obj);
    });

    return Object.values(groupedData);
}
