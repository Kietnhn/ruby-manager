import { z } from "zod";
import { ORDER_STATUS } from "./constants";
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export const resetPasswordSchema = z.object({
    email: z.string().email(),
});
export const newPasswordSchema = z.object({
    password: z.string().min(6),
});
export const userSchema = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    email: z.string().email({ message: "Please enter your email" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});
export const productSchema = z.object({
    id: z.string().optional(), // Since it's auto-generated
    name: z.string().min(1, { message: "Name is required" }),
    sku: z
        .string()
        .min(0) // Allow empty string (optional)
        .max(16) // Maximum length of 16 characters
        .refine((value) => !value || value.length === 16, {
            message: "SKU can be empty or must have exactly 16 characters",
        }),
    // slug: z.string().optional(),
    description: z.string().optional(),
    summary: z.string().optional(),
    details: z.string().optional(),
    weight: z.coerce
        .number()
        .gt(0, { message: "Please enter weight greater than 0." }),
    categoryId: z.string().nullish(),
    brandId: z.string().nullish(),
    discountId: z.string().nullish(),
    collectionIds: z.string().array().optional(),
    gender: z.enum(["MEN", "WOMEN", "UNISEX"]).default("UNISEX"),
    price: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }), // Assuming Price is already defined
    salePrice: z.coerce.number().optional(),
    countryOfOrigin: z.string().optional(),
    isAvailable: z.coerce.boolean(),
    propertyIds: z.string().array().optional(),
    releaseAt: z
        .string()
        .optional()
        .transform((value) => {
            if (value && value.trim().length > 0) {
                return new Date(value);
            }
            return value;
        }),

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const customerSchema = z.object({
    firstName: z.string({ required_error: "First name is required" }),
    lastName: z.string().optional(),
    email: z.string().email({ message: "Please enter your email" }),
    gender: z.enum(["MALE", "FEMALE"]),
    dateOfBirth: z.coerce.date({ required_error: "Date of Birth is required" }),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    addressLine: z.string().optional(),
    postalCode: z.string().optional(),
});

export const orderSchema = z.object({
    employee: z.string(),
    customer: z.string(),
    paymentMethod: z.enum(
        [
            "OFFLINE",
            "CREDIT_CARD",
            "DEBIT_CARD",
            "PAYPAL",
            "BANK_TRANSFER",
            "COD",
        ],
        {
            errorMap: (issue, ctx) => ({
                message: "Please select a payment method",
            }),
        }
    ),
});
export const discountShema = z
    .object({
        name: z.string().min(1, { message: "Name is required" }),
        code: z.string({ required_error: "Code is required" }).min(6),
        description: z.string(),
        quantity: z.coerce
            .number()
            .gt(0, { message: "Please enter quantity greater than 0." }),
        value: z.coerce
            .number()
            .gt(0, { message: "Please enter a value greater than $0." }),
        minTotalPrice: z.coerce.number().optional(),
        discountType: z.enum(["FIXED", "PERCENTAGE", "SHIPPING"], {
            errorMap: (issue, ctx) => ({
                message: "Please select a type",
            }),
        }),
        startDate: z.coerce.date().refine((data) => data > new Date(), {
            message: "Start date must greater than  now",
        }),

        endDate: z.coerce.date(),
        isPublic: z.coerce.boolean(),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: "End date cannot be earlier than start date.",
        path: ["endDate"],
    });
export const brandShema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    code: z
        .string({ required_error: "Code is required" })
        .length(2, { message: "Code is 2 unique characters" }),
    description: z.string().optional(),
    logo: z.string().min(1, { message: "Logo is required" }),
    url: z.string().min(1, { message: "Url is required" }),
    slogan: z.string().optional(),
});
export const categoryShema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    code: z
        .string({ required_error: "Code is required" })
        .length(2, { message: "Code is 2 unique characters" }),
    parentId: z.string().nullish(),
    measurementId: z.string().nullish(),
});
export const measurementShema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    sizes: z.string().min(1, { message: "Size is required" }),
});
export const propertyShema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    values: z.string().min(1, { message: "Values is required" }),
});
export const collectionSchema = z.object({
    name: z.string(),
    image: z.string(),
    code: z
        .string({ required_error: "Code is required" })
        .length(2, { message: "Code is 2 unique characters" }),
    description: z.string().optional(),
});
export const pageSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    body: z.string().min(1, { message: "Body is required" }),
    description: z.string().optional(),
    handle: z.string().min(1, { message: "Handle is required" }),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    public: z.coerce.date().refine((data) => data > new Date(), {
        message: "Start date must greater than  now",
    }),
    parentId: z.string().nullish(),
});
