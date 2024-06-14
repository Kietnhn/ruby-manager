import {
    UserGroupIcon,
    HomeIcon,
    DocumentDuplicateIcon,
    ArchiveBoxIcon,
    Cog6ToothIcon,
    UsersIcon,
    HashtagIcon,
    RectangleGroupIcon,
    PhotoIcon,
    RectangleStackIcon,
    QueueListIcon,
    PlusIcon,
    PuzzlePieceIcon,
    TicketIcon,
    AdjustmentsVerticalIcon,
    Bars3BottomLeftIcon,
    ChatBubbleBottomCenterTextIcon,
    FlagIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { LinkType } from "./definitions";
import { ContactIcon } from "lucide-react";
import { DiscountType, PaymentMethods, StyleGender } from "@prisma/client";
import { SortByData } from "./definitions/product";
export const DEFAULT_LOCALE = "en-US";
export const DEFAULT_OFFSET_TABLE = 10;
export const GENDERS: StyleGender[] = ["MEN", "UNISEX", "WOMEN"];
export const PAYMENT_METHODS: PaymentMethods[] = [
    "OFFLINE",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "PAYPAL",
    "BANK_TRANSFER",
    "COD",
];

export const DISCOUNTS_TYPE: DiscountType[] = [
    "FIXED",
    "PERCENTAGE",
    "SHIPPING",
];
export const PAYMENT_STATUS = ["PAID", "PENDING", "FAILED"];
export const ORDER_STATUS = ["CREATED", "PROCESSING", "COMPLETED", "CANCELLED"];

export const UPLOAD_PRODUCTS_EXAMPLE = [
    {
        name: "Demo product",
        sku: "UOUBUCUCU1234567",
        weight: 0.6,
        gender: "UNISEX",
        description: "Demo description in product",
        price: 45,
        unitPrice: "USD",
        fit: "normal",
        material: "polyester",
        style: "casual",
    },

    {
        name: "Teset product",
        sku: "UOUBUCUCU1234568",
        weight: 1.3,
        gender: "WOMEN",
        description: "Demo description in test",
        price: 20,
        unitPrice: "USD",
        fit: "normal",
        material: "null",
        style: "null",
    },

    {
        name: "Product first",
        sku: "UOUBUCUCU1234569",
        weight: 1.1,
        gender: "MEN",
        description: "Description product first",
        price: 19,
        unitPrice: "USD",
        fit: "null",
        material: "null",
        style: "casual",
    },
];
export const MENU_SORT_BY: SortByData[] = [
    {
        key: "name-desc",
        label: "Name: Desc",
        value: "name",
        direction: "desc",
    },
    {
        key: "name-asc",
        label: "Name: Asc",
        value: "name",
        direction: "asc",
    },
    {
        key: "newest",
        label: "New release",
        value: "releaseAt",
        direction: "desc",
    },
    {
        key: "oldest",
        label: "Old release",
        value: "releaseAt",
        direction: "asc",
    },
    // {
    //     key: "price-low-to-high",
    //     label: "Price: Low To High",
    //     value: "price",
    //     direction: "asc",
    // },
    // {
    //     key: "price-high-to-low",
    //     label: "Price: High To Low",
    //     value: "price",
    //     direction: "desc",
    // },
    // {
    //     key: "sale-price-low-to-high",
    //     label: "Sale Price: Low To High",
    //     value: "salePrice",
    //     direction: "asc",
    // },
    // {
    //     key: "sale-price-high-to-low",
    //     label: "Sale Price: High To Low",
    //     value: "salePrice",
    //     direction: "desc",
    // },
    {
        key: "created-at-asc",
        label: "Created At: Asc",
        value: "createdAt",
        direction: "asc",
    },
    {
        key: "created-at-desc",
        label: "Created At: Desc",
        value: "createdAt",
        direction: "desc",
    },
    {
        key: "updated-at-asc",
        label: "Updated At: Asc",
        value: "updatedAt",
        direction: "asc",
    },
    {
        key: "updated-at-desc",
        label: "Updated At: Desc",
        value: "updatedAt",
        direction: "desc",
    },
];
// settings
// themes
export const AVAILABLE_THEMES: string[] = ["light", "dark"];
// date formats
export const DATE_FORMATS: string[] = [
    "MM/DD/YYYY",
    "DD/MM/YYYY",
    "YYYY/MM/DD",
    "YYYY-MM-DD",
];
// time formats
export const TIME_FORMATS: string[] = ["12", "24"];
// languages
export const AVAILABLE_LANGUAGES: string[] = ["English", "Vietnamese"];

export const LOCAL_STORAGE_SAVED_PRODUCTS = "LOCAL_STORAGE_SAVED_PRODUCTS";

// meu
export const ASIDE_MENU_LINKS: LinkType[] = [
    { name: "Home", href: "/dashboard", icon: HomeIcon, sublinks: [] },
    {
        name: "Products",
        href: "",
        icon: ArchiveBoxIcon,
        sublinks: [
            {
                name: "All products",
                href: "/dashboard/products",
                icon: QueueListIcon,
                sublinks: [],
            },
            {
                name: "Add product",
                href: "/dashboard/products/create",
                icon: PlusIcon,
                sublinks: [],
            },
            {
                name: "Properties",
                href: "/dashboard/products/properties",
                icon: PuzzlePieceIcon,
                sublinks: [],
            },
            {
                name: "Reviews",
                href: "/dashboard/products/reviews",
                icon: ChatBubbleBottomCenterTextIcon,
                sublinks: [],
            },
        ],
    },
    {
        name: "Organizations",
        href: "",
        icon: AdjustmentsVerticalIcon,
        sublinks: [
            {
                name: "Brands",
                href: "/dashboard/brands",
                icon: HashtagIcon,
                sublinks: [],
            },
            {
                name: "Categories",
                href: "/dashboard/categories",
                icon: Bars3BottomLeftIcon,
                sublinks: [],
            },
            {
                name: "Collections",
                href: "/dashboard/collections",
                icon: RectangleGroupIcon,
                sublinks: [],
            },
        ],
    },
    {
        name: "Discounts",
        href: "/dashboard/discounts",
        icon: TicketIcon,
        sublinks: [],
    },
    {
        name: "Users",
        href: "",
        icon: ContactIcon,
        sublinks: [
            {
                name: "Customers",
                href: "/dashboard/customers",
                icon: UserGroupIcon,
                sublinks: [],
            },
            {
                name: "Employees",
                href: "/dashboard/employees",
                icon: UsersIcon,
                sublinks: [],
            },
        ],
    },

    {
        name: "Orders",
        href: "/dashboard/orders",
        icon: DocumentDuplicateIcon,
        sublinks: [],
    },
    {
        name: "Shop pages",
        href: "",
        icon: FlagIcon,
        sublinks: [
            {
                name: "Static Pages",
                href: "/dashboard/pages",
                icon: RectangleStackIcon,
                sublinks: [],
            },
            {
                name: "Dynamic Sections",
                href: "/dashboard/sections",
                icon: Squares2X2Icon,
                sublinks: [],
            },
        ],
    },

    {
        name: "Photos",
        href: "/dashboard/photos",
        icon: PhotoIcon,
        sublinks: [],
    },
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Cog6ToothIcon,
        sublinks: [],
    },
];
export const FLAT_ASIDE_MENU_LINKS: LinkType[] = [
    { name: "Home", href: "/dashboard", icon: HomeIcon, sublinks: [] },
    {
        name: "Products",
        href: "/dashboard/products",
        icon: ArchiveBoxIcon,
        sublinks: [],
    },
    {
        name: "Properties",
        href: "/dashboard/products/properties",
        icon: PuzzlePieceIcon,
        sublinks: [],
    },
    {
        name: "Reviews",
        href: "/dashboard/products/reviews",
        icon: ChatBubbleBottomCenterTextIcon,
        sublinks: [],
    },
    {
        name: "Brands",
        href: "/dashboard/brands",
        icon: HashtagIcon,
        sublinks: [],
    },
    {
        name: "Categories",
        href: "/dashboard/categories",
        icon: Bars3BottomLeftIcon,
        sublinks: [],
    },
    {
        name: "Collections",
        href: "/dashboard/collections",
        icon: RectangleGroupIcon,
        sublinks: [],
    },
    {
        name: "Discounts",
        href: "/dashboard/discounts",
        icon: TicketIcon,
        sublinks: [],
    },
    {
        name: "Customers",
        href: "/dashboard/customers",
        icon: UserGroupIcon,
        sublinks: [],
    },
    {
        name: "Employees",
        href: "/dashboard/employees",
        icon: UsersIcon,
        sublinks: [],
    },
    {
        name: "Orders",
        href: "/dashboard/orders",
        icon: DocumentDuplicateIcon,
        sublinks: [],
    },
    {
        name: "Static Pages",
        href: "/dashboard/pages",
        icon: RectangleStackIcon,
        sublinks: [],
    },
    {
        name: "Dynamic Sections",
        href: "/dashboard/sections",
        icon: Squares2X2Icon,
        sublinks: [],
    },
    {
        name: "Photos",
        href: "/dashboard/photos",
        icon: PhotoIcon,
        sublinks: [],
    },
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Cog6ToothIcon,
        sublinks: [],
    },
];
export const ASIDE_MENU: LinkType[] = [
    { name: "Home", href: "/dashboard", icon: HomeIcon, sublinks: [] },
    {
        name: "Products",
        href: "",
        icon: ArchiveBoxIcon,
        sublinks: [
            {
                name: "All products",
                href: "/dashboard/products",
                icon: QueueListIcon,
                sublinks: [],
            },
            {
                name: "Add product",
                href: "/dashboard/products/create",
                icon: PlusIcon,
                sublinks: [],
            },
            {
                name: "Properties",
                href: "/dashboard/products/properties",
                icon: PuzzlePieceIcon,
                sublinks: [],
            },
        ],
    },
    {
        name: "Organizations",
        href: "",
        icon: AdjustmentsVerticalIcon,
        sublinks: [
            {
                name: "Brands",
                href: "/dashboard/brands",
                icon: HashtagIcon,
                sublinks: [],
            },
            {
                name: "Categories",
                href: "/dashboard/categories",
                icon: Bars3BottomLeftIcon,
                sublinks: [],
            },
            {
                name: "Collections",
                href: "/dashboard/collections",
                icon: RectangleGroupIcon,
                sublinks: [],
            },
        ],
    },
    {
        name: "Discounts",
        href: "/dashboard/discounts",
        icon: TicketIcon,
        sublinks: [],
    },
    {
        name: "Users",
        href: "",
        icon: ContactIcon,
        sublinks: [
            {
                name: "Customers",
                href: "/dashboard/customers",
                icon: UserGroupIcon,
                sublinks: [],
            },
            {
                name: "Employees",
                href: "/dashboard/employees",
                icon: UsersIcon,
                sublinks: [],
            },
        ],
    },

    {
        name: "Orders",
        href: "/dashboard/orders",
        icon: DocumentDuplicateIcon,
        sublinks: [],
    },
    {
        name: "Pages",
        href: "/dashboard/pages",
        icon: RectangleStackIcon,
        sublinks: [],
    },
    {
        name: "Photos",
        href: "/dashboard/photos",
        icon: PhotoIcon,
        sublinks: [],
    },
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Cog6ToothIcon,
        sublinks: [],
    },
];
