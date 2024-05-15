"use server";

import { Gallery, Product, Variation } from "@prisma/client";
import { productSchema, propertyShema } from "../schema";
import {
    DeepProduct,
    FullProduct,
    State,
    TGallery,
    VariationNoImages,
    dataEditProduct,
} from "../definitions";
import {
    compareStringArrays,
    convertToSlug,
    differenceArray,
    generateUniqueSKU,
    generateVariationUniqueSKU,
    getUniqueColors,
    getUniqueSizes,
    getVariationHaveQuantity,
    splitAndTrimString,
} from "../utils";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
// dashboard/product
const CreateProduct = productSchema;
type PayloadAddProduct = {
    variations: VariationNoImages[];
    gallery: TGallery[];
};
export async function addProduct(
    payloadAddProduct: PayloadAddProduct,
    prevState: State,
    formData: FormData
) {
    const { gallery, variations } = payloadAddProduct;

    const validatedFields = CreateProduct.safeParse({
        name: formData.get("name"),
        weight: formData.get("weight"),
        description: formData.get("description"),
        summary: formData.get("summary"),
        details: formData.get("details"),
        categoryId: formData.get("categoryId"),
        brandId: formData.get("brandId"),
        collectionIds: formData.getAll("collectionIds"),
        gender: formData.get("gender"),
        isAvailable: formData.get("isAvailable"),
        discountId: formData.get("discountId"),
        price: formData.get("price"),
        salePrice: formData.get("salePrice"),
        propertyIds: formData.getAll("propertyIds"),
        releaseAt: formData.get("releaseAt"),
        sku: formData.get("sku"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create Product.",
        };
    }

    // Prepare data for insertion into the database
    const {
        name,
        description,
        details,
        summary,
        price,
        gender,
        categoryId,
        collectionIds,
        brandId,
        countryOfOrigin,
        isAvailable,
        weight,
        propertyIds,
        sku,
        releaseAt,
        discountId,
        salePrice,
    } = validatedFields.data;

    if (variations.length <= 0) {
        return {
            errors: {},
            message: "Missing Variations",
        };
    }
    const sizes = getUniqueSizes(variations);
    if (sizes.length === 0) {
        return {
            errors: {},
            message: "All variations must to have a size",
        };
    }
    const colors = getUniqueColors(variations);
    if (colors.length === 0) {
        return {
            errors: {},
            message: "The product must have as least one color",
        };
    }

    const validateImagesByColor = gallery.filter(
        (item) => item.images.filter((img) => !img).length >= 0
    );
    if (
        isAvailable &&
        (validateImagesByColor.length === 0 ||
            !getVariationHaveQuantity(variations))
    ) {
        return {
            errors: {},
            message: "Missing quantity or images. Failed to create Product",
        };
    }

    let productSku = sku;
    if (!productSku) {
        productSku = await generateUniqueSKU(
            countryOfOrigin as string,
            "",
            categoryId || "",
            "",
            gender
        );
    } else {
        const existedProductSKU = await prisma.product.findFirst({
            where: {
                sku: productSku,
            },
        });
        if (existedProductSKU) {
            return {
                errors: {},
                message: "SKU is existed",
            };
        }
    }
    const variationsWithSku: Variation[] = [];
    for (const variation of variations) {
        const variationSku = await generateVariationUniqueSKU(
            productSku as string,
            variation.size,
            variation.color
        );
        const galleryOfColor = gallery.find((item) => item.color);
        if (!galleryOfColor)
            return {
                errors: {},
                message: "Colors mismatch",
            };
        variationsWithSku.push({
            ...variation,
            images: galleryOfColor.images,
            sku: variationSku,
            deleted: false,
        });
    }

    const galleryInterface: Gallery[] = gallery.map((item) => ({
        color: item.color,
        image: item.images.at(0) as string,
    }));
    const newVariations = variationsWithSku.map((variation) => ({
        sku: variation.sku,
        name: variation.name || name,
        description: variation.description,
        images: variation.images,
        color: variation.color,
        size: variation.size,
        stock: variation.stock,
        deleted: false,
    }));
    try {
        await prisma.$transaction(async (tx) => {
            const createdProduct = await tx.product.create({
                data: {
                    name,
                    releaseAt: releaseAt || null,
                    sku: productSku as string,
                    isAvailable: isAvailable,
                    details,
                    summary,
                    countryOfOrigin: countryOfOrigin,
                    weight: weight,
                    gender,
                    description: description as string,
                    price,
                    discountId: discountId,
                    salePrice: salePrice,
                    slug: convertToSlug(name),
                    categoryId: categoryId || null,
                    brandId: brandId || null,
                    collectionIds: collectionIds,
                    propertyIds: propertyIds,
                    priceCurrency: "USD",
                    gallery: galleryInterface,
                    variations: {
                        createMany: {
                            data: newVariations,
                        },
                    },
                },
            });
            if (discountId) {
                console.log("update discount");

                await tx.discount.update({
                    where: {
                        id: discountId,
                    },
                    data: {
                        quantity: {
                            decrement: 1,
                        },
                    },
                });
            }
            console.log(collectionIds);

            if (collectionIds && collectionIds.length > 0) {
                console.log("update collections");

                await tx.collection.updateMany({
                    where: {
                        id: { in: collectionIds },
                    },
                    data: {
                        productIds: {
                            push: createdProduct.id,
                        },
                    },
                });
            }
        });
    } catch (error) {
        throw new Error("Error at add product: " + error);
    }
    revalidatePath("/dashboard/products/create");
    redirect("/dashboard/products");
}

const EditProduct = productSchema;
interface PayloadEditProduct extends PayloadAddProduct {
    productId: string;
}
export async function editProduct(
    payloadEditProduct: PayloadEditProduct,
    prevState: State,
    formData: FormData
) {
    const { productId, variations, gallery } = payloadEditProduct;
    console.log("productId", productId);
    console.log("variations", variations);
    console.log("gallery", gallery);

    if (!productId) {
        return {
            errors: {},
            message: "Missing productId.  Failed to edit Product.",
        };
    }
    const validatedFields = EditProduct.safeParse({
        name: formData.get("name"),
        weight: formData.get("weight"),
        description: formData.get("description"),
        summary: formData.get("summary"),
        details: formData.get("details"),
        categoryId: formData.get("categoryId"),
        brandId: formData.get("brandId"),
        collectionIds: formData.getAll("collectionIds"),
        gender: formData.get("gender"),
        isAvailable: formData.get("isAvailable"),
        discountId: formData.get("discountId"),
        price: formData.get("price"),
        salePrice: formData.get("salePrice"),
        propertyIds: formData.getAll("propertyIds"),
        releaseAt: formData.get("releaseAt"),
        sku: formData.get("sku"),
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create Product.",
        };
    }

    const {
        name,
        description,
        price,
        gender,
        categoryId,
        collectionIds,
        brandId,
        countryOfOrigin,
        isAvailable,
        weight,
        propertyIds,
        releaseAt,
        sku,
        details,
        summary,
        discountId,
        salePrice,
    } = validatedFields.data;
    if (variations.length <= 0) {
        return {
            errors: {},
            message: "Missing Variations",
        };
    }
    const sizes = getUniqueSizes(variations);
    if (sizes.length === 0) {
        return {
            errors: {},
            message: "All variations must to have a size",
        };
    }
    const colors = getUniqueColors(variations);
    if (colors.length === 0) {
        return {
            errors: {},
            message: "The product must have as least one color",
        };
    }
    const validateImagesByColor = gallery.filter(
        (item) => item.images.filter((img) => !img).length >= 0
    );
    if (
        isAvailable &&
        (validateImagesByColor.length === 0 ||
            !getVariationHaveQuantity(variations))
    ) {
        return {
            errors: {},
            message: "Missing quantity or images. Failed to create Product",
        };
    }

    let productSku = sku;
    if (!productSku) {
        productSku = await generateUniqueSKU(
            countryOfOrigin as string,
            brandId || "",
            categoryId || "",
            "",
            gender
        );
    } else {
        const existedProductSKU = await prisma.product.findFirst({
            where: {
                AND: [
                    {
                        sku: productSku,
                    },
                    {
                        id: {
                            not: productId,
                        },
                    },
                ],
            },
        });
        if (existedProductSKU) {
            return {
                errors: {},
                message: "SKU is existed",
            };
        }
    }
    // const variationsWithSku: Variation[] = [];
    // for (const variation of variations) {
    //     const variationSku = await generateVariationUniqueSKU(
    //         productSku as string,
    //         variation.size,
    //         variation.color
    //     );
    //     const galleryOfColor = gallery.find((item) => item.color);
    //     if (!galleryOfColor)
    //         return {
    //             errors: {},
    //             message: "Colors mismatch",
    //         };
    //     variationsWithSku.push({
    //         ...variation,
    //         images: galleryOfColor.images,
    //         sku: variationSku,
    //         deleted: false,
    //     });
    // }
    const galleryInterface: Gallery[] = gallery.map((item) => ({
        color: item.color,
        image: item.images.at(0) as string,
    }));
    const newVariations: Variation[] = [];
    for (const variation of variations) {
        const galleryOfColor = gallery.find((item) => item.color);
        let variationSku = variation.sku;
        if (!variationSku) {
            variationSku = await generateVariationUniqueSKU(
                productSku,
                variation.size,
                variation.color
            );
        }
        if (!galleryOfColor)
            return {
                errors: {},
                message: "Colors mismatch",
            };
        newVariations.push({
            id: variation.id,
            sku: variationSku,
            name: variation.name || name,
            description: variation.description,
            images: galleryOfColor.images,
            color: variation.color,
            size: variation.size,
            stock: variation.stock,
            deleted: false,
            productId: productId,
        });
    }
    console.table(variations);
    console.table(newVariations);
    try {
        await prisma.$transaction(async (tx) => {
            //update product
            const updatedProduct = await tx.product.update({
                data: {
                    name,
                    propertyIds,
                    releaseAt: releaseAt || null,
                    sku: productSku as string,
                    isAvailable: isAvailable,
                    countryOfOrigin: countryOfOrigin,
                    weight: weight,
                    details,
                    summary,
                    gender,
                    description: description as string,
                    price,
                    discountId: discountId,
                    salePrice,
                    slug: convertToSlug(name),
                    categoryId: categoryId || null,
                    brandId: brandId || null,
                    collectionIds: collectionIds,
                    priceCurrency: "USD",
                    gallery: galleryInterface,
                    // variations: {
                    //     createMany: {
                    //         data: newVariations,
                    //     },
                    // },
                },
                where: {
                    id: productId,
                },
            });
            console.log("updated product");

            // variations
            const existingVariations = await tx.variation.findMany({
                where: { productId: productId },
            });

            console.log("existingVariations", existingVariations);

            const newVariationsIds = newVariations.map(
                (variation) => variation.id
            );
            // Identify variations to delete
            const variationsToDelete = existingVariations.filter(
                (variation) =>
                    !newVariationsIds.includes(variation.id) &&
                    variation.deleted === false
            );
            console.log("variationsToDelete", variationsToDelete);

            // Identify variations to add or update
            const variationsToAddOrUpdate = newVariations.map((variation) => {
                const matchExistedVariation = existingVariations.find(
                    (v) =>
                        v.color === variation.color &&
                        v.size === variation.size &&
                        v.deleted === true
                );
                return {
                    ...variation,
                    productId: productId,
                    sku: matchExistedVariation?.sku || variation.sku,
                };
            });
            console.log("variationsToAddOrUpdate", variationsToAddOrUpdate);

            // Perform deletion
            if (variationsToDelete.length > 0) {
                await tx.variation.deleteMany({
                    where: {
                        id: {
                            in: variationsToDelete.map(
                                (variation) => variation.id
                            ),
                        },
                        orderProducts: {
                            none: {}, // This checks that there are not related OrderProduct records
                        },
                    },
                });
                await tx.variation.updateMany({
                    where: {
                        id: {
                            in: variationsToDelete.map(
                                (variation) => variation.id
                            ),
                        },
                        orderProducts: {
                            some: {}, // This checks that there are  related OrderProduct records
                        },
                    },
                    data: {
                        deleted: true,
                    },
                });
            }
            for (const variation of variationsToAddOrUpdate) {
                const upserted = await tx.variation.upsert({
                    where: { sku: variation.sku },
                    update: {
                        name: variation.name,
                        description: variation.description,
                        images: variation.images,
                        stock: variation.stock,
                        size: variation.size,
                        color: variation.color,
                        productId: productId,
                        deleted: false,
                    },
                    create: {
                        sku: variation.sku,
                        name: variation.name,
                        description: variation.description,
                        images: variation.images,
                        stock: variation.stock,
                        size: variation.size,
                        color: variation.color,
                        productId: productId,
                        deleted: false,
                    },
                });
                console.log("upsert", JSON.stringify(upserted));
            }
            // Perform upsert (add or update) operations
            // await Promise.all(
            //     variationsToAddOrUpdate.map((variation) => {

            //         console.log("create or update variation");

            //         // }
            //     })
            // );
            console.table("upserted variants");

            if (!collectionIds || collectionIds.length === 0) return;
            // many to many relationships -> so the collection not update yet
            const collectionsBeforeUpdate = await tx.collection.findMany({
                where: {
                    productIds: {
                        has: productId,
                    },
                },
                select: {
                    id: true,
                    productIds: true,
                },
            });
            const collectionBeforeUpdateIds = collectionsBeforeUpdate.map(
                (collection) => collection.id
            );
            const changedCollectionIds = differenceArray(
                collectionIds,
                collectionBeforeUpdateIds
            );
            console.log("Changed collection", changedCollectionIds);

            if (changedCollectionIds.length === 0) return;
            console.log("updating collections");
            // remove all collections have product id
            for (const collectionId of collectionBeforeUpdateIds) {
                const matchedCollection = collectionsBeforeUpdate.find(
                    (collection) => collection.id === collectionId
                );
                if (!matchedCollection) throw new Error("Collection not found");
                const removedCurrentProductId =
                    matchedCollection.productIds.filter(
                        (pId) => pId !== productId
                    );
                await tx.collection.update({
                    where: {
                        id: collectionId,
                    },
                    data: {
                        productIds: removedCurrentProductId,
                    },
                });
            }
            // update like create product
            await tx.collection.updateMany({
                where: {
                    id: { in: collectionIds },
                },
                data: {
                    productIds: {
                        push: updatedProduct.id,
                    },
                },
            });
        });
    } catch (error) {
        throw new Error("Error at edit product: " + error);
    }
    revalidatePath(`/dashboard/products/${productId}/edit`);
    redirect("/dashboard/products");
}
async function updateProductWithVariations(
    productId: string,
    newVariations: Variation[]
): Promise<Variation[]> {
    // Fetch existing variations for the product
    const existingVariations = await prisma.variation.findMany({
        where: { productId: productId },
    });

    // Map existing variations by id for quick lookup
    // const existingVariationsMap = existingVariations.reduce((map, variation) => {
    //   map[variation.id] = variation;
    //   return map;
    // }, {} as Record<string, Variation>);

    // Map new variations by sku for quick lookup
    const newVariationsMap = newVariations.reduce((map, variation) => {
        map[variation.sku] = variation;
        return map;
    }, {} as Record<string, Variation>);

    // Identify variations to delete
    const variationsToDelete = existingVariations.filter(
        (variation) => !newVariationsMap[variation.sku]
    );

    // Identify variations to add or update
    const variationsToAddOrUpdate = newVariations.map((variation) => ({
        ...variation,
        productId: productId,
    }));

    // Perform deletion
    await prisma.variation.deleteMany({
        where: {
            id: { in: variationsToDelete.map((variation) => variation.id) },
            orderProducts: {
                none: {}, // This checks that there are  related OrderProduct records
            },
        },
    });
    await prisma.variation.updateMany({
        where: {
            id: { in: variationsToDelete.map((variation) => variation.id) },
            orderProducts: {
                some: {}, // This checks that there are  related OrderProduct records
            },
        },
        data: {
            deleted: true,
        },
    });

    // Perform upsert (add or update) operations
    const upsertedVariations = await Promise.all(
        variationsToAddOrUpdate.map((variation) =>
            prisma.variation.upsert({
                where: { sku: variation.sku },
                update: {
                    name: variation.name,
                    description: variation.description,
                    images: variation.images,
                    stock: variation.stock,
                    size: variation.size,
                    color: variation.color,
                    productId: productId,
                },
                create: {
                    sku: variation.sku,
                    name: variation.name,
                    description: variation.description,
                    images: variation.images,
                    stock: variation.stock,
                    size: variation.size,
                    color: variation.color,
                    productId: productId,
                },
            })
        )
    );

    return upsertedVariations;
}

export async function getVariaionsOfProduct(
    productId: string
): Promise<Variation[]> {
    try {
        // const isInOrderProduct = await prisma.variation.findMany({
        //     where: {
        //         productId: productId,
        //         orderProducts: {
        //             some: {}, // This checks if there is at least one related OrderProduct
        //         },
        //     },
        // });
        const variations = await prisma.variation.findMany({
            where: {
                productId: productId,
            },
        });
        return variations;
    } catch (error) {
        throw new Error("Error at getting variations of product: " + error);
    }
}
export async function addProductsWithXlsx(products: Product[]) {
    if (!products || products.length === 0) {
        return {
            message: "Missing Fields. Failed to create Products.",
        };
    }

    for (let i = 0; i < products.length; i++) {
        if (products[i].sku && products[i].sku.length !== 16) {
            return {
                message: "All sku fields must be equal 16 characters.",
            };
        }
        // if don't submit skus, create automatically
        const sku = await generateUniqueSKU("", "", "", "", products[i].gender);
        products[i].sku = sku;
    }
    try {
        await prisma.product.createMany({
            data: products.map((product) => ({
                name: product.name,
                // all products does not enough information for sales
                isAvailable: false,
                price: product.price,
                sku: product.sku,
                priceCurrency: "USD",
                weight: product.weight,
                gender: product.gender,
                gallery: product.gallery,
                description: product.description,
            })),
        });
    } catch (error) {
        throw new Error("Error at add products: " + error);
    }
    revalidatePath("/dashboard/products/create/import");
    redirect("/dashboard/products");
}
/*init
product a
    collectionIds = []
collection a 
    productIds = [productId1,productId2,productId3,...]

-->Them
product a
    collectionIds = [collectionIda,collectionIdb]
collection a 
    productIds = [productId1,productId2,productId3,...,productIda]
collection b 
    productIds = [productId1,productId2,productId3,...,productIda]
-->Sua
product a
    collectionIds = [collectionIdb]
collection a 
    productIds = [productId1,productId2,productId3,...]
collection b 
    productIds = [productId1,productId2,productId3,...,productIda]
*/
export async function getProducts(): Promise<FullProduct[]> {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                variations: {
                    where: {
                        deleted: false,
                    },
                },
                collections: true,
                properties: true,
                brand: true,
            },
            where: {
                deleted: false,
                isAvailable: true,
            },
            take: 50,
            orderBy: { createdAt: "desc" },
        });
        return products as FullProduct[];
    } catch (error) {
        throw new Error("Error getting products" + error);
    }
}
export async function getUnAvailableProducts(): Promise<FullProduct[]> {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                variations: true,
                collections: true,
                properties: true,
                brand: true,
            },
            where: {
                deleted: false,
                isAvailable: false,
            },
            take: 50,
            orderBy: { createdAt: "desc" },
        });
        return products as FullProduct[];
    } catch (error) {
        throw new Error("Error getting products" + error);
    }
}
export async function updateFieldProduct() {
    try {
        await prisma.product.updateMany({
            data: {
                propertyIds: [],
            },
        });
    } catch (error) {
        throw new Error("Error updating" + error);
    }
}
// export async function backupDataproduct(product: any, variations: any[]) {
//     try {
//         // console.log({ product: product, variations: variations });

