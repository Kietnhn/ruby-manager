import { DiscountType, Image, Page, Property, Variation } from "@prisma/client";
import {
    ICategory,
    ColorData,
    FlatProduct,
    FullProduct,
    GroupedProperties,
    Select,
    SelectOption,
    ISelectColorsData,
    FullOrderProduct,
    VariationNoImages,
} from "./definitions";
import * as XLSX from "xlsx";
import prisma from "./prisma";
import colors from "color-name";
import { DEFAULT_LOCALE } from "./constants";
import {
    CalendarDate,
    Time,
    toCalendarDateTime,
} from "@internationalized/date";
import _ from "lodash";
export function convertToArray(input: string | string[] | undefined): string[] {
    if (input === undefined) {
        return []; // Return an empty array if input is undefined
    } else if (typeof input === "string") {
        return [input]; // Return an array with the string if input is a string
    } else {
        return input; // Return the input array if it's already an array
    }
}

export function convertToSlug(name: string): string {
    return name
        .toLowerCase() // Convert the string to lowercase
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-"); // Replace consecutive dashes with single dash
}
export function differenceArray(arr1: string[], arr2: string[]) {
    const result1 = _.difference(arr1, arr2);
    const result2 = _.difference(arr2, arr1);
    return _.concat(result1, result2);
}
export function isDifferenceArray(arr1: string[], arr2: string[]) {
    const result1 = _.difference(arr1, arr2);
    const result2 = _.difference(arr2, arr1);
    return _.concat(result1, result2).length > 0;
}
export function groupCategories(categories: ICategory[]) {
    const groupedCategories: { [key: string]: ICategory[] } = {};

    // Group categories by parent
    categories.forEach((category) => {
        const parentId = category.parentId || "null";
        if (!groupedCategories[parentId]) {
            groupedCategories[parentId] = [];
        }
        groupedCategories[parentId].push(category);
    });

    return groupedCategories;
}
export function groupPages(pages: Page[]) {
    const groupedPages: { [key: string]: Page[] } = {};

    // Group pages by parent
    pages.forEach((page) => {
        const parentId = page.parentId || "null";
        if (!groupedPages[parentId]) {
            groupedPages[parentId] = [];
        }
        groupedPages[parentId].push(page);
    });

    return groupedPages;
}
export function toDateInputValue(dateObject: Date) {
    const local = new Date(dateObject);
    local.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
}
export function splitAndTrimString(
    sizesString: string,
    character: string = "|"
) {
    const cleanStringArray = sizesString
        .split(`${character}`)
        .map((size) => size.trim())
        .filter((size) => size !== "");
    const setArray = new Set(cleanStringArray);

    // Convert the Set back to an array
    const resultArray = Array.from(setArray);
    return resultArray;
}
export function countOccurrences(
    arr: string[]
): { brand: string; value: number }[] {
    const countMap = new Map();
    arr.forEach((item) => {
        if (countMap.has(item)) {
            countMap.set(item, countMap.get(item) + 1);
        } else {
            countMap.set(item, 1);
        }
    });
    return Array.from(countMap).map(([brand, value]) => ({ brand, value }));
}
export function hideCode(inputString: string): string {
    return "*".repeat(inputString.length);
}
export function convertDateToCalendarDate(date: Date) {
    if (!date) return;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const calendar = new CalendarDate(year, month, day);
    const result = toCalendarDateTime(calendar, new Time(hour, minute, second));
    return result;
}
export function convertDiscountTypeToUnit(type: DiscountType) {
    if (type === "PERCENTAGE") return "%";
    return "USD";
}
export function generateCombinations(colors: string[], sizes: string[]) {
    const combinations: { color: string | null; size: string | null }[] = [];
    if (colors.length === 0) {
        // If colors array is empty, generate combinations with null color
        sizes.forEach((size) => {
            combinations.push({ color: null, size });
        });
    } else if (sizes.length === 0) {
        // If sizes array is empty, generate combinations with null size
        colors.forEach((color) => {
            combinations.push({ color, size: null });
        });
    } else {
        // Generate combinations with both color and size
        colors.forEach((color) => {
            sizes.forEach((size) => {
                combinations.push({ color, size });
            });
        });
    }

    return combinations;
}
export function convertToOptionSelectArray(
    inputArray: { [key: string]: string }[]
): Select[] {
    const optionSelectArray: Select[] = [];

    // Extract unique options and their values
    const uniqueOptions: { [key: string]: string[] } = {};
    inputArray.forEach((obj) => {
        Object.keys(obj).forEach((key) => {
            if (!uniqueOptions[key]) {
                uniqueOptions[key] = [];
            }
            if (obj[key] && !uniqueOptions[key].includes(obj[key])) {
                uniqueOptions[key].push(obj[key]);
            }
        });
    });

    // Convert unique options into OptionSelect objects
    Object.keys(uniqueOptions).forEach((option, index) => {
        const values = uniqueOptions[option];
        if (values.length > 0) {
            optionSelectArray.push({
                id: index,
                values: values,
                option: option,
            });
        }
    });

    return optionSelectArray;
}
// export function groupAvailableVariations(variations: Variation[]): Select[] {
//     const availableVariations = variations.filter(
//         (variation) => variation.stock > 0
//     );
//     return convertToOptionSelectArray(
//         availableVariations.map((variation) => ({
//             size: variation.size as string,
//             color: variation.color as string,
//         }))
//     );
// }
export function getUniqueColors(vartiaions: VariationNoImages[]): string[] {
    const colorsSet: Set<string> = new Set();
    vartiaions.forEach((variation) => {
        if (variation.color) {
            colorsSet.add(variation.color);
        }
    });
    return Array.from(colorsSet);
}
export function getUniqueSizes(vartiaions: VariationNoImages[]): string[] {
    const sizeSet: Set<string> = new Set();
    vartiaions.forEach((variation) => {
        if (variation.size) {
            sizeSet.add(variation.size);
        }
    });
    return Array.from(sizeSet);
}

