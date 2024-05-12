"use client";
import Breadcrumbs from "@/components/breadcrumbs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/table";
import { addProductsWithXlsx } from "@/lib/actions/product";
import { UPLOAD_PRODUCTS_EXAMPLE } from "@/lib/constants";
import { FullProduct, UploadProduct } from "@/lib/definitions";
import { exportToXLSX } from "@/lib/utils";
import {
    ArrowDownTrayIcon,
    ExclamationTriangleIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import {
    Button,
    Card,
    CardBody,
    Input,
    Listbox,
    ListboxItem,
} from "@nextui-org/react";
import { Product, StyleGender } from "@prisma/client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
const listNotes = [
    {
        key: "extension",
        label: "File with .xlsx or .xls extension",
    },
    {
        key: "limit",
        label: "  Size &lt; 10MB",
    },

    {
        key: "prepare",
        label: " Use available format to prepare submit",
    },
];
const ImportProductsPage = () => {
    const [data, setData] = useState<UploadProduct[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string>("");
    const handleUploadXLSX = (file: File) => {
        const reader = new FileReader();
        if (!file) {
            setError("Missing file upload");
            return;
        }

        const limit = 10 * 1024; // 10 MB
        if (file.size > limit) {
            setError(
                "File axceeded limit, please submit a file has size <" + limit
            );
            return;
        }
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            setData(parsedData as UploadProduct[]);
        };
    };

    const addProducts = async () => {
        if (!(products.length > 0)) return;
        const result = await addProductsWithXlsx(products);
        if (result.message) {
            setError(result.message);
        }
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        handleUploadXLSX(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            const uploadedFile = e.target.files[0];
            handleUploadXLSX(uploadedFile);
        }
    };
    const clearProducts = () => {
        setProducts([]);
        setData([]);
    };
    useEffect(() => {
        // const newProducts: Product[] = data.map((product) => ({
        //     id: "",
        //     slug: "",
        //     discountId: null,
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        //     name: product.name,
        //     weight: +product.weight,
        //     description: product?.description || "",
        //     fit: product?.fit || null,
        //     gender: product.gender as StyleGender,
        //     gallery: [],
        //     isAvailable: false,
        //     material: product?.material || null,
        //     price: +product.price,
        //     sku: product.sku || "",
        //     style: product?.style || null,
        //     unitPrice: product.unitPrice,
        //     brandId: null,
        //     categoryId: null,
        //     collectionId: null,
        //     countryOfOrigin: null,
        //     active: true,
        // }));
        // setProducts(newProducts);
    }, [data]);

    return (
        <main className="">
            <div className="mb-4">
                <Breadcrumbs
                    wrapper="mb-0"
                    breadcrumbs={[
                        {
                            href: "/dashboard/products",
                            label: "Products",
                        },
                        {
                            href: "/dashboard/products/create",
                            label: "Create new product",
                        },
                        {
                            href: "/dashboard/products/create/import",
                            label: "Import",
                            active: true,
                        },
                    ]}
                />
            </div>
            <div className="flex gap-4">
                <Card
                    className="w-1/2 dragover"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <div className="flex flex-col justify-center items-center h-full">
                        <ArrowDownTrayIcon className="w-12 h-12" />
                        <h3>Drag & Drop File Upload</h3>
                        <input
                            type="file"
                            id="fileInput"
                            onChange={handleFileUpload}
                            style={{ display: "none" }}
                        />
                        <label
                            htmlFor="fileInput"
                            className="cursor-pointer text-blue-600"
                        >
                            Click here or drag a file to upload
                        </label>
                    </div>
                </Card>

                <div className="w-1/2">
                    <Card>
                        <CardBody>
                            <div className="flex justify-center">
                                <div className="flex flex-col items-center">
                                    <ExclamationTriangleIcon className="w-8 h-8 text-warning-500" />
                                    <strong>Warming before upload</strong>
                                </div>
                            </div>
                            <Listbox
                                aria-label="Actions"
                                disabledKeys={[
                                    "extension",
                                    "limit",
                                    "must",
                                    "not-null",
                                    "prepare",
                                ]}
                                items={listNotes}
                            >
                                {(item) => (
                                    <ListboxItem
                                        key={item.key}
                                        classNames={{ base: "opacity-1" }}
                                    >
                                        {item.label}
                                    </ListboxItem>
                                )}
                            </Listbox>
                            <Button
                                onClick={() =>
                                    exportToXLSX(
                                        UPLOAD_PRODUCTS_EXAMPLE,
                                        "productsExample"
                                    )
                                }
                                color="primary"
                                className="mt-4"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Click here to download
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
            {data.length > 0 && (
                <div className="mt-4">
                    <h3 className="">Uploaded</h3>

                    <div className="overflow-auto max-h-96 ">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {Object.keys(data[0]).map((header) => (
                                        <TableCell
                                            key={header}
                                            className="font-semibold"
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item, index) => (
                                    <TableRow key={index}>
                                        {Object.values(item).map(
                                            (value: string, i) => (
                                                <TableCell
                                                    key={`${value}-${i}`}
                                                >
                                                    {value?.toString()}
                                                </TableCell>
                                            )
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
            {error.length > 0 && <p className="text-red-500">{error}</p>}
            {data.length > 0 && (
                <div className="mt-4 flex justify-end items-center gap-4">
                    <Button color="default" onClick={clearProducts}>
                        <TrashIcon className="w-5 h-5" /> Clear products
                    </Button>
                    <Button color="primary" onClick={addProducts}>
                        <PlusIcon className="w-5 h-5" /> Add products
                    </Button>
                </div>
            )}
        </main>
    );
};

export default ImportProductsPage;
