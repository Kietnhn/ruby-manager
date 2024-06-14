import prisma from "@/lib/prisma";
import { Variation } from "@prisma/client";
import { VariationNoImages } from "../definitions";
export const generateVariationUniqueSKU = async (): Promise<string> => {
    let isUnique = false;
    let sku = "";

    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    while (!isUnique) {
        let potentialSKU = "";

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            potentialSKU += characters[randomIndex];
        }

        // Check if the potential SKU is already used
        const existingProduct = await prisma.variation.findFirst({
            where: { sku: potentialSKU },
        });

        if (!existingProduct) {
            sku = potentialSKU;
            isUnique = true;
        }
    }

    return sku;
};
export function convertVariationToInput(
    originalItems: Variation[]
): VariationNoImages[] {
    const convertedItems: VariationNoImages[] = [];

    originalItems.forEach((item) => {
        item.sizes.forEach((size) => {
            convertedItems.push({
                id: item.id,
                sku: item.sku,
                name: item.name,
                description: item.description,
                stock: size.stock,
                size: size.size,
                color: item.color,
                productId: item.productId,
            });
        });
    });

    return convertedItems;
}