// export function findVariation(
//     variations: Variation[],
//     variation: Variation
// ): Variation {
//     return variations.find(
//         (vari) => vari.color === variation.color && vari.size === variation.size
//     ) as Variation;
// }
export function isUserAdult(dateOfBirth: Date): boolean {
    const today: Date = new Date();
    const age: number = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff: number = today.getMonth() - dateOfBirth.getMonth();
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
        // If the birth month is after the current month OR
        // if the birth month is the same as the current month but the birth day is after the current day,
        // then decrement the age by 1
        return age - 1 >= 18;
    }
    return age >= 18;
}
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
export function colorsData(): ColorData[] {
    const data = Object.keys(colors).map((color, index) => ({
        id: index,
        name: color,
        color: colors[color as keyof typeof colors],
    }));
    return data;
}
export function selectColorsData(): ISelectColorsData[] {
    const data = Object.keys(colors).map((color) => ({
        label: color,
        value: color,
        color: colors[color as keyof typeof colors],
    }));
    return data;
}
// Function to reverse an array into a string
export function reverseArrayToString(array: string[]) {
    return array.join(" | ");
}

export function getVariationHaveQuantity(variations: VariationNoImages[]) {
    const result = variations.find((variation) => variation.stock > 0);
    return result;
}
export function compareStringArrays(arr1: string[], arr2: string[]): boolean {
    // Step 1: Sort the arrays
    arr1.sort();
    arr2.sort();

    // Step 2: Check the length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Step 3: Compare each element
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    // Step 4: If all elements match, arrays are the same
    return true;
}

export function mergeOrderProducts(
    orderProducts: FullOrderProduct[]
): FullOrderProduct[] {
    const variationIdMap: Record<string, FullOrderProduct> = {};
    orderProducts.forEach((orderProduct) => {
        const { variationId } = orderProduct;
        if (!variationIdMap[variationId]) {
            variationIdMap[variationId] = { ...orderProduct };
        } else {
            variationIdMap[variationId].quantity += orderProduct.quantity;
            variationIdMap[variationId].subTotal += orderProduct.subTotal;
        }
    });
    const mergedOrderProducts: FullOrderProduct[] =
        Object.values(variationIdMap);

    return mergedOrderProducts;
}
// export function getAvailableVariations(variations: Variation[]): Variation[] {
//     const result = variations.filter((variation) => variation.stock > 0);
//     return result;
// }

// export function getVariationsHaveDifferentColor(
//     variations: Variation[]
// ): Variation[] {
//     const uniqueColors = getUniqueColors(variations);
//     console.log(uniqueColors);

//     const uniqueVariationColor = uniqueColors.map((color) =>
//         variations.find((variation) => variation.color == color)
//     );
//     console.log({ uniqueVariationColor });

