"use server";

import { Gallery, Product, Size, Variation } from "@prisma/client";
import { productSchema, propertyShema } from "../schema";
import {
    DeepProduct,
    FullProduct,
    IFindProduct,
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
    getUniqueColors,
    getUniqueSizes,
    getVariationHaveQuantity,
    splitAndTrimString,
} from "../utils";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { DEFAULT_OFFSET_TABLE } from "../constants";
import { ProductFilterOptions, SortByData } from "../definitions/product";
import { IActionVariation } from "../definitions/variation";
import { createUniqueStringArray } from "../utils/product";
import { generateVariationUniqueSKU } from "../utils/variation";
// dashboard/product
const CreateProduct = productSchema;
type PayloadAddProduct = {
    variations: VariationNoImages[];
    gallery: TGallery[];
};
export async function addProduct(
    // payloadAddProduct: PayloadAddProduct,
    prevState: State,
    formData: FormData
) {
    const validatedFields = CreateProduct.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        summary: formData.get("summary"),
        details: formData.get("details"),
        categoryId: formData.get("categoryId"),
        brandId: formData.get("brandId"),
        gender: formData.get("gender"),

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
        gender,
        categoryId,
        brandId,

        propertyIds,
        sku,
        releaseAt,
    } = validatedFields.data;

    let productSku = sku;
    if (productSku) {
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
    productSku = await generateUniqueSKU(brandId || "", categoryId, gender);
    let createdProductId: string = "";
    try {
        await prisma.$transaction(async (tx) => {
            const createdProduct = await tx.product.create({
                data: {
                    name,
                    releaseAt: releaseAt || null,
                    sku: productSku as string,
                    details,
                    summary,
                    gender,
                    description: description as string,
                    gallery: [],
                    categoryId: categoryId,
                    brandId: brandId || null,

                    propertyIds: propertyIds,
                },
            });
            createdProductId = createdProduct.id;
            // add properties
            if (propertyIds && propertyIds.length > 0) {
                console.log("update property");

                await tx.property.updateMany({
                    where: {
                        id: {
                            in: propertyIds,
                        },
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
    redirect(`/dashboard/products/${createdProductId}/variations/create`);
}
// export async function addProduct(
//     payloadAddProduct: PayloadAddProduct,
//     prevState: State,
//     formData: FormData
// ) {
//     const validatedFields = CreateProduct.safeParse({
//         name: formData.get("name"),
//         weight: formData.get("weight"),
//         description: formData.get("description"),
//         summary: formData.get("summary"),
//         details: formData.get("details"),
//         categoryId: formData.get("categoryId"),
//         brandId: formData.get("brandId"),
//         collectionIds: formData.getAll("collectionIds"),
//         gender: formData.get("gender"),
//         isAvailable: formData.get("isAvailable"),
//         discountId: formData.get("discountId"),
//         price: formData.get("price"),
//         salePrice: formData.get("salePrice"),
//         propertyIds: formData.getAll("propertyIds"),
//         releaseAt: formData.get("releaseAt"),
//         sku: formData.get("sku"),
//         gallery: payloadAddProduct.gallery,
//         variations: payloadAddProduct.variations,
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
//         details,
//         summary,
//         price,
//         gender,
//         categoryId,
//         collectionIds,
//         brandId,
//         countryOfOrigin,
//         isAvailable,
//         weight,
//         propertyIds,
//         sku,
//         releaseAt,
//         discountId,
//         salePrice,
//         gallery,
//         variations,
//     } = validatedFields.data;

//     if (isAvailable) {
//         const allVariationsHaveStock = variations.every(
//             (variation) => variation.stock > 0
//         );
//         if (!allVariationsHaveStock) {
//             return {
//                 errors: {},
//                 message:
//                     "When available, all variations must have stock greater than 0",
//             };
//         }
//     }
//     let productSku = sku;
//     if (productSku) {
//         const existedProductSKU = await prisma.product.findFirst({
//             where: {
//                 sku: productSku,
//             },
//         });
//         if (existedProductSKU) {
//             return {
//                 errors: {},
//                 message: "SKU is existed",
//             };
//         }
//     }
//     productSku = await generateUniqueSKU(
//         countryOfOrigin as string,
//         "",
//         categoryId || "",
//         "",
//         gender
//     );

//     const newVariations: IActionVariation[] = [];
//     for (const galleryItem of gallery) {
//         const variationSku = await generateVariationUniqueSKU();
//         const matchVariation = variations.find(
//             (variation) => variation.color === galleryItem.color
//         );
//         const groupedSize: Size[] = variations
//             .filter((variation) => variation.color === galleryItem.color)
//             .map((variation) => ({
//                 size: variation.size,
//                 stock: variation.stock,
//             }));
//         if (!matchVariation) {
//             throw new Error("Variation missed match");
//         }
//         newVariations.push({
//             sku: variationSku,
//             deleted: false,
//             name: matchVariation.name || name,
//             description: matchVariation.description || null,
//             color: matchVariation.color,
//             sizes: groupedSize,
//         });
//     }

//     try {
//         await prisma.$transaction(async (tx) => {
//             const createdProduct = await tx.product.create({
//                 data: {
//                     name,
//                     releaseAt: releaseAt || null,
//                     sku: productSku as string,
//                     isAvailable: isAvailable,
//                     details,
//                     summary,
//                     countryOfOrigin: countryOfOrigin,
//                     weight: weight,
//                     gender,
//                     description: description as string,

//                     price,
//                     discountId: discountId,
//                     salePrice: salePrice,
//                     slug: convertToSlug(name),
//                     categoryId: categoryId || null,
//                     brandId: brandId || null,

//                     collectionIds: collectionIds,
//                     propertyIds: propertyIds,
//                     priceCurrency: "USD",

//                     gallery: gallery,
//                     variations: {
//                         createMany: {
//                             data: newVariations,
//                         },
//                     },
//                 },
//             });
//             // add properties
//             if (propertyIds && propertyIds.length > 0) {
//                 console.log("update property");

//                 await tx.property.updateMany({
//                     where: {
//                         id: {
//                             in: propertyIds,
//                         },
//                     },
//                     data: {
//                         productIds: {
//                             push: createdProduct.id,
//                         },
//                     },
//                 });
//             }
//             if (discountId) {
//                 console.log("update discount");

//                 await tx.discount.update({
//                     where: {
//                         id: discountId,
//                     },
//                     data: {
//                         quantity: {
//                             decrement: 1,
//                         },
//                     },
//                 });
//             }
//             console.log(collectionIds);

//             if (collectionIds && collectionIds.length > 0) {
//                 console.log("update collections");

//                 await tx.collection.updateMany({
//                     where: {
//                         id: { in: collectionIds },
//                     },
//                     data: {
//                         productIds: {
//                             push: createdProduct.id,
//                         },
//                     },
//                 });
//             }
//         });
//     } catch (error) {
//         throw new Error("Error at add product: " + error);
//     }
//     revalidatePath("/dashboard/products/create");
//     redirect("/dashboard/products");
// }

const EditProduct = productSchema;
interface PayloadEditProduct extends PayloadAddProduct {}
export async function editProduct(
    productId: string,
    prevState: State,
    formData: FormData
) {
    console.log("productId", productId);

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
        gallery: payloadEditProduct.gallery,
        variations: payloadEditProduct.variations,
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
        gallery,
        variations,
    } = validatedFields.data;

    if (isAvailable) {
        const allVariationsHaveStock = variations.every(
            (variation) => variation.stock > 0
        );
        if (!allVariationsHaveStock) {
            return {
                errors: {},
                message:
                    "When available, all variations must have stock greater than 0",
            };
        }
    }

    let productSku = sku;
    if (productSku) {
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
    productSku = await generateUniqueSKU(
        countryOfOrigin as string,
        brandId || "",
        categoryId || "",
        "",
        gender
    );

    const newVariations: IActionVariation[] = [];
    for (const galleryItem of gallery) {
        const variationSku = await generateVariationUniqueSKU();
        const matchVariation = variations.find(
            (variation) => variation.color === galleryItem.color
        );
        const groupedSize: Size[] = variations
            .filter((variation) => variation.color === galleryItem.color)
            .map((variation) => ({
                size: variation.size,
                stock: variation.stock,
            }));
        if (!matchVariation) {
            throw new Error("Variation missed match");
        }
        newVariations.push({
            sku: variationSku,
            deleted: false,
            name: matchVariation.name || name,
            description: matchVariation.description || null,
            color: matchVariation.color,
            sizes: groupedSize,
        });
    }
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
                    gallery: gallery,
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

            const newVariationsSkus = newVariations.map(
                (variation) => variation.sku
            );
            // Identify variations to delete
            const variationsToDelete = existingVariations.filter(
                (variation) =>
                    !newVariationsSkus.includes(variation.sku) &&
                    variation.deleted === false
            );
            console.log("variationsToDelete", variationsToDelete);

            // Identify variations to add or update
            const variationsToAddOrUpdate = newVariations.map((variation) => {
                const matchExistedVariation = existingVariations.find(
                    (v) => v.sku === variation.sku && v.deleted === true
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
                        sizes: variation.sizes,
                        color: variation.color,
                        productId: productId,
                        deleted: false,
                    },
                    create: {
                        sku: variation.sku,
                        name: variation.name,
                        description: variation.description,
                        sizes: variation.sizes,
                        color: variation.color,
                        productId: productId,
                        deleted: false,
                    },
                });
                console.log("upsert", JSON.stringify(upserted));
            }

            console.table("upserted variants");

            const propertiesBeforeUpdate = await tx.property.findMany({
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

            const propertiesBeforeUpdateIds = propertiesBeforeUpdate.map(
                (collection) => collection.id
            );
            const changePropertyIds = differenceArray(
                propertyIds || [],
                propertiesBeforeUpdateIds
            );
            console.log("Changed properties", changePropertyIds);

            if (changePropertyIds.length !== 0) {
                console.log("updating properties");
                // remove all properties have product id
                for (const propertyId of propertiesBeforeUpdateIds) {
                    const matchedProperty = propertiesBeforeUpdate.find(
                        (collection) => collection.id === propertyId
                    );
                    if (!matchedProperty)
                        throw new Error("Collection not found");
                    const removedCurrentProductId =
                        matchedProperty.productIds.filter(
                            (pId) => pId !== productId
                        );
                    await tx.property.update({
                        where: {
                            id: propertyId,
                        },
                        data: {
                            productIds: removedCurrentProductId,
                        },
                    });
                }
                // update like create product
                await tx.property.updateMany({
                    where: {
                        id: { in: propertyIds },
                    },
                    data: {
                        productIds: {
                            push: updatedProduct.id,
                        },
                    },
                });
                console.log("updated properties");
            }

            // if (!collectionIds || collectionIds.length === 0) return;
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
                collectionIds || [],
                collectionBeforeUpdateIds
            );
            console.log("Changed collection", changedCollectionIds);

            if (changedCollectionIds.length !== 0) {
                console.log("updating collections");
                // remove all collections have product id
                for (const collectionId of collectionBeforeUpdateIds) {
                    const matchedCollection = collectionsBeforeUpdate.find(
                        (collection) => collection.id === collectionId
                    );
                    if (!matchedCollection)
                        throw new Error("Collection not found");
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
                console.log("updated collections");
            }
        });
    } catch (error) {
        throw new Error("Error at edit product: " + error);
    }
    revalidatePath(`/dashboard/products/${productId}/edit`);
    redirect("/dashboard/products");
}
// async function updateProductWithVariations(
//     productId: string,
//     newVariations: Variation[]
// ): Promise<Variation[]> {
//     // Fetch existing variations for the product
//     const existingVariations = await prisma.variation.findMany({
//         where: { productId: productId },
//     });

//     // Map existing variations by id for quick lookup
//     // const existingVariationsMap = existingVariations.reduce((map, variation) => {
//     //   map[variation.id] = variation;
//     //   return map;
//     // }, {} as Record<string, Variation>);

//     // Map new variations by sku for quick lookup
//     const newVariationsMap = newVariations.reduce((map, variation) => {
//         map[variation.sku] = variation;
//         return map;
//     }, {} as Record<string, Variation>);

//     // Identify variations to delete
//     const variationsToDelete = existingVariations.filter(
//         (variation) => !newVariationsMap[variation.sku]
//     );

//     // Identify variations to add or update
//     const variationsToAddOrUpdate = newVariations.map((variation) => ({
//         ...variation,
//         productId: productId,
//     }));

//     // Perform deletion
//     await prisma.variation.deleteMany({
//         where: {
//             id: { in: variationsToDelete.map((variation) => variation.id) },
//             orderProducts: {
//                 none: {}, // This checks that there are  related OrderProduct records
//             },
//         },
//     });
//     await prisma.variation.updateMany({
//         where: {
//             id: { in: variationsToDelete.map((variation) => variation.id) },
//             orderProducts: {
//                 some: {}, // This checks that there are  related OrderProduct records
//             },
//         },
//         data: {
//             deleted: true,
//         },
//     });

//     // Perform upsert (add or update) operations
//     const upsertedVariations = await Promise.all(
//         variationsToAddOrUpdate.map((variation) =>
//             prisma.variation.upsert({
//                 where: { sku: variation.sku },
//                 update: {
//                     name: variation.name,
//                     description: variation.description,
//                     stock: variation.stock,
//                     size: variation.size,
//                     color: variation.color,
//                     productId: productId,
//                 },
//                 create: {
//                     sku: variation.sku,
//                     name: variation.name,
//                     description: variation.description,
//                     stock: variation.stock,
//                     size: variation.size,
//                     color: variation.color,
//                     productId: productId,
//                 },
//             })
//         )
//     );

//     return upsertedVariations;
// }

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
                variations: true,
                properties: true,
                brand: true,
            },
            where: {
                deleted: false,
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
        await prisma.variation.updateMany({
            data: {
                deleted: false,
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
type SearchProductParams = {
    value: string;
    filterOptions: ProductFilterOptions;
    sortOption?: SortByData | undefined;
    page: number;
    limit?: number;
};
export async function searchProducts({
    value,
    filterOptions,
    sortOption,
    page = 0,
    limit = DEFAULT_OFFSET_TABLE,
}: SearchProductParams): Promise<FullProduct[]> {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                variations: true,
                properties: true,
                brand: true,
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
                                sku: {
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
                        ],
                    },
                    filterOptions.gender.length > 0
                        ? {
                              gender: {
                                  in: filterOptions.gender,
                              },
                          }
                        : {},
                    filterOptions.brand.length > 0
                        ? { brand: { code: { in: filterOptions.brand } } }
                        : {},
                    filterOptions.category.length > 0
                        ? { category: { code: { in: filterOptions.category } } }
                        : {},

                    filterOptions.property.length > 0
                        ? {
                              properties: {
                                  some: {
                                      id: { in: filterOptions.property },
                                  },
                              },
                          }
                        : {},
                ],

                deleted: false,
            },
            skip: page * limit,
            take: limit,
            orderBy: sortOption
                ? {
                      [sortOption.value]: sortOption.direction,
                  }
                : { createdAt: "desc" },
        });

        return products;
    } catch (error) {
        throw new Error("Error at find prodcuts" + error);
    }
}
export async function getTotalPagesOfProduct(
    value: string,
    filterOptions: ProductFilterOptions
): Promise<number> {
    try {
        const totalSearchedProduct = await prisma.product.count({
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
                        ],
                    },
                    filterOptions.gender.length > 0
                        ? {
                              gender: {
                                  in: filterOptions.gender,
                              },
                          }
                        : {},
                    filterOptions.brand.length > 0
                        ? { brand: { code: { in: filterOptions.brand } } }
                        : {},
                    filterOptions.category.length > 0
                        ? { category: { code: { in: filterOptions.category } } }
                        : {},

                    filterOptions.property.length > 0
                        ? {
                              properties: {
                                  some: {
                                      id: { in: filterOptions.property },
                                  },
                              },
                          }
                        : {},
                ],

                deleted: false,
            },
        });

        const totalPages = Math.ceil(
            totalSearchedProduct / DEFAULT_OFFSET_TABLE
        );
        return totalPages;
    } catch (error) {
        throw new Error("Error at find prodcuts" + error);
    }
}
export async function findProducts(
    value: string,
    take: number = 20,
    skip: number = 0
): Promise<IFindProduct[]> {
    if (!value) return [];
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                variations: true,
            },
            where: {
                OR: [
                    {
                        name: {
                            contains: value,
                            mode: "insensitive",
                        },
                    },
                    {
                        sku: {
                            contains: value,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: value,
                            mode: "insensitive",
                        },
                    },
                ],

                // variations: {
                //     some: {
                //         stock: {
                //             gt: 0,
                //         },
                //         deleted: false,
                //     },
                // },

                deleted: false,
            },
            take: take,
            skip: skip,
            orderBy: { createdAt: "desc" },
        });

        return products;
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