//         const {
//             name,
//             description,
//             price,
//             gender,
//             categoryId,
//             collectionIds,
//             brandId,
//             countryOfOrigin,
//             isAvailable,
//             weight,
//             fit,
//             style,
//             material,
//             sku,
//             gallery,
//             slug,
//         } = product;

//         const res = await prisma.product.create({
//             data: {
//                 name,
//                 sku: sku,
//                 isAvailable: isAvailable,
//                 countryOfOrigin: countryOfOrigin,
//                 weight: weight,
//                 gender,
//                 description: description as string,
//                 price,
//                 slug,
//                 categoryId: categoryId || null,
//                 brandId: brandId || null,
//                 collectionIds: collectionIds,
//                 unitPrice: "USD",
//                 fit: fit,
//                 material: material,
//                 style: style,
//                 gallery,
//                 variations: {
//                     createMany: {
//                         data: variations.map((variation) => ({
//                             sku: variation.sku,
//                             name: variation.name,
//                             description: variation.description,
//                             images: variation.images,
//                             color: variation.color,
//                             size: variation.size,
//                             stock: variation.stock,
//                         })),
//                     },
//                 },
//             },
//         });
//         console.log(res);
//     } catch (error) {
//         throw new Error("Error at create product" + error);
//     }
// }

export async function getDeletedProducts(): Promise<FullProduct[]> {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                variations: true,
                collections: true,
                properties: true,
                brand: true,
            },
            where: {
                deleted: true,
            },
            take: 50,

            orderBy: { createdAt: "desc" },
        });
        return products;
    } catch (error) {
        throw new Error("Error at get deleted products" + error);
    }
}
export async function getAvailableProducts() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                variations: true,
            },
            where: {
                deleted: false,
                isAvailable: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return products as FullProduct[];
    } catch (error) {
        throw new Error("Error at get availableProdcuts" + error);
    }
}
export async function findProducts(value: string) {
    try {
        if (!value) return [];
        const products = await prisma.product.findMany({
            include: {
                category: true,
                variations: {
                    where: {
                        deleted: false,
                    },
                },
            },
            where: {
                AND: [
                    {
                        OR: [
                            {
                                name: {
                                    contains: value,
                                    mode: "insensitive",
                                },
                            },
                            {
                                category: {
                                    name: {
                                        contains: value,
                                        mode: "insensitive",
                                    },
                                },
                            },
                            {
                                brand: {
                                    name: {
                                        contains: value,
                                        mode: "insensitive",
                                    },
                                },
                            },
                            {
                                description: {
                                    contains: value,
                                    mode: "insensitive",
                                },
                            },
                            {
                                variations: {
                                    some: {
                                        color: {
                                            contains: value,
                                            mode: "insensitive",
                                        },
                                    },
                                },
                            },
                            {
                                summary: {
                                    contains: value,
                                    mode: "insensitive",
                                },
                            },
                            {
                                details: {
                                    contains: value,
                                    mode: "insensitive",
                                },
                            },
                            {
                                properties: {
                                    some: {
                                        value: {
                                            contains: value,
                                            mode: "insensitive",
                                        },
                                    },
                                },
                            },
                        ],
                    },
                    {
                        variations: {
                            some: {
                                stock: {
                                    gt: 0,
                                },
                            },
                        },
                    },
                ],

                isAvailable: true,
                deleted: false,
            },
            orderBy: { createdAt: "desc" },
        });

        return products as FullProduct[];
    } catch (error) {
        throw new Error("Error at find prodcuts" + error);
    }
}
export async function getProductById(id: string): Promise<DeepProduct> {
    noStore();
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: id,
            },
            include: {
                category: {
                    include: {
                        measurement: true,
                    },
                },
                properties: true,
                brand: true,
                collections: true,
                variations: {
                    where: {
                        deleted: false,
                    },
                },
            },
        });
        return product as DeepProduct;
    } catch (error) {
        throw new Error("Error at get product by Id" + error);
    }
}
export async function deleteProduct(id: string) {
    if (!id) {
        throw new Error("Missing Id in delete product");
    }
    try {
        await prisma.product.update({
            where: {
                id: id,
            },
            data: {
                deleted: true,
            },
        });
    } catch (error) {
        throw new Error("Error at delete product" + error);
    }
    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
}
export async function restoreProduct(id: string) {
    try {
        if (!id) {
            throw new Error("Missing Id in delete product");
        }

        await prisma.product.update({
            where: {
                id: id,
            },
            data: {
                deleted: false,
            },
        });
    } catch (error) {
        throw new Error("Error at delete product" + error);
    }
    revalidatePath("/dashboard/products/deleted");
    redirect("/dashboard/products/deleted");
}
const CreateProperty = propertyShema;
export async function createProperty(prevState: State, formData: FormData) {
    const validatedFields = CreateProperty.safeParse({
        name: formData.get("name"),
        values: formData.get("values"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create property.",
        };
    }

    // Prepare data for insertion into the database
    const { name, values } = validatedFields.data;
    const arrayValues = splitAndTrimString(values);

    try {
        const existed = await prisma.property.findMany({
            where: {
                AND: [
                    {
                        name: name,
                    },
                    {
                        value: { in: arrayValues },
                    },
                ],
            },
        });

        if (existed.length > 0) {
            const valuesExisted = existed.map((v) => v.value);
            return {
                errors: {},
                message: `Values ${valuesExisted.join(
                    ", "
                )} is already existed in property ${name}, Please remove those in form data`,
            };
        }
        for (const value of arrayValues) {
            await prisma.property.createMany({
                data: {
                    name,
                    value: value,
                },
            });
        }
    } catch (error) {
        throw new Error("Error at create property" + error);
    }
    revalidatePath("/dashboard/products/properties/create");
    redirect("/dashboard/products/properties");
}
const EditProperty = propertyShema;
export async function editProperty(
    propertyId: string,
    prevState: State,
    formData: FormData
) {
    if (!propertyId) {
        return {
            errors: {},
            message: "Missing property id Field.",
        };
    }
    const validatedFields = EditProperty.safeParse({
        name: formData.get("name"),
        values: formData.get("values"), // this is only one string value
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create property.",
        };
    }

    // Prepare data for insertion into the database
    const { name, values } = validatedFields.data;
    if (values.includes("|")) {
        return {
            errors: {},
            message: "Just edit one value at the same time",
        };
    }
    try {
        const existedProperty = await prisma.property.findFirst({
            where: {
                name: name,
                id: {
                    not: propertyId,
                },
            },
        });
        if (existedProperty) {
            return {
                errors: {},
                message: `${existedProperty.value} already existed in property ${existedProperty.name}. Please change another name or value`,
            };
        }

        await prisma.property.update({
            where: {
                id: propertyId,
            },
            data: {
                name,
                value: values,
            },
        });
    } catch (error) {
        throw new Error("Error at create property" + error);
    }
    redirect("/dashboard/products/properties");
}
export async function getProperties() {
    // Prepare data for insertion into the database

    try {
        const properties = await prisma.property.findMany({
            where: {
                deleted: false,
            },
        });

        return properties;
    } catch (error) {
        throw new Error("Error at create property" + error);
    }
    revalidatePath("/dashboard/products/create");
    redirect("/dashboard/products");
}
export async function getPropertyById(propertyId: string) {
    // Prepare data for insertion into the database
    if (!propertyId) {
        throw new Error("Error at property id at get property");
    }
    try {
        const property = await prisma.property.findUnique({
            where: {
                id: propertyId,
            },
        });
        return property;
    } catch (error) {
        throw new Error("Error at create property" + error);
    }
}
export async function getPropertiesByName(propertyName: string) {
    // Prepare data for insertion into the database
    if (!propertyName) {
        throw new Error("Missing property name at get property");
    }
    try {
        const properties = await prisma.property.findMany({
            where: {
                name: propertyName,
            },
        });
        return properties;
    } catch (error) {
        throw new Error("Error at create property" + error);
    }
}
export async function deleteProperty(propertyId: string) {
    if (!propertyId) {
        throw new Error("Missing property id in delete property");
    }
    try {
        await prisma.product.update({
            where: {
                id: propertyId,
            },
            data: {
                deleted: true,
            },
        });
    } catch (error) {
        throw new Error("Error at delete product" + error);
    }
    redirect("/dashboard/products/properties");
}
// export async function saveDraftProduct(
//     variations: Variation[],
//     prevState: State,
//     formData: FormData
// ) {
//     const validatedFields = CreateProduct.safeParse({
//         name: formData.get("name"),
//         weight: formData.get("weight"),
//         description: formData.get("description"),
//         categoryId: formData.get("categoryId"),
//         brandId: formData.get("brandId"),
//         collectionIds: formData.getAll("collectionIds"),
//         gender: formData.get("gender"),
//         isAvailable: formData.get("isAvailable"),
//         price: formData.get("price"),
//         material: formData.get("material"),
//         fit: formData.get("fit"),
//         style: formData.get("style"),
//         sku: formData.get("sku"),
//     });

//     if (!validatedFields.success) {
//         console.log(validatedFields.error.flatten().fieldErrors);

//         return {
//             errors: validatedFields.error.flatten().fieldErrors,
//             message: "Missing Fields. Failed to create Product.",
//         };
//     }

//     // Prepare data for insertion into the database
//     const {
//         name,
//         description,
//         price,
//         gender,
//         categoryId,
//         collectionIds,
//         brandId,
//         countryOfOrigin,
//         isAvailable,
//         weight,
//         fit,
//         style,
//         material,
//         sku,
//     } = validatedFields.data;

//     const saves =
//         JSON.parse(localStorage.getItem(LOCAL_STORAGE_SAVED_PRODUCTS) || "") ||
//         [];

//     // localStorage.setItem("");

//     revalidatePath("/dashboard/products/create");
//     redirect("/dashboard/products");
// }