//     return uniqueVariationColor as Variation[];
// }
// export function getUniqueVariationColorOfProducts(products: FullProduct[]) {
//     const newProducts: FullProduct[] = [];
//     products.forEach((product) => {
//         const uniqueColors = getUniqueColors(product.variations);
//         uniqueColors.forEach((color) => {
//             const variationOfColor = product.variations.filter(
//                 (variation) => variation.color === color
//             );
//             newProducts.push({ ...product, variations: [...variationOfColor] });
//         });
//     });
//     return newProducts;
// }
export function generateToImagesFromUrls(Urls: string[]): Image[] {
    return Urls.map((url) => ({
        createdAt: new Date(),
        id: getPublicIdFromUrl(url),
        public_id: getPublicIdFromUrl(url),
        deleted: false,
        url: url,
    }));
}
export function isVideo(url: string): boolean {
    if (!url) return false;
    const part = url.split(".");
    // get the last part of the url
    if (part[part.length - 1].includes("mp4")) {
        return true;
    } else {
        return false;
    }
}
export const generateUniqueSKU = async (
    brandId: string,
    categoryId: string,
    gender: string
): Promise<string> => {
    let isUnique = false;
    let sku = "";

    let codeBrand = "UB";
    if (brandId) {
        const brand = await prisma.brand.findUnique({ where: { id: brandId } });
        if (brand) {
            codeBrand = brand.code.substring(0, 2);
        }
    }
    let codeCategory = "UC";
    if (categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (category) {
            codeCategory = category.code.substring(0, 2);
        }
    }

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    while (!isUnique) {
        // Generate a potential SKU using information from category, collection, and brand
        let potentialSKU = "";
        potentialSKU += codeBrand;
        potentialSKU += codeCategory;
        potentialSKU += gender[0];
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            potentialSKU += characters[randomIndex];
        }

        // Check if the potential SKU is already used
        const existingProduct = await prisma.product.findFirst({
            where: { sku: potentialSKU },
        });

        if (!existingProduct) {
            // SKU is unique, assign it to sku variable
            sku = potentialSKU;
            isUnique = true;
        }
    }

    return sku;
};

export const renderId = (value: string): string => {
    if (!value) return "...";
    const end = value.substring(value.length - 4);
    return "..." + end;
};
export const convertToFlatProducts = (
    products: FullProduct[]
): FlatProduct[] => {
    return products.map((product) => {
        const flat: FlatProduct = {
            id: product.id,
            name: product.name,
            sku: product.sku,
            brand: product.brand?.name || "",
            brandCode: product.brand?.code || "",

            properties: product.properties,
            category: product.category?.name || "",
            categoryCode: product.category?.code || "",
            variationsLength: product.variations.length,
            createdAt: product.createdAt,
            description: product.description || "",
            gender: product.gender || "",
            gallery: product.gallery,

            releaseAt: product.releaseAt,
            stock: 0,
        };
        return flat;
    });
};
export const getPublicIdFromUrl = (url: string) => {
    if (typeof url !== "string" || !url.trim()) return "";
    const urlArray = url.split("/");
    const lastPart = urlArray[urlArray.length - 1];
    const folderPart = urlArray[urlArray.length - 2];
    return folderPart + "/" + lastPart.split(".")[0];
};
export const exportToXLSX = (data: any[], nameFile: string) => {
    if (data.length <= 0 || !nameFile) return;
    const rows = data;
    /* generate worksheet and workbook */
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [Object.keys(data[0])], {
        origin: "A1",
    });

    /* calculate column width */
    const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
    worksheet["!cols"] = [{ wch: max_width }];

    XLSX.writeFile(workbook, nameFile + ".xlsx", { compression: true });
};
export const convertPathnameToLink = (pathName: string) => {
    const pathList = pathName.split("/");
    if (pathList.length <= 3) {
        //pathname is root ("","dashboard","navlink")
        return pathName;
    } else {
        const host = pathList[0];
        const root = pathList[1];
        const navlink = pathList[2];
        return host + "/" + root + "/" + navlink;
    }
};
export function toCapitalize(str: string): string {
    if (!str) return "";

    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
export function capitalizeWords(str: string) {
    // Split the string by "/"
    let words = str.split("/");

    // Capitalize each word
    let capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // Join the words back together with "/"
    let capitalizedString = capitalizedWords.join("/");

    return capitalizedString;
}
export function generateRandomIntArray(
    min: number,
    max: number,
    size: number
): number[] {
    const randomArray: number[] = [];
    for (let i = 0; i < size; i++) {
        const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
        randomArray.push(randomInt);
    }
    return randomArray;
}
export const renderPrice = (
    price: number,
    currency: string = "USD",
    locale: string = DEFAULT_LOCALE
) => {
    return Intl.NumberFormat(locale, {
        currency: currency,
        style: "currency",
        currencyDisplay: "narrowSymbol",
    }).format(price);
};
